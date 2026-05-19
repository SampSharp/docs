---
title: Built-in Events Reference
uid: built-in-events
---

# Built-in Events Reference

This page lists every event SampSharp dispatches from open.mp, organized by category. For an explanation of how to handle events, return value semantics, multiple handlers, custom events, and middleware, see <xref:events>.

## How to read the tables

- **Signature** — the parameter list your handler can accept. Parameters may be reordered or omitted in your handler; any extra parameter you declare is resolved as a dependency-injected service. See <xref:events> for parameter resolution rules.
- **Returns** — the return type. `bool` events show the *default* in parentheses (e.g. `bool` *(true)*). Returning the default value is equivalent to declaring `void`; returning the non-default value changes the engine's behavior. See <xref:events> for the full return-value semantics, including how multiple handlers compose.

## Server & Initialization

| Signature | Returns | Description |
|---|---|---|
| `OnGameModeInit()` | `void` | Server starts. |
| `OnGameModeExit()` | `void` | Server exits or shuts down. |

## Player Connection

| Signature | Returns | Description |
|---|---|---|
| `OnIncomingConnection(Player, string ipAddress, int port)` | `void` | Called before a player connects (can reject). |
| `OnPlayerConnect(Player)` | `void` | A player connected. |
| `OnPlayerDisconnect(Player, DisconnectReason reason)` | `void` | A player disconnected. |
| `OnPlayerClientInit(Player)` | `void` | The player's client finished initializing. |

## Player Classes & Spawning

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerRequestClass(Player, Class)` | `void` | Player selected a class at class selection. |
| `OnPlayerRequestSpawn(Player)` | `bool` *(true)* | Player attempts to spawn. Return `false` to reject. |
| `OnPlayerSpawn(Player)` | `void` | Player spawned. |

## Player Movement & Updates

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerStreamIn(Player, Player forPlayer)` | `void` | Player streamed in for another player. |
| `OnPlayerStreamOut(Player, Player forPlayer)` | `void` | Player streamed out for another player. |
| `OnPlayerUpdate(Player, DateTime)` | `bool` *(true)* | Per-player update tick. Return `false` to reject. |

## Player Text & Commands

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerText(Player, string message)` | `bool` *(true)* | Player sent chat. Return `false` to suppress the message. |
| `OnPlayerCommandText(Player, string text)` | `bool` *(false)* | Unhandled chat starting with `/`. Return `true` if you handled it. |

## Player Interactions

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerClickMap(Player, Vector3 position)` | `void` | Player clicked the map. |
| `OnPlayerClickPlayer(Player, Player clicked, ClickSource source)` | `void` | Player clicked another player. |

## Checkpoints

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerEnterCheckpoint(Player)` | `void` | Player entered a checkpoint. |
| `OnPlayerLeaveCheckpoint(Player)` | `void` | Player left a checkpoint. |
| `OnPlayerEnterRaceCheckpoint(Player)` | `void` | Player entered a race checkpoint. |
| `OnPlayerLeaveRaceCheckpoint(Player)` | `void` | Player left a race checkpoint. |

## Dialogs

| Signature | Returns | Description |
|---|---|---|
| `OnDialogResponse(Player, int dialogId, DialogResponse response, int listItem, string inputText)` | `void` | Player responded to a dialog. |

> [!TIP]
> When using <xref:SampSharp.Entities.SAMP.IDialogService>, dialog responses are delivered through the service's callback or `ShowAsync` task — you do not need to handle `OnDialogResponse` directly. See <xref:dialogs-menus>.

## Health & Damage

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerDeath(Player, Player killer, Weapon reason)` | `void` | Player died. |
| `OnPlayerTakeDamage(Player, Player from, float amount, Weapon weapon, BodyPart part)` | `void` | Player took damage. |
| `OnPlayerGiveDamage(Player, Player to, float amount, Weapon weapon, BodyPart part)` | `void` | Player dealt damage. |

## Vehicles

| Signature | Returns | Description |
|---|---|---|
| `OnVehicleStreamIn(Vehicle, Player forPlayer)` | `void` | Vehicle streamed in. |
| `OnVehicleStreamOut(Vehicle, Player forPlayer)` | `void` | Vehicle streamed out. |
| `OnVehicleSpawn(Vehicle)` | `void` | Vehicle spawned. |
| `OnVehicleDeath(Vehicle)` | `void` | Vehicle was destroyed. |
| `OnVehicleDamageStatusUpdate(Vehicle)` | `void` | Vehicle damage status updated. |
| `OnPlayerEnterVehicle(Player, Vehicle, bool isPassenger)` | `void` | Player entered a vehicle. |
| `OnPlayerExitVehicle(Player, Vehicle)` | `void` | Player exited a vehicle. |
| `OnUnoccupiedVehicleUpdate(Vehicle)` | `bool` *(true)* | Unoccupied vehicle update. Return `false` to reject. |
| `OnTrailerUpdate(Vehicle trailer)` | `bool` *(true)* | Trailer update. Return `false` to reject. |
| `OnVehicleSirenStateChange(Vehicle)` | `bool` *(true)* | Vehicle siren state changed. Return `false` to reject. |
| `OnVehiclePaintJob(Player, Vehicle, int paintJob)` | `bool` *(true)* | Player modified paint job. Return `false` to reject. |
| `OnVehicleMod(Player, Vehicle, int componentId)` | `bool` *(true)* | Player added a mod. Return `false` to reject. |
| `OnVehicleRespray(Player, Vehicle, int color1, int color2)` | `bool` *(true)* | Player resprayed a vehicle. Return `false` to reject. |
| `OnEnterExitModShop(Player, bool enter, ModShop modShop)` | `void` | Player entered or exited a mod shop. |

