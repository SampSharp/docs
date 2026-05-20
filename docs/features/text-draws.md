---
title: Text draws
uid: text-draws
---

# Text draws

A text draw is a 2D HUD element rendered on top of the screen — used for scoreboards, custom on-screen labels, menus, sprites, and clickable buttons. SampSharp distinguishes between **global** text draws shared across players (<xref:SampSharp.Entities.SAMP.TextDraw>) and **per-player** text draws (<xref:SampSharp.Entities.SAMP.PlayerTextDraw>), each player drawing their own.

> [!NOTE]
> Text draws are HUD overlays in screen space. For text rendered in the 3D world (above a player's head, on a sign, etc.) use <xref:text-labels> instead.

### Global or per-player?

Pick the one that fits how the text draw is used:

| Need | Use |
|---|---|
| One text draw shown to many players (a server logo, a shared event banner) | <xref:SampSharp.Entities.SAMP.TextDraw> |
| Different text or values per player (HUDs, scoreboards with per-player stats) | <xref:SampSharp.Entities.SAMP.PlayerTextDraw> |

A global `TextDraw` can still show **different text to different players** via `SetTextForPlayer` — useful for changing one or two characters per player without exhausting the per-player text draw pool.

## Creating a text draw

Use <xref:SampSharp.Entities.SAMP.IWorldService.CreateTextDraw*> with a 2D screen position and the initial text. Screen coordinates run from `(0, 0)` (top-left) to roughly `(640, 480)` (bottom-right) on a resolution-independent canvas — prefer whole numbers so the layout stays stable across player resolutions.

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var hud = worldService.CreateTextDraw(
        position: new Vector2(10, 400),
        text: "My Server");

    hud.Font = TextDrawFont.Pricedown;
    hud.LetterSize = new Vector2(0.5f, 1.6f);
    hud.ForeColor = new Color(255, 255, 0, 255);
    hud.UseBox = false;
    hud.Show();
}
```

`Show()` displays the text draw to every connected player. `Show(player)` and `Hide(player)` operate on one player only — the text draw is not visible until you show it.

> [!NOTE]
> A newly created text draw has no inherent styling. If you do not set at least `Font` and `LetterSize`, the result may not render or may render as a thin line. Always configure the draw before calling `Show()`.

> [!TIP]
> With `Alignment.Right`, the creation position is interpreted as the **top-right corner** instead of top-left. This is the same SA-MP quirk that affects [TextSize](#styling) — it shows up at create time too if you build right-aligned HUD elements.

## Per-player text draws

A <xref:SampSharp.Entities.SAMP.PlayerTextDraw> is created the same way but only the owner sees it. Per-player draws are essential for HUDs that display different data for each player (health, money, ammo) since updating a global text draw's text changes it for everyone:

```csharp
[Event]
public void OnPlayerSpawn(Player player, IWorldService worldService)
{
    var hud = worldService.CreatePlayerTextDraw(
        player: player,
        position: new Vector2(10, 400),
        text: "Score: 0");

    hud.Font = TextDrawFont.Normal;
    hud.LetterSize = new Vector2(0.4f, 1.2f);
    hud.ForeColor = new Color(255, 255, 255, 255);
    hud.Show();
}
```

A `PlayerTextDraw` is **not** automatically destroyed when the owner disconnects — pass `parent: player` if you want it to disappear with the player.

## Styling

Both `TextDraw` and `PlayerTextDraw` expose the same styling surface:

```csharp
// Font face (Diploma, Normal, Slim, Pricedown, DrawSprite, PreviewModel)
draw.Font = TextDrawFont.Pricedown;

// Letter width and height
draw.LetterSize = new Vector2(0.5f, 1.6f);

// Colors
draw.ForeColor = new Color(255, 255, 255, 255);  // letter color
draw.BackColor = new Color(0, 0, 0, 255);        // background color
draw.Shadow = 1;                                  // shadow depth
draw.Outline = 0;                                 // outline thickness

// Box around the text
draw.UseBox = true;
draw.BoxColor = new Color(0, 0, 0, 150);
draw.TextSize = new Vector2(200, 50);            // box size + clickable area (see warning below)

// Alignment (Default, Left, Center, Right)
draw.Alignment = TextDrawAlignment.Center;

