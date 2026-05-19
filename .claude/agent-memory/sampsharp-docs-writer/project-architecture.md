---
name: project-architecture
description: SampSharp source layout, key namespaces, and the two-layer API pattern (Core vs Entities)
metadata:
  type: project
---

SampSharp has two distinct layers in `sampsharp-src/src/`:

**Layer 1 — `SampSharp.OpenMp.Core` (`SampSharp.OpenMp.Core.Api` namespace)**
- Raw open.mp API bindings: `IPlayerDialogData`, `IDialogsComponent`, `IMenu`, `IMenusComponent`, etc.
- Enums here use ALLCAPS or abbreviated names (e.g. `DialogStyle.MSGBOX`, `DialogResponse.Left/Right`)
- Accessed directly only when working at the native level

**Layer 2 — `SampSharp.OpenMp.Entities` (`SampSharp.Entities.SAMP` namespace)**
- The idiomatic C# API developers actually use
- Higher-level types: `MessageDialog`, `InputDialog`, `ListDialog`, `TablistDialog`, `Menu`, `Player`, `Vehicle`, etc.
- Enums have friendly names: `DialogStyle.MessageBox`, `DialogResponse.LeftButton/RightButtonOrCancel/Disconnected`
- Services registered as singletons: `IDialogService`, `IWorldService`, `ITimerService`, etc.
- Event handlers live in `ISystem` implementations using `[Event]` attribute

**Why this matters:** Always document the Entities layer API — that is what gamemode developers use. The Core layer is an implementation detail.

**Key service for dialogs:** `IDialogService` — registered automatically, no setup needed.
**Key service for menus:** `IWorldService.CreateMenu(...)` — menus are world entities.

**Dialog ID note:** `DialogService` internally uses dialog ID `10000`. Dialog IDs are not exposed to gamemode code.