## Objects

| Signature | Returns | Description |
|---|---|---|
| `OnObjectMoved(GlobalObject)` | `void` | Object finished moving. |
| `OnPlayerObjectMoved(Player, PlayerObject)` | `void` | Player object finished moving. |
| `OnObjectSelected(Player, GlobalObject, int model, Vector3 position)` | `void` | Player selected an object. |
| `OnPlayerObjectSelected(Player, PlayerObject, int model, Vector3 position)` | `void` | Player selected one of their player objects. |
| `OnObjectEdited(Player, GlobalObject, int response, Vector3 offset, Vector3 rotation)` | `void` | Object was edited. |
| `OnPlayerObjectEdited(Player, PlayerObject, int response, Vector3 offset, Vector3 rotation)` | `void` | Player object was edited. |
| `OnPlayerAttachedObjectEdited(Player, int index, bool saved, AttachedObjectEditData data)` | `void` | Attached object was edited. |

## Text Draws

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerClickTextDraw(Player, TextDraw)` | `void` | Player clicked a text draw. |
| `OnPlayerClickPlayerTextDraw(Player, PlayerTextDraw)` | `void` | Player clicked one of their player text draws. |
| `OnPlayerCancelTextDrawSelection(Player)` | `bool` *(true)* | Player cancelled text draw selection. Return `false` to reject. |
| `OnPlayerCancelPlayerTextDrawSelection(Player)` | `bool` *(true)* | Player cancelled player text draw selection. Return `false` to reject. |

## Menus

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerSelectedMenuRow(Player, Menu, int row)` | `void` | Player selected a menu row. |
| `OnPlayerExitedMenu(Player)` | `void` | Player closed a menu. |

## Actors

| Signature | Returns | Description |
|---|---|---|
| `OnActorStreamIn(Actor, Player forPlayer)` | `void` | Actor streamed in. |
| `OnActorStreamOut(Actor, Player forPlayer)` | `void` | Actor streamed out. |
| `OnPlayerGiveDamageActor(Player, Actor, float amount, Weapon weapon, BodyPart part)` | `void` | Player damaged an actor. |

## NPCs

| Signature | Returns | Description |
|---|---|---|
| `OnNPCCreate(NPC)` | `void` | NPC was created. |
| `OnNPCDestroy(NPC)` | `void` | NPC was destroyed. |
| `OnNPCSpawn(NPC)` | `void` | NPC spawned. |
| `OnNPCRespawn(NPC)` | `void` | NPC respawned. |
| `OnNPCFinishMove(NPC)` | `void` | NPC finished moving. |
| `OnNPCDeath(NPC, Player killer, Weapon reason)` | `void` | NPC died. |
| `OnNPCWeaponStateChange(NPC, Weapon oldWeapon, Weapon newWeapon)` | `void` | NPC weapon changed. |
| `OnNPCPlaybackStart(NPC, Playback playback)` | `void` | NPC playback started. |
| `OnNPCPlaybackEnd(NPC, Playback playback)` | `void` | NPC playback ended. |
| `OnNPCFinishNodePoint(NPC, int nodePoint)` | `void` | NPC reached a node point. |
| `OnNPCFinishNode(NPC, int node)` | `void` | NPC finished a node. |
| `OnNPCFinishMovePathPoint(NPC, int pathPoint)` | `void` | NPC reached a move path point. |
| `OnNPCFinishMovePath(NPC, MovePath path)` | `void` | NPC finished a move path. |
| `OnNPCTakeDamage(NPC, Player from, float amount, Weapon weapon, BodyPart part)` | `bool` *(true)* | NPC took damage. Return `false` to reject. |
| `OnNPCGiveDamage(NPC, Player to, float amount, Weapon weapon, BodyPart part)` | `bool` *(true)* | NPC dealt damage. Return `false` to reject. |
| `OnNPCShotMissed(NPC, Weapon weapon, Vector3 position)` | `bool` *(true)* | NPC missed a shot. Return `false` to reject. |
| `OnNPCShotPlayer(NPC, Player target, Weapon weapon, BodyPart part)` | `bool` *(true)* | NPC shot a player. Return `false` to reject. |

## Weapon & Shooting

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerShotMissed(Player, Weapon weapon, BulletData bulletData)` | `bool` *(true)* | Player missed a shot. Return `false` to reject. |
| `OnPlayerShotPlayer(Player, Player target, Weapon weapon, BulletData bulletData)` | `bool` *(true)* | Player shot another player. Return `false` to reject. |
| `OnPlayerShotVehicle(Player, Vehicle target, Weapon weapon, BulletData bulletData)` | `bool` *(true)* | Player shot a vehicle. Return `false` to reject. |
| `OnPlayerShotObject(Player, GlobalObject target, Weapon weapon, BulletData bulletData)` | `bool` *(true)* | Player shot an object. Return `false` to reject. |
| `OnPlayerShotPlayerObject(Player, PlayerObject target, Weapon weapon, BulletData bulletData)` | `bool` *(true)* | Player shot a player object. Return `false` to reject. |

## Custom Models & Downloads

| Signature | Returns | Description |
|---|---|---|
| `OnPlayerRequestDownload(Player, CustomModelType type, int modelId)` | `bool` *(true)* | Player requested a custom model download. Return `false` to reject. |
| `OnPlayerFinishedDownloading(Player)` | `void` | Player finished downloading custom models. |

## Console & Admin

| Signature | Returns | Description |
|---|---|---|
| `OnRconLoginAttempt(Player, string password, bool success)` | `void` | RCON login attempt. |
| `OnConsoleCommandListRequest(ConsoleCommandCollection commands)` | `void` | Console command list was requested. |
