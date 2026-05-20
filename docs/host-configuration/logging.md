---
title: Logging
uid: logging
---

# Logging

SampSharp uses the standard `Microsoft.Extensions.Logging` abstraction. Inject `ILogger<T>` into any system or service to write log messages — they're forwarded to the open.mp logger that the framework registers automatically.

```csharp
public class JoinAuditSystem(ILogger<JoinAuditSystem> logger) : ISystem
{
    [Event]
    public void OnPlayerConnect(Player player)
    {
        logger.LogInformation("{Name} connected from {Ip}", player.Name, player.Ip);
    }
}
```

## What's registered by default

When you call `UseEntities()`, SampSharp configures logging with:

- The open.mp logger provider — writes through open.mp's native logging infrastructure so messages appear alongside server logs and use the same formatting and routing.
- Configuration binding from the `Logging` section of the [unified configuration](xref:configuration) — log levels, category filters, and provider options come from `appsettings.json` (or any other source) without extra wiring.

You can layer additional providers (Serilog, console, file, …) on top via `ConfigureLogging` on the host builder.

## Configuring log levels

Set log levels in `appsettings.json` using the standard `Logging:LogLevel` schema:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "MyGameMode.Combat": "Debug"
    }
  }
}
```

Categories are matched by prefix, so `MyGameMode.Combat` covers every `ILogger<T>` whose category name starts with `MyGameMode.Combat`. The default category for `ILogger<T>` is the type's full name.

For the full schema — provider-specific overrides, filter precedence, and setting levels through environment variables or other configuration sources — see Microsoft's [Configure logging](https://learn.microsoft.com/dotnet/core/extensions/logging/overview#configure-logging) reference.

## Tuning the open.mp logger

open.mp has four severity levels — `Debug`, `Message`, `Warning`, and `Error` — while .NET defines six (`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical`). SampSharp's open.mp logger maps each .NET level to an open.mp level. The defaults are:

| .NET level    | open.mp level |
|---------------|---------------|
| `Trace`       | `Message`     |
| `Debug`       | `Message`     |
| `Information` | `Message`     |
| `Warning`     | `Warning`     |
| `Error`       | `Error`       |
| `Critical`    | `Error`       |

The mapping can be overridden by configuring the open.mp provider (its `[ProviderAlias]` is `Omp`):

```json
{
  "Logging": {
    "Omp": {
      "DebugLevel": "Debug",
      "InformationLevel": "Message",
      "WarningLevel": "Warning",
      "ErrorLevel": "Error"
    }
  }
}
```

In this example, `logger.LogDebug(...)` surfaces as a `Debug` message in open.mp instead of a regular `Message`. Each property accepts `Debug`, `Message`, `Warning`, or `Error`. See <xref:SampSharp.Entities.OmpLoggerOptions> for the full list of properties.

> [!WARNING]
> open.mp's `Debug` level is only written by debug builds of the open.mp server, which you'd have to compile yourself. The official open.mp and SampSharp distributions ship release builds only, so in practice anything you route to `Debug` is silently dropped on every server users actually run. Treat `Debug` as effectively a no-op unless you know you're running a self-built debug server, and map anything you want to be visible in production to `Message`, `Warning`, or `Error`.

You can also filter messages routed through the open.mp provider only — for example, to send `Trace` to open.mp while leaving the default `Information` filter in place for other providers:

```json
{
  "Logging": {
    "Omp": {
      "LogLevel": {
        "Default": "Trace"
      }
    }
  }
}
```

## Adding more providers

`ConfigureLogging` on the host builder gives you the standard `ILoggingBuilder`, so anything you'd register in an ASP.NET Core or generic-host app works the same way:

```csharp
public void Initialize(IStartupContext context)
{
    context.UseEntities()
        .ConfigureLogging(logging =>
        {
            logging.SetMinimumLevel(LogLevel.Information);
            logging.AddFile("logs/gamemode-{Date}.log"); // e.g. Serilog.Extensions.Logging.File
        });
}
```

The open.mp provider is added before your callback runs, so your own providers run alongside it — log messages are forwarded to every registered provider.

> [!NOTE]
> The open.mp logger provider is intentionally minimal: it formats the category name and message and sends them to open.mp. For richer output (structured properties, sinks, enrichers), pair it with a logging framework like Serilog or NLog through its `Microsoft.Extensions.Logging` integration.
