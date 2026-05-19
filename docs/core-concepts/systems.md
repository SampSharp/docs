---
title: Systems
uid: systems
---

# Systems

In SampSharp's Entity-Component-System (ECS) architecture, **systems** are classes that contain the logic for your gamemode. Systems process entities and their components, respond to events, and can handle player or console commands. They are the main way to organize your server's behavior, keeping your code modular and maintainable.

For a high-level overview of ECS and systems, see <xref:ecs-overview>.


## How to Create a System

A system is any class that implements the <xref:SampSharp.Entities.ISystem> interface. Systems are singletons—they are instantiated once and shared for the lifetime of the server. Within a system, you can:

- **Handle events:** Respond to built-in or custom events (player connect/disconnect, etc.) using the `[Event]` attribute. See <xref:events> for more details.
- **Define commands:** Implement player and console commands using the `[PlayerCommand]` and `[ConsoleCommand]` attributes. See <xref:commands> for more information.
- **Use timers:** Run recurring tasks with the `[Timer]` attribute. See <xref:timers> for more details.
- **Handle server ticks:** Implement <xref:SampSharp.Entities.ITickingSystem> to run logic every server tick.
- **Use dependency injection:** Access services like <xref:SampSharp.Entities.IEntityManager>, <xref:SampSharp.Entities.SAMP.IWorldService>, or logging through constructor or method parameters.

> [!WARNING]
> Server ticks via <xref:SampSharp.Entities.ITickingSystem> run every frame and execute very frequently. Do not perform heavy operations or large computations in tick handlers, as this will significantly impact server performance. Use timers or event-driven approaches for non-performance-critical logic.

### Dependency Injection

You can inject dependencies in two ways:

- **Constructor injection:** For singleton or stateless dependencies.
- **Method parameter injection:** For transient or per-request dependencies (better for event/command handlers).

### Example: A Simple System

```csharp
using SampSharp.Entities;
using SampSharp.Entities.SAMP;
using SampSharp.Entities.SAMP.Commands;

public class MyFirstSystem : ISystem
{
    [Timer(1000)]
    public void OnTimer()
    {
        // This method runs every second.
    }

    [Event]
    public void OnGameModeInit(IWorldService world, IEntityManager entityManager)
    {
        // Called when the gamemode starts.
        var vehicle = world.CreateVehicle(VehicleModelType.Landstalker, new Vector3(0, 6, 15), 45, 4, 4);
        vehicle.SetNumberPlate("SampSharp");
    }

    [PlayerCommand(Name = "kill")]
    public void KillPlayer(Player player)
    {
        player.Health = 0;
        player.SendClientMessage("You have been killed!");
    }
}
```

## Registering Systems

By default, systems in the entry assembly (the assembly with the <xref:SampSharp.Entities.IEcsStartup> implementation) are automatically discovered and loaded—no configuration needed.

If you need custom control over which systems load, you can disable automatic loading and manually register systems using `AddSystem<T>()`. This is useful when:

- You want to be selective about which systems load.
- You're loading systems from other assemblies.
- You need fine-grained control over system initialization.

To disable automatic loading, call `DisableDefaultSystemsLoading()` in your `Startup` class and register systems individually:

```csharp
using Microsoft.Extensions.DependencyInjection;
using SampSharp.Entities;

public class Startup : IEcsStartup
{
    public void Initialize(IStartupContext context)
    {
        context.UseEntities()
            .DisableDefaultSystemsLoading();
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSystem<MyFirstSystem>();
    }

    public void Configure(IEcsBuilder builder)
    {
    }
}
```

## Best Practices for System Organization

- Keep systems focused: each system should handle a specific area of game logic.
- Avoid storing per-entity state in systems; use components for entity data.
- Use dependency injection to keep systems decoupled from infrastructure.
- Group related event and command handlers together for clarity.
