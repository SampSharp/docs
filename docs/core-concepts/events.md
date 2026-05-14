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

SampSharp provides many built-in events for common game world interactions. Here's a comprehensive reference organized by category. Events that return a value are noted with their return type.

### Server & Initialization
- `OnGameModeInit()` : void — Called when the server starts.
- `OnGameModeExit()` : void — Called when the server exits/shuts down.

### Player Connection
- `OnIncomingConnection(Player, string ipAddress, int port)` : void — Called before a player connects (can reject connection).
- `OnPlayerConnect(Player)` : void — Called when a player connects.
- `OnPlayerDisconnect(Player, DisconnectReason reason)` : void — Called when a player disconnects.
- `OnPlayerClientInit(Player)` : void — Called after a player's client has fully initialized.

### Player Classes & Spawning
- `OnPlayerRequestClass(Player, Class)` : void — Called when a player selects a class at class selection.
- `OnPlayerRequestSpawn(Player)` : bool (default: `true`) — Called when a player attempts to spawn (return false to reject).
- `OnPlayerSpawn(Player)` : void — Called when a player spawns.

### Player Movement & Updates
- `OnPlayerStreamIn(Player, Player forPlayer)` : void — Called when a player streams in for another player.
- `OnPlayerStreamOut(Player, Player forPlayer)` : void — Called when a player streams out for another player.
- `OnPlayerUpdate(Player, DateTime)` : bool (default: `true`) — Called every player update (return false to reject).

### Player Text & Commands
- `OnPlayerText(Player, string message)` : bool (default: `true`) — Called when a player sends chat (return false to suppress message).
- `OnPlayerCommandText(Player, string text)` : bool (default: `false`) — Called for unhandled chat starting with `/` (return true to handle).

### Player Interactions
- `OnPlayerClickMap(Player, Vector3 position)` : void — Called when a player clicks the map.
- `OnPlayerClickPlayer(Player, Player clicked, ClickSource source)` : void — Called when a player clicks another player.

### Checkpoints
- `OnPlayerEnterCheckpoint(Player)` : void — Called when a player enters a checkpoint.
- `OnPlayerLeaveCheckpoint(Player)` : void — Called when a player leaves a checkpoint.
- `OnPlayerEnterRaceCheckpoint(Player)` : void — Called when a player enters a race checkpoint.
- `OnPlayerLeaveRaceCheckpoint(Player)` : void — Called when a player leaves a race checkpoint.

### Dialogs
- `OnDialogResponse(Player, int dialogId, DialogResponse response, int listItem, string inputText)` : void — Called when a player responds to a dialog.

### Health & Damage
- `OnPlayerDeath(Player, Player killer, Weapon reason)` : void — Called when a player dies.
- `OnPlayerTakeDamage(Player, Player from, float amount, Weapon weapon, BodyPart part)` : void — Called when a player takes damage.
- `OnPlayerGiveDamage(Player, Player to, float amount, Weapon weapon, BodyPart part)` : void — Called when a player deals damage.

### Vehicles
- `OnVehicleStreamIn(Vehicle, Player forPlayer)` : void — Called when a vehicle streams in.
- `OnVehicleStreamOut(Vehicle, Player forPlayer)` : void — Called when a vehicle streams out.
- `OnVehicleSpawn(Vehicle)` : void — Called when a vehicle spawns.
- `OnVehicleDeath(Vehicle)` : void — Called when a vehicle is destroyed.
- `OnVehicleDamageStatusUpdate(Vehicle)` : void — Called when vehicle damage updates.
- `OnPlayerEnterVehicle(Player, Vehicle, bool asPassenger)` : void — Called when a player enters a vehicle.
- `OnPlayerExitVehicle(Player, Vehicle)` : void — Called when a player exits a vehicle.
- `OnUnoccupiedVehicleUpdate(Vehicle)` : bool (default: `true`) — Called for unoccupied vehicle updates (return false to reject).
- `OnTrailerUpdate(Vehicle trailer)` : bool (default: `true`) — Called for trailer updates (return false to reject).
- `OnVehicleSirenStateChange(Vehicle)` : bool (default: `true`) — Called when vehicle siren state changes (return false to reject).
- `OnVehiclePaintJob(Player, Vehicle, int paintJob)` : bool (default: `true`) — Called when a player modifies paintjob (return false to reject).
- `OnVehicleMod(Player, Vehicle, int componentId)` : bool (default: `true`) — Called when a player adds a mod (return false to reject).
- `OnVehicleRespray(Player, Vehicle, int color1, int color2)` : bool (default: `true`) — Called when a player resprays (return false to reject).
- `OnEnterExitModShop(Player, bool enter, ModShop modShop)` : void — Called when entering/exiting mod shop.

