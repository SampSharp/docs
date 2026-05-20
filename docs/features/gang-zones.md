---
title: Gang zones
uid: gang-zones
---

# Gang zones

A gang zone is a 2D rectangular overlay on a player's radar (and, when shown, a coloured square on the world map). They are commonly used to mark turf, mission areas, safe zones, or capture points. SampSharp distinguishes between **global** zones visible to any subset of players (<xref:SampSharp.Entities.SAMP.GangZone>) and **per-player** zones bound to a specific owner (<xref:SampSharp.Entities.SAMP.PlayerGangZone>). Both share the same surface via the common base <xref:SampSharp.Entities.SAMP.BaseGangZone>.

> [!NOTE]
> Creating a gang zone does not make it visible. You must call `Show()` (for everyone) or `Show(player)` for it to appear on the radar.

## Creating a gang zone

Use <xref:SampSharp.Entities.SAMP.IWorldService.CreateGangZone*> with the minimum and maximum corners of the rectangle:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var zone = worldService.CreateGangZone(
        min: new Vector2(2000, -1700),
        max: new Vector2(2100, -1600));

    zone.Color = new Color(255, 0, 0, 128);   // semi-transparent red
    zone.Show();                              // make it visible to all players
}
```

The boundary is updatable at runtime via `SetPosition(min, max)`.

## Showing, hiding, and flashing

Gang zones are visible per-player. `Show()` / `Hide()` apply to every connected player; the overloads taking a `Player` operate on one player only:

```csharp
zone.Show();                    // show to everyone
zone.Show(player);              // show to a single player
zone.Hide(player);              // hide from a single player

zone.Flash(Color.Yellow);                  // flash for everyone
zone.Flash(player, Color.Yellow);          // flash for one player
zone.StopFlash(player);                    // stop flashing for one player
```

Per-player state is readable too: `IsShownForPlayer(player)`, `IsFlashingForPlayer(player)`, `GetColorForPlayer(player)`, `GetFlashingColorForPlayer(player)`. Use `GetShownFor()` to enumerate every player who currently sees the zone.

## Player gang zones

A <xref:SampSharp.Entities.SAMP.PlayerGangZone> is the same kind of overlay, but bound to a single owner via <xref:SampSharp.Entities.SAMP.IWorldService.CreatePlayerGangZone*>:

```csharp
[Event]
public void OnPlayerSpawn(Player player, IWorldService worldService)
{
    var personal = worldService.CreatePlayerGangZone(
        owner: player,
        min: new Vector2(2000, -1500),
        max: new Vector2(2020, -1480));

    personal.Color = new Color(0, 255, 0, 128);
    personal.Show(player);
}
```

`PlayerGangZone` is not automatically destroyed when the owner disconnects — pass `parent: player` if you want the zone to disappear alongside the player entity:

```csharp
worldService.CreatePlayerGangZone(owner: player, min: a, max: b, parent: player);
```

## Enter / leave tracking

Gang zone enter and leave events are **opt-in** — they do not fire by default. Register the zone for containment checking via <xref:SampSharp.Entities.SAMP.IWorldService.UseGangZoneCheck*>:

```csharp
public class TerritorySystem : ISystem
{
    private readonly GangZone _zone;

    public TerritorySystem(IWorldService world)
    {
        _zone = world.CreateGangZone(new Vector2(2000, -1700), new Vector2(2100, -1600));
        _zone.Color = new Color(255, 0, 0, 128);
        _zone.Show();

        world.UseGangZoneCheck(_zone, enable: true);   // start firing enter/leave events
    }

    [Event]
    public void OnPlayerEnterGangZone(Player player, GangZone zone)
    {
        if (zone == _zone)
            player.SendClientMessage(Color.Red, "Entered enemy territory.");
    }

    [Event]
    public void OnPlayerLeaveGangZone(Player player, GangZone zone)
    {
        if (zone == _zone)
            player.SendClientMessage(Color.White, "You are safe.");
    }
}
```

Per-player zones dispatch under different event names: `OnPlayerEnterPlayerGangZone(Player, PlayerGangZone)` and `OnPlayerLeavePlayerGangZone(Player, PlayerGangZone)`.

`BaseGangZone.IsPlayerInside(player)` returns the current containment state, but only for zones registered with `UseGangZoneCheck` — otherwise it is always `false`.

## Click events

When a player clicks on a gang zone on the world map, `OnPlayerClickGangZone` (or `OnPlayerClickPlayerGangZone` for player-scoped zones) fires. This requires nothing special beyond the zone being shown:

```csharp
[Event]
public void OnPlayerClickGangZone(Player player, GangZone zone)
{
    player.SendClientMessage($"You clicked zone {zone}.");
}
```

## Lifetime

A `GangZone` or `PlayerGangZone` is destroyed when you call `Destroy()` on it, when its parent entity is destroyed, or when the server shuts down. A `PlayerGangZone` is **not** implicitly tied to its owner's lifetime — see [Player gang zones](#player-gang-zones) above for parenting it to the player if you want that. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (zone)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.
