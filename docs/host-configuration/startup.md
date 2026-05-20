---
title: Startup
uid: startup
---

# Startup

Every SampSharp gamemode begins with a `Startup` class that implements <xref:SampSharp.Entities.IEcsStartup>. SampSharp creates an instance of this class when the gamemode loads and uses it to wire up the ECS framework, register services into the DI container, and configure event handling.

This article focuses on the startup lifecycle and the ECS host builder. Application configuration sources (open.mp config, `appsettings.json`, environment variables) are covered in [Configuration](xref:configuration), and logging setup is covered in [Logging](xref:logging).

The project template generates a minimal startup:

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SampSharp.OpenMp.Core;

public class Startup : IEcsStartup
{
    public void Initialize(IStartupContext context)
    {
        context.UseEntities().UseCommands();
    }

    public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
    }

    public void Configure(IEcsBuilder builder)
    {
    }
}
```

> [!NOTE]
> `SampSharp.Sdk` provides global `using`s for `SampSharp.Entities`, `SampSharp.Entities.SAMP`, and `SampSharp.Entities.SAMP.Commands`, so the snippets in the rest of these docs leave them out. Add them back explicitly if you're not using the SDK.

The three methods run at different points during startup:

| Method | Runs | Used for |
|---|---|---|
| `Initialize(IStartupContext)` | Earliest. Has access to the open.mp host. | Calling `UseEntities()` and adding feature modules (`UseCommands`, custom hosts). |
| `ConfigureServices(IServiceCollection, IConfiguration)` | After the service collection is created, before the provider is built. | Adding your own services to dependency injection. |
| `Configure(IEcsBuilder)` | After the service provider is built, just before `OnGameModeInit` fires. | Final pre-launch work that needs resolved services — preloading data, warming up caches, kicking off background services. |

## Initialize and the ECS host builder

`Initialize` is where you opt into the ECS framework by calling `UseEntities()` on the startup context. The call returns an <xref:SampSharp.Entities.IEcsHostBuilder> on which you chain everything else:

```csharp
public void Initialize(IStartupContext context)
{
    context.UseEntities()
        .UseCommands()
        .ConfigureUnhandledExceptionHandler((sp, where, ex) =>
        {
            var log = sp.GetRequiredService<ILogger<Startup>>();
            log.LogError(ex, "Unhandled exception in {Where}", where);
        });
}
```

The host builder supports the following configuration:

- **`Configure(Action<IEcsBuilder>)`** — schedules a callback that runs after the service provider is built, just before `OnGameModeInit` fires. The same hook as the `Configure` method on `IEcsStartup`, but exposed on the host builder so a feature module can register its own pre-launch work.
- **`ConfigureServices(Action<IServiceCollection>)`** — register services. Useful when a feature module wants to add its own services on top of yours. There's also an overload that exposes the `SampSharpEnvironment` if you need it.
- **`ConfigureLogging(Action<ILoggingBuilder>)`** — set log levels, add custom providers (Serilog, file logging, etc.). open.mp's console logger is added automatically. See [Logging](xref:logging) for details.
- **`ConfigureAppConfiguration(Action<IConfigurationBuilder>)`** — add or override sources for the unified `IConfiguration`. See [Configuration](xref:configuration) for the full source list and precedence.
- **`ConfigureUnhandledExceptionHandler(UnhandledExceptionHandler)`** — replace the default handler for uncaught exceptions thrown from event handlers, systems, timers, etc. The default writes the exception to the configured logger; override it to forward to an error tracker or take other action.
- **`UseServiceProviderFactory<T>(IServiceProviderFactory<T>)`** — swap out the default Microsoft DI container for an alternative such as Autofac, Lamar, or DryIoc.
- **`DisableDefaultSystemsLoading()`** — by default SampSharp scans the entry assembly and registers every `ISystem` it finds. Call this to opt out and register systems manually with `services.AddSystem<T>()`.

## Feature modules

`UseEntities()` returns the host builder, which can then be extended by feature modules. SampSharp ships with one for the [command system](xref:commands):

```csharp
context.UseEntities()
    .UsePlayerCommands()                              // player /commands only
    .UseConsoleCommands()                             // server console commands only
    .UseCommands();                                   // shortcut for both
