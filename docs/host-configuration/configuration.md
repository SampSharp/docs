---
title: Configuration
uid: configuration
---

# Configuration

SampSharp exposes two ways to read configuration values:

- **<xref:SampSharp.Entities.SAMP.IConfigService>** — typed access to the open.mp server configuration (the values defined in `config.json`).
- **`Microsoft.Extensions.Configuration.IConfiguration`** — the standard .NET configuration abstraction, populated from several sources including the open.mp config, environment variables, and JSON files.

Both are registered automatically and available through [dependency injection](xref:systems#dependency-injection). Use `IConfigService` when you specifically need open.mp's typed accessors; use `IConfiguration` for everything else, especially when binding settings to your own classes via the options pattern.

## IConfigService — typed open.mp config

`IConfigService` wraps open.mp's native config API. Each getter is type-checked: if the key is missing or holds a different type, the call returns `null` (or, for `GetStrings`, an empty array).

```csharp
public class WelcomeSystem(IConfigService config) : ISystem
{
    [Event]
    public void OnGameModeInit()
    {
        var hostname = config.GetString("name") ?? "SA-MP Server";
        var maxPlayers = config.GetInt("max_players") ?? 50;
    }
}
```

Other members:

- `GetBool`, `GetFloat`, `GetStrings(key)` — typed accessors for the remaining value types.
- `GetValueType(key)` — returns the `ConfigOptionType` of a key (`Int`, `String`, `Float`, `Bool`, or `Strings`).
- `GetOptions()` — every key open.mp currently knows about, with its type. Useful for discovery and diagnostics.

This service reads only from open.mp's config — it does **not** see values added through `appsettings.json` or environment variables. For unified access across all sources, use `IConfiguration`.

## IConfiguration — unified configuration

SampSharp builds an `IConfiguration` at startup and registers it as a singleton. Inject it directly, or bind sections to a typed options class.

```csharp
public class MyService(IConfiguration configuration)
{
    private readonly string? _connectionString = configuration["Database:ConnectionString"];
}
```

### Sources and precedence

The configuration pipeline registers the following sources. Later sources override earlier ones, so the list reads from lowest to highest precedence:

1. **open.mp config** — every key from `config.json`, surfaced through SampSharp's config provider.
2. **Environment variables** — every process environment variable. As usual in .NET configuration, `__` represents the section separator (so `Database__ConnectionString` corresponds to `Database:ConnectionString`).
3. **`appsettings.json`** — loaded from the directory containing your gamemode assembly, with hot-reload enabled.
4. **`appsettings.{environment}.json`** — same directory, only loaded when an environment name is set (see [Environments](#environments) below).
5. **Custom sources** — anything you add via `ConfigureAppConfiguration` on the host builder.

So a key set in `appsettings.json` overrides the same key from open.mp's config; a value passed via an environment variable beats the open.mp config but loses to `appsettings.json`.

### How open.mp keys appear in IConfiguration

open.mp keys use dotted names with snake_case segments (for example `network.public_addr`). SampSharp transforms each key when surfacing it through `IConfiguration`:

- Dots (`.`) become colons (`:`), so each segment becomes a configuration section.
- Underscores (`_`) are removed.
- String-array values become indexed children: `key:0`, `key:1`, …

So open.mp's `network.public_addr` is available at `configuration["network:publicaddr"]`, and `artwork.enable` becomes `configuration["artwork:enable"]`.

### Environments

If an environment name is set, SampSharp loads `appsettings.{environment}.json` on top of the base `appsettings.json`. The name is resolved from, in order:

1. The `environment` key in `config.json`.
2. The `environment` process environment variable.

For example, to switch between local and production settings, add `appsettings.Development.json` and `appsettings.Production.json` next to your gamemode assembly, then set `environment` to `Development` or `Production` in `config.json` (or set the `environment` environment variable when launching the server).

### Extending with ConfigureAppConfiguration

To add other configuration sources — a different JSON file, an INI file, a key-value store, a secrets provider — use `ConfigureAppConfiguration` on the host builder. The callback runs after SampSharp's built-in sources, so anything you add wins.

```csharp
public void Initialize(IStartupContext context)
{
    context.UseEntities()
        .ConfigureAppConfiguration(builder =>
        {
            builder.AddJsonFile("secrets.json", optional: true, reloadOnChange: true);
            builder.AddEnvironmentVariables(prefix: "MYAPP_");
        });
}
```

## Binding to typed options

Use the standard .NET options pattern to bind a configuration section to a strongly-typed class.

```csharp
public class DatabaseOptions
{
    public string ConnectionString { get; set; } = "";
    public int CommandTimeout { get; set; } = 30;
}
```

Register the binding from `ConfigureServices`. <xref:SampSharp.Entities.IEcsStartup> provides an overload that supplies the `IConfiguration` you need:

```csharp
public class Startup : IEcsStartup
{
    public void Initialize(IStartupContext context)
    {
        context.UseEntities();
    }

    public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DatabaseOptions>(configuration.GetSection("Database"));
    }

    public void Configure(IEcsBuilder builder) { }
}
```

Then, in any system or service, inject `IOptions<DatabaseOptions>` to read the bound values — or `IOptionsMonitor<T>` to pick up changes from sources that support hot-reload (such as `appsettings.json`).

```csharp
public class GameSystem(IOptions<DatabaseOptions> options) : ISystem
{
    private readonly DatabaseOptions _db = options.Value;

    [Event]
    public void OnGameModeInit()
    {
        // use _db.ConnectionString
    }
}
```