// Variable-width vs fixed-width characters
draw.Proportional = true;
```

> [!TIP]
> `LetterSize` X scales width, Y scales height. Most usable HUDs land around X 0.3–0.6 and Y 1.0–2.0. Increasing `Outline` makes text easier to read against busy backgrounds.

> [!WARNING]
> `TextSize` interpretation depends on the current `Alignment` — this is an SA-MP quirk, not a SampSharp one:
>
> - **`Left`** — the `(x, y)` is the **right-most corner**, in absolute screen coordinates.
> - **`Center`** — `x` is the **overall box width**, and `x` and `y` must be **swapped** compared to the other alignments.
> - **`Right`** — the `(x, y)` is the **left-most corner**, in absolute screen coordinates.
>
> For `DrawSprite` and `PreviewModel` fonts, `TextSize` is instead the **width and height** of the rendered content (from the text draw's origin).
>
> If a box, hitbox, or sprite ends up the wrong size or in the wrong place, mis-aligned `TextSize` is almost always why.

## Updating text

Setting the `Text` property changes the text for everyone (or for the owner, on a `PlayerTextDraw`):

```csharp
hud.Text = "Money: $1,000";
```

For a **global** `TextDraw`, you can update the text shown to a single player without disturbing others using `SetTextForPlayer`. This is useful for shared HUD layouts where one or two numbers vary per player:

```csharp
sharedHud.SetTextForPlayer(player, $"Score: {player.Score}");
```

## Selectable (clickable) text draws

Make a text draw clickable by enabling `Selectable`, setting an explicit `Alignment`, and giving it a `TextSize` whose value matches that alignment's [coordinate convention](#styling). Clicks only fire while the player is in text-draw selection mode:

```csharp
public class MenuSystem : ISystem
{
    private readonly TextDraw _playButton;

    public MenuSystem(IWorldService world)
    {
        _playButton = world.CreateTextDraw(new Vector2(50, 25), "PLAY");
        _playButton.Font = TextDrawFont.Pricedown;
        _playButton.LetterSize = new Vector2(0.8f, 2.2f);
        _playButton.ForeColor = new Color(0, 255, 0, 255);
        _playButton.UseBox = true;

        _playButton.Alignment = TextDrawAlignment.Left;
        _playButton.TextSize = new Vector2(140, 20);
        _playButton.Selectable = true;
    }

    [Event]
    public void OnPlayerConnect(Player player)
    {
        _playButton.Show(player);

        // Enter selection mode so the player can click; hoverColor highlights the
        // currently-hovered text draw.
        player.SelectTextDraw(new Color(255, 255, 0, 255));
    }

    [Event]
    public void OnPlayerClickTextDraw(Player player, TextDraw draw)
    {
        if (draw != _playButton)
            return;

        _playButton.Hide(player);
        player.CancelSelectTextDraw();
        player.Spawn();
    }
}
```

A few things to note:

- The text draw must be **shown to each player** (`Show(player)`) before they can click it — `Show()` only displays it to players who are connected at the time of the call, so new joiners won't see anything until you re-show it for them.
- Setting an explicit `Alignment` and a matching `TextSize` is required for the hitbox to register clicks. The exact relationship between position, alignment, and `TextSize` is fiddly in practice; the values above are a known-good starting point — adjust `TextSize` until the highlight on hover matches the visible box.
- Selection mode also enables the cursor. Call `player.CancelSelectTextDraw()` to exit, as shown above. If the player presses Escape themselves, `OnPlayerCancelTextDrawSelection` fires.
- Player text draws use the parallel `OnPlayerClickPlayerTextDraw` event.

## Sprites and preview models

Two specialised fonts unlock non-text content:

- **`TextDrawFont.DrawSprite`** — renders a texture from a TXD library. Set the text to `"library:texture"` (for example, `"hud:radar_ammugun"`).
- **`TextDrawFont.PreviewModel`** — renders a 3D model preview inside the text draw box. Set `PreviewModel`, then `SetPreviewRotation(rotation, zoom)` to orient it. For vehicle previews, use `SetPreviewVehicleColor`.

```csharp
var preview = worldService.CreateTextDraw(new Vector2(500, 200), "_");
preview.Font = TextDrawFont.PreviewModel;
preview.TextSize = new Vector2(80, 80);
preview.UseBox = true;
preview.PreviewModel = 411;                            // Infernus
preview.SetPreviewRotation(new Vector3(0, 0, 45), zoom: 1.0f);
preview.SetPreviewVehicleColor(1, 1);
preview.Show();
```

## Lifetime

A `TextDraw` or `PlayerTextDraw` is destroyed when you call `Destroy()` on it, when its parent entity is destroyed, or when the server shuts down. A `PlayerTextDraw` is **not** implicitly tied to its owner's lifetime — pass `parent: player` to `CreatePlayerTextDraw` if you want the text draw to disappear when the player disconnects. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (draw)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.