```

Each `UseXxx` extension is responsible for registering its own services and pre-launch work against the host builder, so you don't have to know the internals — just opt in to what your gamemode needs.

You can write your own modules the same way:

```csharp
public static class MyFeatureExtensions
{
    extension(IEcsHostBuilder hostBuilder)
    {
        public IEcsHostBuilder UseMyFeature() => hostBuilder
            .ConfigureServices(services => services.AddSingleton<IMyService, MyService>())
            .Configure(builder => builder.Services.GetRequiredService<IMyService>().Warmup());
    }
}
```

## ConfigureServices

The `ConfigureServices` method on `IEcsStartup` is where you register your own services for [dependency injection](xref:systems#dependency-injection) into systems and event handlers. The `IConfiguration` parameter gives you access to all configuration sources at registration time (see [Configuration](xref:configuration)):

```csharp
public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    services.AddSingleton<IBankService, BankService>();
    services.AddSingleton<IPersistenceService, SqlitePersistenceService>();
    services.AddDbContext<GameDbContext>(o =>
        o.UseSqlite(configuration["Database:ConnectionString"]));
}
```

Inside the call, you also have access to the same `IServiceCollection` methods that any ASP.NET Core or generic-host app uses, so anything published on NuGet that expects `IServiceCollection` (logging providers, configuration, EF Core, etc.) will work.

> [!NOTE]
> `AddSystem<T>` is what registers a system with SampSharp's system registry. Systems are picked up automatically from the entry assembly, so you usually don't need to call this — only if you've disabled default loading or want to register a system from a different assembly.

## Configure (pre-launch hook)

`Configure(IEcsBuilder)` runs after the service provider has been built but **before** `OnGameModeInit` fires. It's the last chance to do startup work that needs resolved services — the rest of the gamemode hasn't run yet, so anything you do here is in place by the time event handlers and systems start receiving callbacks.

`IEcsBuilder.Services` exposes the fully-built `IServiceProvider`. Typical uses:

```csharp
public void Configure(IEcsBuilder builder)
{
    // Run a database migration before the gamemode starts accepting events.
    var db = builder.Services.GetRequiredService<GameDbContext>();
    db.Database.Migrate();

    // Pre-load reference data into a cache so the first OnPlayerConnect doesn't pay the cost.
    var cache = builder.Services.GetRequiredService<IReferenceDataCache>();
    cache.Preload();
}
```

If you don't have any pre-launch work to do, leaving this method empty is fine — the template generates it that way.

## What's wired up by default

When you call `UseEntities()`, SampSharp automatically registers a baseline of services and systems. You can rely on these being available without configuring anything:

- **Core infrastructure** — <xref:SampSharp.Entities.IEntityManager>, <xref:SampSharp.Entities.IEventDispatcher>, <xref:SampSharp.Entities.ISystemRegistry>, and an `IUnhandledExceptionHandler`.
- **Built-in systems** — `TimerSystem` (exposed as <xref:SampSharp.Entities.ITimerService>) and `TickingSystem`.
- **SAMP services** — <xref:SampSharp.Entities.SAMP.IWorldService>, <xref:SampSharp.Entities.SAMP.IServerService>, <xref:SampSharp.Entities.SAMP.IDialogService>, <xref:SampSharp.Entities.SAMP.INpcService>, plus all the open.mp event handlers that translate native callbacks into SampSharp events.
- **Logging** — `ILogger<T>` backed by open.mp's console logger. See [Logging](xref:logging).
- **Configuration** — an `IConfiguration` populated from the open.mp config, environment variables, and `appsettings.json`. See [Configuration](xref:configuration).
- **Auto-discovered systems** — every public `ISystem` type in the entry assembly, unless you call `DisableDefaultSystemsLoading()`.

Feature modules (like `UseCommands`) layer on top of this baseline.
