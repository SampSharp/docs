---
title: Text labels
uid: text-labels
---

# Text labels

A text label is a piece of text rendered in the 3D world at a fixed position or attached to a moving entity (player or vehicle). They are commonly used for player name tags, item descriptions, signs, and floating labels above objectives. SampSharp distinguishes between **global** labels visible to every player (<xref:SampSharp.Entities.SAMP.TextLabel>) and **per-player** labels visible only to one player (<xref:SampSharp.Entities.SAMP.PlayerTextLabel>).

> [!NOTE]
> 3D text labels are different from <xref:SampSharp.Entities.SAMP.TextDraw>. Text draws are 2D HUD overlays drawn on the screen; text labels are 3D objects positioned in the world.

## Creating a text label

Use <xref:SampSharp.Entities.SAMP.IWorldService.CreateTextLabel*> for a label visible to every player:

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var label = worldService.CreateTextLabel(
        text: "General Store",
        color: new Color(255, 255, 255, 255),
        position: new Vector3(1352, -1758, 16),
        drawDistance: 20f,
        virtualWorld: 0,
        testLos: true);
}
```

Parameters worth knowing:

- **`drawDistance`** — how close the player must be (in world units) before the label appears. Labels with very large draw distances cost more to render and clutter the view.
- **`testLos`** (line-of-sight) — when `true`, the label is hidden when there's geometry between the player and the label (walls, buildings). Set to `false` to make the label visible through walls.
- **`virtualWorld`** — use `0` for the default world. A value of `-1` hides the label entirely.
- **Multi-line text** — embed `\n` in the text to break lines, and use SA-MP color embedding (`{RRGGBB}`) inside the text to colour individual words.

```csharp
worldService.CreateTextLabel(
    text: "Ammu-Nation\n{FFFF00}Press F to enter",
    color: new Color(255, 255, 255, 255),
    position: new Vector3(1352, -1758, 16),
    drawDistance: 20f);
```

## Player text labels

A <xref:SampSharp.Entities.SAMP.PlayerTextLabel> is created the same way, but only the owner sees it. Per-player labels are useful for personalized hints, quest markers, or floating debug info that shouldn't be visible to everyone:

```csharp
[Event]
public void OnPlayerSpawn(Player player, IWorldService worldService)
{
    worldService.CreatePlayerTextLabel(
        player: player,
        text: "Welcome back!",
        color: new Color(0, 255, 0, 255),
        position: player.Position + new Vector3(0, 0, 2),
        drawDistance: 10f);
}
```

A `PlayerTextLabel` is **not** automatically destroyed when the owner disconnects — pass `parent: player` if you want it to disappear with the player:

```csharp
worldService.CreatePlayerTextLabel(player, "Hi", Color.White, pos, 10f, parent: player);
```

## Updating text and color

For a global `TextLabel`, the `Text` and `Color` properties are writable, and `SetColorAndText` updates both in one call:

```csharp
label.Text = "Store closed";
label.Color = new Color(255, 0, 0, 255);

// Or both at once
label.SetColorAndText(new Color(0, 255, 0, 255), "Store open");
```

A `PlayerTextLabel` exposes `Text` and `Color` only as read-only properties — use `SetColorAndText` to change them:

```csharp
playerLabel.SetColorAndText(new Color(0, 255, 0, 255), "Quest complete!");
```

## Attaching to a player or vehicle

A text label can follow a moving entity. The label is rendered at an offset relative to the attached entity, which is useful for player name tags, vehicle owner labels, or floating indicators above moving NPCs:

```csharp
// Attach above a player's head
label.Attach(player, offset: new Vector3(0, 0, 1f));

// Attach to a vehicle (the offset is relative to the vehicle origin)
label.Attach(vehicle, offset: new Vector3(0, 0, 2f));

// Detach and place back in the world at an absolute position
label.DetachFromPlayer(new Vector3(1352, -1758, 16));
label.DetachFromVehicle(new Vector3(1352, -1758, 16));
```

`AttachedEntity`, `AttachedPlayer`, and `AttachedVehicle` let you inspect the current attachment. Setting a new attachment replaces the previous one.

## Lifetime

A `TextLabel` or `PlayerTextLabel` is destroyed when you call `Destroy()` on it, when its parent entity is destroyed, or when the server shuts down. A `PlayerTextLabel` is **not** implicitly tied to its owner's lifetime — see [Player text labels](#player-text-labels) above for parenting it to the player if you want that. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (label)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.
