---
title: NPCs
uid: npcs
---

# NPCs

NPCs are server-controlled bots that share the world with real players. SampSharp exposes them through the <xref:SampSharp.Entities.SAMP.Npc> component and the <xref:SampSharp.Entities.SAMP.IWorldService.CreateNpc*> method — you build and drive them entirely from your gamemode.

For lighter-weight characters that just stand around — shop clerks, ambient bystanders, animated background figures — SampSharp also exposes <xref:SampSharp.Entities.SAMP.Actor>, a static non-movable character with a much smaller API. See [Actors](#actors) at the end of the article.

> [!NOTE]
> SampSharp also exposes the older SA-MP NPC mechanism (`IServerService.ConnectNpc`), but it has been **deprecated** by open.mp. New gamemodes should use the open.mp NPC system covered here. See [Legacy SA-MP NPCs](#legacy-sa-mp-npcs) at the end of the article if you still need to interact with one.

### NPC or Actor?

Pick the lightest option that fits the role:

| Need | Use |
|---|---|
| A character that just stands, looks around, or plays an animation | <xref:SampSharp.Entities.SAMP.Actor> |
| A character that walks, drives, shoots, follows paths, or replays a recording | <xref:SampSharp.Entities.SAMP.Npc> |

## Creating an NPC

Use <xref:SampSharp.Entities.SAMP.IWorldService.CreateNpc*> to spawn an NPC. The returned <xref:SampSharp.Entities.SAMP.Npc> is its own entity and is **not** a `Player`:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var npc = worldService.CreateNpc("Bandit");
    npc.Skin = 109;
    npc.Position = new Vector3(2000, -1500, 13);
    npc.Spawn();
}
```

Like other entities, NPCs accept a `parent` argument so they can be cleaned up by destroying the parent — useful for tying bots to a round, mission, or instance.

## Moving an NPC

The <xref:SampSharp.Entities.SAMP.Npc> component exposes several ways to drive movement, each picking a different trade-off between simplicity and control:

```csharp
// Walk/jog/sprint/drive to a fixed point
npc.MoveTo(new Vector3(2010, -1500, 13), NPCMoveType.Jog);

// Follow a player, recalculating their position every 500 ms
npc.MoveToPlayer(player, NPCMoveType.Sprint);

// Stop whatever the NPC is currently doing
npc.StopMoving();
```

`IsMoving`, `PositionMovingTo`, and `Velocity` let you inspect the current state.

### Paths

A path is a reusable list of waypoints. Build one through <xref:SampSharp.Entities.SAMP.INpcService>, then tell an NPC to follow it:

```csharp
public class PatrolSystem : ISystem
{
    public PatrolSystem(INpcService npc, IWorldService world)
    {
        var pathId = npc.CreatePath();
        npc.AddPointToPath(pathId, new Vector3(2000, -1500, 13), stopRange: 1f);
        npc.AddPointToPath(pathId, new Vector3(2050, -1500, 13), stopRange: 1f);
        npc.AddPointToPath(pathId, new Vector3(2050, -1450, 13), stopRange: 1f);

        var bandit = world.CreateNpc("Patrol_01");
        bandit.Spawn();
        bandit.MoveByPath(pathId, NPCMoveType.Jog);
    }

    [Event]
    public void OnNPCFinishMovePath(Npc npc, int pathId)
    {
        // Restart the patrol
        npc.MoveByPath(pathId, NPCMoveType.Jog, reverse: true);
    }
}
```

Use `PausePath`, `ResumePath`, and `StopPath` to control playback.

### Nodes

Nodes are the in-game pedestrian/vehicle node files shipped with GTA: San Andreas. They let an NPC navigate the world using the same network the AI uses. Open a node file with `INpcService.OpenNode`, then start an NPC on it:

```csharp
npcService.OpenNode(0);                  // pedestrian nodes for the first node file
npc.PlayNode(0, NPCMoveType.Jog);
```

`OnNPCFinishNodePoint` and `OnNPCFinishNode` fire as the NPC traverses the network.

## Combat

NPCs can aim at and shoot players, vehicles, and other NPCs:

```csharp
npc.Weapon = (byte)Weapon.MP5;
npc.Ammo = 200;

npc.AimAtPlayer(target,
    shoot: true,
    shootDelay: 200,
    setAngle: true,
    offset: default,
    offsetFrom: default,
    betweenCheckFlags: EntityCheckType.None);

// Tune accuracy per weapon (0.0 - 1.0)
npc.SetWeaponAccuracy((byte)Weapon.MP5, 0.5f);
```

`StopAim`, `Shoot`, `MeleeAttack`, `EnableInfiniteAmmo`, and `EnableReloading` cover the rest of the combat surface.

## Vehicles

NPCs can drive vehicles. `EnterVehicle` makes the NPC walk to the vehicle and get in; `PutInVehicle` teleports them directly into a seat:

```csharp
var car = worldService.CreateVehicle(VehicleModelType.Sultan, npc.Position, 0f, 1, 1);

npc.PutInVehicle(car, seat: 0);
npc.MoveTo(new Vector3(2200, -1700, 13), NPCMoveType.Drive);
```

When driving, properties like `VehicleHealth`, `IsVehicleSirenUsed`, and `VehicleGearState` operate on the NPC's current vehicle.

## Recordings (playback)

A recording is a `.rec` file produced by <xref:SampSharp.Entities.SAMP.Player.StartRecordingPlayerData*>. The NPC can replay one to reproduce a player's exact movement — useful for scripted sequences, race ghosts, or canned animations:

```csharp
// Play back a file directly
npc.StartPlayback("missions/intro_drive.rec");

// Or preload it once and reuse the record ID
var recordId = npcService.LoadRecord("missions/intro_drive.rec");
npc.StartPlayback(recordId, autoUnload: false);
```

`OnNPCPlaybackStart` and `OnNPCPlaybackEnd` notify you when playback begins and finishes. `PausePlayback` and `StopPlayback` control it mid-flight.

## Events

NPC events follow the same pattern as other events — declare a handler with `[Event]` in a system. A few of the most useful:

```csharp
public class NpcEventSystem : ISystem
{
    [Event]
    public void OnNPCSpawn(Npc npc) { /* ... */ }

    [Event]
    public void OnNPCDeath(Npc npc, Player killer, int reason) { /* ... */ }

    [Event]
    public void OnNPCFinishMove(Npc npc) { /* arrived at MoveTo target */ }

    [Event]
    public bool OnNPCTakeDamage(Npc npc, Player from, float amount, Weapon weapon, BodyPart part)
    {
        // Return false to reject the damage
        return true;
    }
}
```

See <xref:built-in-events> for the full list of NPC events.

## Lifetime

An `Npc` is destroyed when you call `Destroy()` on the component, when the parent entity is destroyed, or when the server shuts down. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (npc)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.

## Actors

An <xref:SampSharp.Entities.SAMP.Actor> is a static, non-movable character — it has a skin, a position, a facing angle, health, and can play animations, but cannot walk, drive, or be controlled like an NPC. It's ideal for shop clerks, ambient pedestrians, mission-giver characters, or any visual humanoid that doesn't need behaviour.

Create one through <xref:SampSharp.Entities.SAMP.IWorldService.CreateActor*>:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var clerk = worldService.CreateActor(
        modelId: 156,                            // skin
        position: new Vector3(1352, -1758, 13),
        rotation: 0f);

    clerk.IsInvulnerable = true;
    clerk.ApplyAnimation(
        library: "SHOP",
        name: "SHP_Rob_React",
        fDelta: 4.1f,
        loop: true, lockX: false, lockY: false, freeze: false,
        time: TimeSpan.Zero);
}
```

The full surface is small: `Skin`, `Health`, `IsInvulnerable`, `Angle`, plus the position/rotation/virtual world properties inherited from <xref:SampSharp.Entities.SAMP.WorldEntity>, and `ApplyAnimation` / `ClearAnimations`. See <xref:SampSharp.Entities.SAMP.Actor> for the complete list.

### Actor events

```csharp
[Event]
public void OnActorStreamIn(Actor actor, Player forPlayer) { /* ... */ }

[Event]
public void OnActorStreamOut(Actor actor, Player forPlayer) { /* ... */ }

[Event]
public void OnPlayerGiveDamageActor(Player player, Actor actor, float amount, Weapon weapon, BodyPart part)
{
    // Actors don't die — they just absorb damage unless you make them invulnerable.
}
```

### Damage and invulnerability

By default, actors are **vulnerable** — they can be shot, set on fire, run over, and so on. Damage works differently from players in three important ways:

- Damage **does not automatically subtract from `Health`**. The server raises `OnPlayerGiveDamageActor` with the damage amount, and your code is responsible for applying it (typically `actor.Health -= amount;`).
- Actors **do not have a death state**. When `Health` reaches zero they keep standing (or playing whatever animation they had); there is no automatic ragdoll, no kill feed, and no "death" event. If you want an actor to fall over or disappear when killed, you implement that yourself — usually by playing a death animation and then calling `actor.Destroy()`.
- Setting `actor.IsInvulnerable = true` stops `OnPlayerGiveDamageActor` from firing for that actor. The change only takes effect once the actor is restreamed to each player, so set it on creation if possible. Setting it later may not visibly apply until the actor leaves and re-enters a player's stream radius.

```csharp
[Event]
public void OnPlayerGiveDamageActor(Player player, Actor actor, float amount, Weapon weapon, BodyPart part)
{
    actor.Health -= amount;

    if (actor.Health <= 0f)
    {
        actor.ApplyAnimation("PED", "KO_shot_front", 4.1f, false, false, false, true, TimeSpan.FromSeconds(3));
        actor.Destroy();
    }
}
```

## Legacy SA-MP NPCs

> [!WARNING]
> The legacy NPC path (`ConnectNpc` / `samp-npc` / Pawn scripts) is **deprecated** by open.mp. Use the open.mp NPC system covered above for any new bots, and consider porting existing legacy NPCs over.

A legacy NPC is a separate `samp-npc` client process that connects to the server and runs a Pawn script located in the `npcmodes/` folder. The C# side launches the bot with <xref:SampSharp.Entities.SAMP.IServerService.ConnectNpc*>:

```csharp
[Event]
public void OnGameModeInit(IServerService server)
{
    server.ConnectNpc(name: "Bot_01", script: "idle"); // npcmodes/idle.amx
}
```

Once connected, the NPC appears in the world as an ordinary player. It is exposed as a <xref:SampSharp.Entities.SAMP.Player> component with <xref:SampSharp.Entities.SAMP.Player.IsNpc> set to `true`, and it goes through the normal `OnPlayerConnect`, `OnPlayerSpawn`, etc. flow. Movement and behaviour are driven entirely by the Pawn script — your C# code cannot tell the NPC what to do beyond what's available on a regular `Player` (skin, position, weapon, etc.).
