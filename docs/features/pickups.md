---
title: Pickups
uid: pickups
---

# Pickups

A pickup is a static collectible placed in the world — health and armor packs, weapons, scripted markers, and so on. SampSharp distinguishes between **global** pickups visible to everyone (<xref:SampSharp.Entities.SAMP.Pickup>) and **per-player** pickups visible to (and collectible by) only their owner (<xref:SampSharp.Entities.SAMP.PlayerPickup>). Both components share the same surface, exposed by their common base <xref:SampSharp.Entities.SAMP.BasePickup>.

## Creating a pickup

Use <xref:SampSharp.Entities.SAMP.IWorldService.CreatePickup*> for a pickup visible to every player:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var pickup = worldService.CreatePickup(
        model: 1240,                            // health pack
        type: PickupType.ShowAndRespawnWhenDeath,
        position: new Vector3(2000, -1500, 13));
}
```

Every pickup carries a <xref:SampSharp.Entities.SAMP.PickupType>, which dictates its respawn and visibility behaviour — e.g. `ShowAndRespawnWhenDeath` reappears each time the picking player dies, `ShowNearAndRespawnWhenPickup` reappears after 30 seconds if no player is nearby, and `ShowButNotPickupable` is purely decorative. Some types also restrict how the pickup can be collected (e.g. `ShowAndPickupableWithVehicleWithSound` is vehicle-only). See <xref:SampSharp.Entities.SAMP.PickupType> for the full list with behaviour notes.

> [!NOTE]
> Pickups placed outside the world coordinate range of -4096.0 to 4096.0 (on the X or Y axis) will not display and will not fire pickup events.

### Static pickups

<xref:SampSharp.Entities.SAMP.IWorldService.CreateStaticPickup*> creates a pickup the server handles automatically — weapon, health, and armor models give their effect to the player on contact without you wiring up an event:

```csharp
worldService.CreateStaticPickup(
    model: 1242,                                // armor
    type: PickupType.ShowAndRespawnWhenDeath,
    position: new Vector3(2010, -1500, 13));
```

Static pickups are "set and forget": they cannot be destroyed individually and do not fire `OnPlayerPickUpPickup`. Use them for simple resupply points and reach for regular `CreatePickup` whenever you need to react to the pickup, mutate it later, or destroy it.

## Player pickups

A <xref:SampSharp.Entities.SAMP.PlayerPickup> is created the same way but bound to a single owner via <xref:SampSharp.Entities.SAMP.IWorldService.CreatePlayerPickup*>:

```csharp
[Event]
public void OnPlayerSpawn(Player player, IWorldService worldService)
{
    worldService.CreatePlayerPickup(
        owner: player,
        model: 1254,                            // money bag
        type: PickupType.ShowTillPickedUp,
        position: player.Position + new Vector3(2, 0, 0));
}
```

Under the hood, open.mp has no dedicated per-player pickup pool — `CreatePlayerPickup` creates a global pickup tagged with the owner, and only the owner sees and can collect it. One thing worth knowing: the pickup is **not** automatically destroyed when the owner disconnects. If you want it to disappear with the player, pass the player as the `parent` argument so the pickup entity is destroyed alongside the player entity:

```csharp
worldService.CreatePlayerPickup(
    owner: player,
    model: 1254,
    type: PickupType.ShowTillPickedUp,
    position: player.Position,
    parent: player);
```

## Handling pickup events

When a player walks over a pickup, SampSharp dispatches one of two events depending on whether the pickup is bound to a player:

```csharp
public class PickupSystem : ISystem
{
    [Event]
    public void OnPlayerPickUpPickup(Player player, Pickup pickup)
    {
        if (pickup.Model == 1240)
            player.Health = Math.Min(100f, player.Health + 25f);
    }

    [Event]
    public void OnPlayerPickUpPlayerPickup(Player player, PlayerPickup pickup)
    {
        player.GiveMoney(500);
        pickup.Destroy();
    }
}
```

> [!NOTE]
> Static pickups created with `CreateStaticPickup` are handled by the server and do **not** fire these events.

## Manipulating pickups

`BasePickup` exposes a handful of properties and methods shared between `Pickup` and `PlayerPickup`:

```csharp
// Change the appearance or behaviour at runtime
pickup.SetModel(1242);
pickup.SetType(PickupType.ShowNearAndRespawnWhenPickup);

// Per-player visibility
pickup.SetHiddenForPlayer(player, hidden: true);
if (pickup.IsHiddenForPlayer(player)) { /* ... */ }

// Force streaming
pickup.StreamOutForPlayer(player);
pickup.StreamInForPlayer(player);

// Move silently (no visual update)
pickup.SetPositionNoUpdate(new Vector3(2020, -1500, 13));
```

See <xref:SampSharp.Entities.SAMP.BasePickup> for the full API.

## Lifetime

A `Pickup` or `PlayerPickup` is destroyed when you call `Destroy()` on it, when its parent entity is destroyed, or when the server shuts down. Note that a `PlayerPickup` is **not** implicitly tied to its owner's lifetime — see [Player pickups](#player-pickups) above for parenting it to the player if you want that. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (pickup)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.
