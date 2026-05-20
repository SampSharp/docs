---
title: Players
uid: players
---

# Players

A connected player is represented by the <xref:SampSharp.Entities.SAMP.Player> component, which SampSharp attaches to the player's entity automatically when the client connects. You never create or destroy `Player` components yourself — the lifecycle is driven by the server.

## Accessing players

The most common way to obtain a `Player` is as a parameter on an [event handler](xref:events):

```csharp
[Event]
public void OnPlayerConnect(Player player)
{
    player.SendClientMessage($"Welcome, {player.Name}!");
}
```

To broadcast to every connected player, call <xref:SampSharp.Entities.SAMP.IWorldService.SendClientMessage*> rather than looping yourself:

```csharp
worldService.SendClientMessage(Color.Yellow, "Round starting in 30 seconds.");
```

When you need to act on a subset of players — for example, only players on a team — enumerate via the entity manager and filter:

```csharp
foreach (var player in entityManager.GetComponents<Player>())
{
    if (player.Team == redTeam)
        player.SendClientMessage(Color.Red, "Defend the flag!");
}
```

## NPCs and players

SampSharp has two NPC mechanisms, and only one of them produces a `Player`:

- **`IServerService.ConnectNpc(name, script)`** — the **deprecated** legacy SA-MP path. The NPC connects to the server like any client and is exposed as a `Player`; <xref:SampSharp.Entities.SAMP.Player.IsNpc> returns `true` on it.
- **`IWorldService.CreateNpc(name)`** — the recommended open.mp path. Returns a separate <xref:SampSharp.Entities.SAMP.Npc> component on its own entity. It is **not** a `Player`, and player events do not fire for it.

If you have legacy NPCs and want a handler to run only for human players, filter on `IsNpc`:

```csharp
[Event]
public void OnPlayerSpawn(Player player)
{
    if (player.IsNpc)
        return;

    player.GiveMoney(1000);
}
```

See <xref:npcs> for details on both NPC mechanisms.

## Handling player events

SampSharp surfaces a wide range of player events. A few of the most commonly used:

```csharp
public class PlayerEventSystem : ISystem
{
    [Event]
    public void OnPlayerConnect(Player player)
    {
        player.SendClientMessage($"Hello, {player.Name}.");
    }

    [Event]
    public void OnPlayerDisconnect(Player player, DisconnectReason reason)
    {
        Console.WriteLine($"{player.Name} left ({reason}).");
    }

    [Event]
    public void OnPlayerSpawn(Player player)
    {
        player.GiveWeapon(Weapon.Colt45, 50);
    }

    [Event]
    public void OnPlayerDeath(Player player, Player killer, Weapon reason)
    {
        if (killer != null)
            killer.Score++;
    }

    [Event]
    public bool OnPlayerText(Player player, string message)
    {
        // Return false to suppress the message; return true to let it propagate to chat.
        return !message.Contains("badword", StringComparison.OrdinalIgnoreCase);
    }
}
```

See <xref:built-in-events> for the full list of player events and their return-value semantics.

## Class selection and spawning

Before a player spawns, they go through class selection. The sequence of events is:

1. `OnPlayerConnect` — the player joins the server.
2. `OnPlayerRequestClass` — fires every time the player scrolls to a different class at the class selection screen.
3. `OnPlayerRequestSpawn` — the player clicks "Spawn". Return `false` to reject the spawn.
4. `OnPlayerSpawn` — the player has spawned and is in the world.

Define the classes shown on the class selection screen with <xref:SampSharp.Entities.SAMP.IServerService.AddPlayerClass*>, typically from `OnGameModeInit`. The call returns a <xref:SampSharp.Entities.SAMP.Class> component representing that entry, which you can hold onto if you want to mutate it later:

```csharp
[Event]
public void OnGameModeInit(IServerService server)
{
    server.AddPlayerClass(
        modelId: 0,                              // CJ skin
        spawnPosition: new Vector3(1958, -2184, 13),
        angle: 0f,
        weapon1: Weapon.Colt45, weapon1Ammo: 100);
}
```

`OnPlayerRequestClass` receives the `Class` the player is currently looking at — use it to preview that class to the player (for example, point the camera at the spawn location, or display class-specific UI):

```csharp
[Event]
public void OnPlayerRequestClass(Player player, Class klass)
{
    player.SendClientMessage(Color.White, $"Class skin {klass.Skin}, team {klass.Team}.");
    player.CameraPosition = klass.Location + new Vector3(0, 5, 2);
    player.SetCameraLookAt(klass.Location);
}
```

