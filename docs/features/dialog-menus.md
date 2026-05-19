---
title: Dialogs and Menus
uid: dialogs-menus
---

# Dialogs and Menus

SampSharp exposes two distinct UI systems for presenting choices to players: **dialogs** and **menus**. Dialogs are pop-up windows provided by SA-MP. Menus are the overlay menus built into GTA: San Andreas itself, repurposed by SA-MP for scripting.

## Dialogs

Dialogs are displayed using <xref:SampSharp.Entities.SAMP.IDialogService>. The service accepts typed dialog objects and returns strongly-typed response structs — you do not work with raw dialog IDs or string callbacks.

### Dialog types

SampSharp provides four dialog classes, each covering a different interaction style:

| Class | Description |
|---|---|
| `MessageDialog` | Body text with one or two buttons. |
| `InputDialog` | Text input field below a body message. Set `IsPassword = true` for masked input. |
| `ListDialog` | Scrollable list of selectable text rows. |
| `TablistDialog` | Rows split into columns. Pass column headers to label them. |

### Displaying a dialog

Inject `IDialogService` into any event handler or system method and call `Show` or `ShowAsync`.

**Callback style** — useful when you do not need to await a result:

```csharp
public class MySystem : ISystem
{
    [Event]
    public void OnPlayerSpawn(Player player, IDialogService dialogs)
    {
        var dialog = new MessageDialog(
            caption: "Welcome",
            content: "Press OK to continue.",
            button1: "OK"
        );

        dialogs.Show(player, dialog, response =>
        {
            // response.Response is DialogResponse.LeftButton or RightButtonOrCancel
            player.SendClientMessage($"You clicked: {response.Response}");
        });
    }
}
```

**Async style** — awaitable, works naturally with `async` event handlers:

```csharp
[Event]
public async Task OnPlayerSpawn(Player player, IDialogService dialogs)
{
    var dialog = new MessageDialog("Welcome", "Press OK to continue.", "OK");
    var response = await dialogs.ShowAsync(player, dialog);

    if (response.Response == DialogResponse.LeftButton)
    {
        player.SendClientMessage("You clicked OK.");
    }
}
```

> [!NOTE]
> If the player disconnects while a dialog is open, the response arrives with `DialogResponse.Disconnected`. Always guard against this in handlers that act on player state.

### The DialogResponse enum

Every dialog response carries a `DialogResponse` value describing how the player closed the dialog:

| Value | Meaning |
|---|---|
| `LeftButton` | Player clicked the primary (left) button. |
| `RightButtonOrCancel` | Player clicked the secondary button, or dismissed the dialog with Escape. |
| `Disconnected` | Player disconnected before responding. |

Each dialog class returns its own response struct with this value plus any fields relevant to that dialog type. Those structs are described in the per-type sections below.

### Message dialogs

A message dialog shows body text and up to two buttons. Pass `null` for `button2` to show only one button.

The response struct is minimal — only the `Response` value matters:

```csharp
public struct MessageDialogResponse
{
    public DialogResponse Response { get; }
}
```

```csharp
var dialog = new MessageDialog(
    caption: "Server Rules",
    content: "No cheating. No griefing.\n\nDo you agree?",
    button1: "I Agree",
    button2: "Decline"
);

dialogs.Show(player, dialog, response =>
{
    if (response.Response == DialogResponse.LeftButton)
    {
        player.SendClientMessage("Welcome aboard!");
    }
    else
    {
        player.Kick();
    }
});
```

### Input dialogs

An input dialog adds a text field below the body. Set `IsPassword = true` to mask the characters the player types.

The response struct adds the text the player typed:

```csharp
public struct InputDialogResponse
{
    public DialogResponse Response { get; }
    public string? InputText { get; }
}
```

`InputText` contains whatever the player typed when `Response == LeftButton`. It is `null` when the player disconnected.