### Objects
- `OnObjectMoved(Object)` : void — Called when an object finishes moving.
- `OnPlayerObjectMoved(Player, PlayerObject)` : void — Called when a player object finishes moving.
- `OnObjectSelected(Player, Object, int model, Vector3 position)` : void — Called when a player selects an object.
- `OnPlayerObjectSelected(Player, PlayerObject, int model, Vector3 position)` : void — Called when a player selects their object.
- `OnObjectEdited(Player, Object, int response, Vector3 offset, Vector3 rotation)` : void — Called when an object is edited.
- `OnPlayerObjectEdited(Player, PlayerObject, int response, Vector3 offset, Vector3 rotation)` : void — Called when a player object is edited.
- `OnPlayerAttachedObjectEdited(Player, int index, bool saved, AttachedObjectEditData data)` : void — Called when attached object is edited.

### Text Draws
- `OnPlayerClickTextDraw(Player, TextDraw)` : void — Called when a player clicks a text draw.
- `OnPlayerClickPlayerTextDraw(Player, PlayerTextDraw)` : void — Called when a player clicks their text draw.
- `OnPlayerCancelTextDrawSelection(Player)` : bool (default: `true`) — Called when canceling text draw selection (return false to reject).
- `OnPlayerCancelPlayerTextDrawSelection(Player)` : bool (default: `true`) — Called when canceling player text draw selection (return false to reject).

### Menus
- `OnPlayerSelectedMenuRow(Player, Menu, int row)` : void — Called when a player selects a menu row.
- `OnPlayerExitedMenu(Player)` : void — Called when a player closes a menu.

### Actors
- `OnActorStreamIn(Actor, Player forPlayer)` : void — Called when an actor streams in.
- `OnActorStreamOut(Actor, Player forPlayer)` : void — Called when an actor streams out.
- `OnPlayerGiveDamageActor(Player, Actor, float amount, Weapon weapon, BodyPart part)` : void — Called when a player damages an actor.

### NPCs
- `OnNPCCreate(NPC)` : void — Called when an NPC is created.
- `OnNPCDestroy(NPC)` : void — Called when an NPC is destroyed.
- `OnNPCSpawn(NPC)` : void — Called when an NPC spawns.
- `OnNPCRespawn(NPC)` : void — Called when an NPC respawns.
- `OnNPCFinishMove(NPC)` : void — Called when an NPC finishes moving.
- `OnNPCDeath(NPC, Player killer, Weapon reason)` : void — Called when an NPC dies.
- `OnNPCWeaponStateChange(NPC, Weapon oldWeapon, Weapon newWeapon)` : void — Called when NPC weapon changes.
- `OnNPCPlaybackStart(NPC, Playback playback)` : void — Called when NPC playback starts.
- `OnNPCPlaybackEnd(NPC, Playback playback)` : void — Called when NPC playback ends.
- `OnNPCFinishNodePoint(NPC, int nodePoint)` : void — Called when NPC reaches a node point.
- `OnNPCFinishNode(NPC, int node)` : void — Called when NPC finishes a node.
- `OnNPCFinishMovePathPoint(NPC, int pathPoint)` : void — Called when NPC reaches a move path point.
- `OnNPCFinishMovePath(NPC, MovePath path)` : void — Called when NPC finishes a move path.
- `OnNPCTakeDamage(NPC, Player from, float amount, Weapon weapon, BodyPart part)` : bool (default: `true`) — Called when NPC takes damage (return false to reject).
- `OnNPCGiveDamage(NPC, Player to, float amount, Weapon weapon, BodyPart part)` : bool (default: `true`) — Called when NPC deals damage (return false to reject).
- `OnNPCShotMissed(NPC, Weapon weapon, Vector3 position)` : bool (default: `true`) — Called when NPC misses a shot (return false to reject).
- `OnNPCShotPlayer(NPC, Player target, Weapon weapon, BodyPart part)` : bool (default: `true`) — Called when NPC shoots a player (return false to reject).

### Weapon & Shooting
- `OnPlayerShotMissed(Player, Weapon weapon, BulletData bulletData)` : bool (default: `true`) — Called when a player misses a shot (return false to reject).
- `OnPlayerShotPlayer(Player, Player target, Weapon weapon, BulletData bulletData)` : bool (default: `true`) — Called when a player shoots another player (return false to reject).
- `OnPlayerShotVehicle(Player, Vehicle target, Weapon weapon, BulletData bulletData)` : bool (default: `true`) — Called when a player shoots a vehicle (return false to reject).
- `OnPlayerShotObject(Player, Object target, Weapon weapon, BulletData bulletData)` : bool (default: `true`) — Called when a player shoots an object (return false to reject).
- `OnPlayerShotPlayerObject(Player, PlayerObject target, Weapon weapon, BulletData bulletData)` : bool (default: `true`) — Called when a player shoots a player object (return false to reject).

### Custom Models & Downloads
- `OnPlayerRequestDownload(Player, CustomModelType type, int modelId)` : bool (default: `true`) — Called when a player downloads a custom model (return false to reject).
- `OnPlayerFinishedDownloading(Player)` : void — Called when a player finishes downloading custom models.

### Console & Admin
- `OnRconLoginAttempt(Player, string password, bool success)` : void — Called when attempting RCON login.
- `OnConsoleCommandListRequest(ConsoleCommandCollection commands)` : void — Called when console command list is requested.

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
using SampSharp.Entities;

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