Because a `Class` is just a component on its own entity, you can attach your own [custom components](xref:entities-components) to it to carry metadata that doesn't fit on the built-in `Class` — faction info, descriptions, perks, etc. — and read it back during class selection:

```csharp
public class Faction : Component
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}

public class ClassSetupSystem : ISystem
{
    [Event]
    public void OnGameModeInit(IServerService server)
    {
        var copClass = server.AddPlayerClass(modelId: 280,
            spawnPosition: new Vector3(1552, -1675, 16), angle: 90f);
        copClass.AddComponent<Faction>().Name = "LSPD";

        var medicClass = server.AddPlayerClass(modelId: 274,
            spawnPosition: new Vector3(1172, -1323, 15), angle: 0f);
        var medicFaction = medicClass.AddComponent<Faction>();
        medicFaction.Name = "Paramedic";
        medicFaction.Description = "Revive downed players for a reward.";
    }

    [Event]
    public void OnPlayerRequestClass(Player player, Class klass)
    {
        var faction = klass.GetComponent<Faction>();
        if (faction != null)
            player.GameText($"~y~{faction.Name}", TimeSpan.FromSeconds(2), GameTextStyle.Style3);
    }
}
```

To change a class's spawn data at runtime, call <xref:SampSharp.Entities.SAMP.Class.SetSpawnData*>. To override spawn data for a specific player (for example, after they log in), call <xref:SampSharp.Entities.SAMP.Player.SetSpawnInfo*>:

```csharp
player.SetSpawnInfo(
    team: 0,
    skin: 26,
    position: new Vector3(0, 0, 5),
    rotation: 0f,
    weapon1: Weapon.Deagle, weapon1Ammo: 50);
```

Use `player.ForceClassSelection()` to send a player back to the class selection screen (they will not actually return until they re-spawn, which you can trigger with `player.ToggleSpectating(true)` followed by `player.ToggleSpectating(false)`).

## Manipulating players

The `Player` component exposes properties and methods covering most things you'd want to do to a player. A small sampler:

```csharp
// Identity and stats
player.SetName("NewName");
player.Score = 100;
player.GiveMoney(500);

// World state
player.Position = new Vector3(0, 0, 5);
player.SetPositionFindZ(new Vector3(1000, -1500, 0)); // snap to nearest ground
player.Interior = 1;
player.VirtualWorld = 42;

// Health and combat
player.Health = 100f;
player.Armour = 50f;
player.GiveWeapon(Weapon.Deagle, 100);
player.SetArmedWeapon(Weapon.Deagle);
player.ResetWeapons();

// Vehicle interaction
player.PutInVehicle(vehicle, seatId: 0);
player.RemoveFromVehicle();

// UI and feedback
player.SendClientMessage(Color.Lime, "You picked up $500.");
player.GameText("~r~WASTED", TimeSpan.FromSeconds(3), GameTextStyle.Style2);
player.PlaySound(1057);

// Animation
player.ApplyAnimation(
    animationLibrary: "DANCING",
    animationName: "dnce_M_b",
    fDelta: 4.1f,
    loop: true, lockX: false, lockY: false, freeze: false,
    time: TimeSpan.Zero);
player.ClearAnimations();

// Moderation
player.Kick();
player.Ban("Cheating");
```

See <xref:SampSharp.Entities.SAMP.Player> for the full API.

## Custom per-player state

A player's entity is just an entity, so you can attach your own [components](xref:entities-components) to it — accounts, stats, login state, anything specific to your gamemode. They are destroyed automatically when the player disconnects, along with the `Player` component itself.

```csharp
public class Account : Component
{
    public int UserId { get; set; }
    public int Level { get; set; }
    public bool IsLoggedIn { get; set; }
}

public class AccountSystem : ISystem
{
    [Event]
    public void OnPlayerConnect(Player player)
    {
        var account = player.AddComponent<Account>();
        account.Level = 1;
    }

    [Event]
    public void OnPlayerSpawn(Player player)
    {
        var account = player.GetComponent<Account>();
        if (account is { IsLoggedIn: false })
            player.SendClientMessage(Color.Red, "Please /login first.");
    }
}
```

A handler can also receive a custom component directly as a parameter — the event dispatcher resolves it from the player's entity and skips the handler when the component is missing:

```csharp
[Event]
public void OnPlayerText(Player player, string message, Account account)
{
    // Runs only for players that have an Account component attached.
    account.Level++;
}
```

## Player lifetime

A `Player` component is destroyed shortly after the player disconnects. If you hold the reference across an `await`, a timer callback, or any other boundary where the player may have left in the meantime, guard the access with `if (player)` before using it. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.