```csharp
// Plain text input
var nameDialog = new InputDialog(
    caption: "Change Name",
    content: "Enter your new name:",
    button1: "OK",
    button2: "Cancel"
);

var response = await dialogs.ShowAsync(player, nameDialog);

if (response.Response == DialogResponse.LeftButton && !string.IsNullOrWhiteSpace(response.InputText))
{
    player.SetName(response.InputText);
    player.SendClientMessage($"Name changed to {player.Name}.");
}
```

```csharp
// Password input (characters are masked)
var pinDialog = new InputDialog
{
    Caption = "Enter PIN",
    Content = "Enter your security PIN:",
    Button1 = "Submit",
    Button2 = "Cancel",
    IsPassword = true
};
```

### List dialogs

A list dialog shows a scrollable list of rows. Each row can carry a `Tag` — an arbitrary object — that is returned in the response so you can associate data without index arithmetic.

The response struct surfaces the selected row:

```csharp
public struct ListDialogResponse
{
    public DialogResponse Response { get; }
    public int ItemIndex { get; }       // -1 if nothing was selected
    public ListDialogRow? Item { get; } // null if nothing was selected
}
```

`Item.Tag` carries the arbitrary object you attached to the row when building the dialog.

```csharp
var dialog = new ListDialog("Select a vehicle", button1: "Spawn", button2: "Cancel");

dialog.Add("Infernus",  tag: VehicleModelType.Infernus);
dialog.Add("Turismo",   tag: VehicleModelType.Turismo);
dialog.Add("Cheetah",   tag: VehicleModelType.Cheetah);

var response = await dialogs.ShowAsync(player, dialog);

if (response.Response == DialogResponse.LeftButton && response.Item != null)
{
    var model = (VehicleModelType)response.Item.Tag!;
    worldService.CreateVehicle(model, player.Position, player.Angle, -1, -1);
    player.SendClientMessage($"Spawned a {model}.");
}
```

You can also add plain text rows without a tag:

```csharp
dialog.Add("Row text");
```

Or construct a `ListDialogRow` manually for fine-grained control:

```csharp
dialog.Add(new ListDialogRow("Infernus") { Tag = VehicleModelType.Infernus });
```

### Tablist dialogs

A tablist dialog organises rows into columns. Pass a column count to get a plain tablist, or pass column header strings to enable column headers.

The response struct mirrors the list dialog response, but `Item.Columns` exposes the column values of the selected row:

```csharp
public struct TablistDialogResponse
{
    public DialogResponse Response { get; }
    public int ItemIndex { get; }
    public TablistDialogRow? Item { get; }
}
```

**Without headers (plain tablist):**

```csharp
var dialog = new TablistDialog("Online Players", "View", "Close", columnCount: 2);
dialog.Add("Johnny", "100");
dialog.Add("Sarah",  "250");
```

**With headers:**

```csharp
var dialog = new TablistDialog(
    caption: "Online Players",
    button1: "View",
    button2: "Close",
    columnHeader1: "Name",
    columnHeader2: "Score"
);

foreach (var onlinePlayer in onlinePlayers)
{
    dialog.Add(new TablistDialogRow(onlinePlayer.Name, onlinePlayer.Score.ToString())
    {
        Tag = onlinePlayer
    });
}

var response = await dialogs.ShowAsync(player, dialog);

if (response.Response == DialogResponse.LeftButton && response.Item != null)
{
    var selected = (Player)response.Item.Tag!;
    player.SendClientMessage($"You selected {selected.Name}.");
}
```

You can also add rows by passing column strings directly:

```csharp
dialog.Add("Johnny", "100");
```

> [!TIP]
> `TablistDialogRow.Tag` is the cleanest way to attach typed data to a row. This avoids recalculating the selected record by index when the response arrives.

### Chaining dialogs

Because `ShowAsync` returns a `Task`, you can chain multiple dialogs in a single async method to build simple multi-step flows:

```csharp
[Event]
public async Task OnPlayerSpawn(Player player, IDialogService dialogs)
{
    var rules = new MessageDialog("Rules", "Do you accept the rules?", "Yes", "No");
    var rulesResponse = await dialogs.ShowAsync(player, rules);

    if (rulesResponse.Response != DialogResponse.LeftButton)
    {
        player.Kick();
        return;
    }

    var name = new InputDialog("Setup", "Enter your display name:", "OK");
    var nameResponse = await dialogs.ShowAsync(player, name);

    if (nameResponse.Response == DialogResponse.LeftButton &&
        !string.IsNullOrWhiteSpace(nameResponse.InputText))
    {
        player.SetName(nameResponse.InputText);
    }
}
```

> [!NOTE]
> Showing a new dialog to a player automatically dismisses any dialog already open for that player.

---

## Menus

SA-MP menus are an in-game screen — distinct from dialogs — that display one or two columns of selectable items. The player navigates rows with the up and down arrow keys, selects the current row with Space, and exits the menu with Enter.

### Creating a menu

Use `IWorldService.CreateMenu` to create a menu entity. Specify the title, screen position (in 2D screen coordinates), and column widths in pixels.

```csharp
[Event]
public void OnGameModeInit(IWorldService worldService)
{
    var menu = worldService.CreateMenu(
        title: "Actions",
        position: new Vector2(200, 100),
        col0Width: 200
    );

    menu.AddItem("Buy weapon");
    menu.AddItem("Heal");
    menu.AddItem("Quit");
}
```

For a two-column menu, supply a second column width:

```csharp
var menu = worldService.CreateMenu(
    title: "Shop",
    position: new Vector2(200, 100),
    col0Width: 150,
    col1Width: 80
);

menu.Col0Header = "Item";
menu.Col1Header = "Price";

menu.AddItem("AK-47",    "$500");
menu.AddItem("Shotgun",  "$300");
menu.AddItem("Health",   "$100");
```

> [!NOTE]
> Menus support a maximum of 12 items. Items past the 12th are not displayed. Each item text may be at most 31 characters.

### Showing and hiding a menu

Call `Show(player)` to display the menu to a specific player, and `Hide(player)` to dismiss it:

```csharp
menu.Show(player);
// later...
menu.Hide(player);
```

### Handling menu events

Listen for `OnPlayerSelectedMenuRow` and `OnPlayerExitedMenu` in an <xref:SampSharp.Entities.ISystem>:

```csharp
public class MenuEventSystem : ISystem
{
    private readonly Menu _actionsMenu;

    public MenuEventSystem(IWorldService worldService)
    {
        _actionsMenu = worldService.CreateMenu("Actions", new Vector2(200, 100), 200);
        _actionsMenu.AddItem("Buy weapon");
        _actionsMenu.AddItem("Heal");
        _actionsMenu.AddItem("Quit");
    }

    [Event]
    public void OnPlayerSelectedMenuRow(Player player, byte row)
    {
        switch (row)
        {
            case 0:
                player.SendClientMessage("You chose: Buy weapon");
                break;
            case 1:
                player.Health = 100;
                player.SendClientMessage("You have been healed.");
                break;
            case 2:
                player.SendClientMessage("Goodbye!");
                player.Kick();
                break;
        }

        _actionsMenu.Hide(player);
    }

    [Event]
    public void OnPlayerExitedMenu(Player player)
    {
        // Player pressed Escape to close the menu
        player.SendClientMessage("Menu closed.");
    }
}
```

> [!TIP]
> `OnPlayerSelectedMenuRow` fires globally — it is not scoped to a specific menu instance. When your game mode shows different menus to the same player, attach a custom [component](xref:entities-components) to the player that records which menu is currently visible, and read it in the event handler to dispatch the row to the right code.

### Disabling rows

Call `DisableRow(int row)` to grey out a row and make it unselectable. Use `IsRowEnabled(int row)` to check whether a row is still active.

```csharp
menu.DisableRow(2); // grey out the third row
```

### Disabling the entire menu

`Disable()` prevents any row from being selected. Check the current state with the `IsEnabled` property.

```csharp
if (menu.IsEnabled)
{
    menu.Disable();
}
```

> [!TIP]
> A `Menu` is a global entity — the same instance can be shown to different players simultaneously by calling `Show(player)` for each player. Each player can see only one menu at a time.
