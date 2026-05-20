---
title: Objects
uid: objects
---

# Objects

Objects are static or dynamic entities in the world that can be created, positioned, and manipulated at runtime. SampSharp distinguishes between global objects (visible to all players) and player objects (visible only to a specific player).

## Creating Objects

To create a global object visible to all players, use <xref:SampSharp.Entities.SAMP.IWorldService.CreateObject*>:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var obj = worldService.CreateObject(
        modelId: 18631,                         // object model ID
        position: new Vector3(100, 200, 30),    // position
        rotation: new Vector3(0, 0, 45),        // rotation
        drawDistance: 300                       // override; pass 0 to use the engine default
    );
}
```

The returned component is of type <xref:SampSharp.Entities.SAMP.GlobalObject> (named as such because `Object` is reserved for `System.Object`).

See <xref:SampSharp.Entities.SAMP.IWorldService> for all available parameters.

> [!NOTE]
> The base game has a hard cap of 1000 simultaneous global objects (`MAX_OBJECTS`). If you regularly need more, scope objects per player with `CreatePlayerObject` (also 1000 per player) or look into a streamer plugin.

## Player Objects

Player objects are only visible to a specific player, making them useful for personalized or player-specific world elements. Create player objects using <xref:SampSharp.Entities.SAMP.IWorldService.CreatePlayerObject*>:

```csharp
[Event]
public void OnPlayerSpawn(Player player, IWorldService worldService)
{
    var playerObj = worldService.CreatePlayerObject(
        player,
        modelId: 18631,
        position: new Vector3(100, 200, 30),
        rotation: new Vector3(0, 0, 45)
    );
}
```

Only the specified player can see and interact with this object.

## Handling Object Events

You can respond to object-related events, such as when an object is moved. For example:

```csharp
[Event]
public void OnObjectMoved(GlobalObject obj)
{
    // Handle object movement
}
```

See <xref:built-in-events> for a full list of available object events.

## Manipulating Objects

The <xref:SampSharp.Entities.SAMP.GlobalObject> component provides properties and methods to interact with objects. You can change their position, rotation, and other properties:

```csharp
obj.Position = new Vector3(150, 250, 35);  // Change position
obj.Rotation = new Vector3(0, 0, 90);      // Change rotation
```

See <xref:SampSharp.Entities.SAMP.GlobalObject> for the full API.

## Lifetime

A `GlobalObject` or `PlayerObject` is destroyed when you call `Destroy()` on it, when its parent entity is destroyed (a `PlayerObject` is destroyed when its owning player disconnects), or when the server shuts down. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (obj)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.

