---
title: Events
uid: events
---

# Events

Events are how SampSharp systems respond to game world changes. Built-in events like player connect/disconnect, entering vehicles, and damage trigger event handlers in your systems.

## Handling Events with the [Event] Attribute

To handle an event, add the `[Event]` attribute to a method in your <xref:systems>. The method name determines which event is handled, unless you specify a custom name.

Multiple systems can handle the same event—each registered handler will be invoked when the event fires. If the event has a bool return value, handlers work together to produce a final result (see [Event Return Values](#event-return-values) below).

```csharp
using SampSharp.Entities;
using SampSharp.Entities.SAMP;

public class PlayerSystem : ISystem
{
    [Event]
    public void OnPlayerConnect(Player player)
    {
        player.SendClientMessage("Welcome to the server!");
    }

    [Event]
    public void OnPlayerDisconnect(Player player)
    {
        Console.WriteLine($"{player.Name} disconnected.");
    }
}
```

### Custom Event Names

If your method name doesn't match the event name, use the `Name` parameter:

```csharp
[Event(Name = "OnPlayerRequestClass")]
public void HandleClassSelection(Player player, Class klass)
{
    player.SendClientMessage($"You selected class: {klass.Id}");
}
```

### Dependency Injection in Event Handlers

Event handlers can accept services via dependency injection alongside event parameters:

```csharp
[Event]
public void OnPlayerText(Player player, string message, IWorldService worldService)
{
    // player and message come from the event
    // worldService is injected
    Console.WriteLine($"{player.Name}: {message}");
}
```

## Built-in Game Events

SampSharp dispatches a wide range of built-in events covering player connections, spawning, vehicles, objects, text draws, NPCs, weapons, and more. For the full categorized list with signatures and return types, see <xref:built-in-events>.

## Event Return Values

Some events return `bool` to control behavior. The return value determines what happens next:

- **`true`** — Event is considered "handled" or "accepted". The server continues with the action (e.g., allows a spawn, propagates a trailer update).
- **`false`** — Event is "not handled" or "rejected". The server may skip the action or skip default behavior (e.g., prevents a spawn, blocks a command).

If a handler doesn't explicitly return a value (returns `void`), the event uses a sensible default:
- Events that represent "can this happen?" queries default to `true` (allow it).
- Events that represent "did anyone handle this?" queries default to `false` (not handled).

### Examples

- **`OnPlayerText`** — Return `false` to suppress the message (it won't propagate to chat). Return `true` to allow the message to propagate normally.
- **`OnPlayerCommandText`** — Return `true` means you handled the command. Return `false` means command was not handled.
- **`OnPlayerRequestSpawn`** — Return `false` to prevent the spawn. Return `true` to allow it.
- **`OnTrailerUpdate`** — Return `true` to propagate the update. Return `false` to skip it.

### Multiple Handlers

When multiple systems register handlers for the same event, **all handlers are always called**. For bool-returning events:

- If a handler returns the default value, it's ignored and the next handler is called.
- If a handler returns a non-default value, it becomes the current result.
- The **last non-default return value** is the final result.
- If all handlers return the default value (or there are no handlers), the default is used.

## Dispatching Custom Events

For advanced scenarios, you can dispatch custom events using <xref:SampSharp.Entities.IEventDispatcher>. When dispatching, pass entities as <xref:SampSharp.Entities.EntityId> values, not as components.

The event dispatcher automatically converts entity IDs to the component types expected by event handlers. If an entity doesn't have the required component, the handler is not called.

### How Event Handlers Resolve Parameters

When an event handler is invoked, SampSharp determines how to resolve each parameter based on its type:

**Event Arguments** (passed from event dispatcher):
- Value types (int, bool, float, etc.)
- Arrays
- Strings
- Components (e.g., `Player`, custom components)
- Classes marked with the `[EventParameter]` attribute

**Services** (resolved via dependency injection):
- Everything else is treated as a service and resolved from the DI container.

This allows handlers to combine event data with injected services flexibly. In the example above, the `OnPlayerBan` handler received a component (`Player`), custom event parameter (`PlayerBanRequest`), and an injected service (`ILogger`)—all resolved automatically.

```csharp
using SampSharp.Entities;
using SampSharp.Entities.SAMP;

// Define custom event data types with [EventParameter]
[EventParameter]
public class PlayerBanRequest
{
    public string Reason { get; set; }
    public DateTime BanTime { get; set; }
}

public class BanSystem : ISystem
{
    private readonly IEventDispatcher _dispatcher;

    public BanSystem(IEventDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    public void BanPlayer(EntityId playerEntity, string reason)
    {
        var banRequest = new PlayerBanRequest
        {
            Reason = reason,
            BanTime = DateTime.UtcNow
        };
        // Dispatch custom event with entity and custom data
        _dispatcher.Invoke("OnPlayerBan", playerEntity, banRequest);
    }
}

// Handler in another system:
public class LoggingSystem : ISystem
{
    [Event(Name = "OnPlayerBan")]
    public void OnPlayerBan(
        Player player,              // Component from entity
        PlayerBanRequest request,   // Custom event parameter
        ILogger<LoggingSystem> log) // Injected service
    {
        log.LogWarning($"Player {player.Name} banned at {request.BanTime}: {request.Reason}");
    }
}
```

## Event Middleware

Middleware allows you to intercept and modify event handling behavior. Middleware works like a pipeline where each middleware component can execute code before and after event handlers run, so you can inspect events, modify their context, or apply logic uniformly across many events.

You can use middleware to log all events, validate data before handlers run, check permissions, or apply other centralized logic across events. Configure middleware in your `Startup` class using the <xref:SampSharp.Entities.IEcsBuilder>:

```csharp
public class MyMiddleware
{
    private readonly EventDelegate _next;

    public MyMiddleware(EventDelegate next)
    {
        _next = next;
    }

    public object? Invoke(EventContext context)
    {
        // Do something before the event handlers
        Console.WriteLine($"Event: {context.EventName}");

        var result = _next(context);

        // Do something after the event handlers
        return result;
    }
}

// In your Startup class:
public class Startup : IEcsStartup
{
    public void Configure(IEcsBuilder builder)
    {
        builder.UseMiddleware<MyMiddleware>("OnPlayerText");
    }
    
    // ... other methods
}
```


