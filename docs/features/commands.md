---
title: Implementing Commands
uid: commands
---

# Implementing Commands

The SampSharp command system provides a declarative way to handle player and console commands through attributes. Commands are discovered automatically from `ISystem` implementations and can include complex features like overloading, aliasing, command groups, and permission checking.

## Core Concepts

### Player Commands vs Console Commands

**Player Commands** are invoked when a player types a message starting with `/` in the game chat:
- Always require a `Player` parameter as the first argument
- Automatically receive the player who executed the command
- Intended for in-game gameplay commands

**Console Commands** (also known as **RCON commands**) are executed from the server console:
- Execute without automatic player context (typically server-side)
- Optional `ConsoleCommandDispatchContext` parameter can provide player context if the command was executed by a player
- Do not have automatic permission checking
- Useful for server administration and debugging

### Registering Command Handlers

Command methods must be part of an `ISystem` implementation. The command system automatically discovers and registers these methods:

```csharp
public class MyCommandsSystem(IEntityManager entityManager) : ISystem
{
    [PlayerCommand(Name = "hello")]
    public void HelloCommand(Player player)
    {
        player.SendClientMessage("Hello!");
    }

    [ConsoleCommand(Name = "server_status")]
    public void ServerStatus()
    {
        Console.WriteLine("Server is running.");
    }
}
```

## Player Commands

### PlayerCommandAttribute

The `[PlayerCommand]` attribute marks a method as a player command:

```csharp
[PlayerCommand(Name = "kill")]
public void KillCommand(Player player)
{
    player.Health = 0;
}
```

**Capabilities:**
- Automatically detects the first parameter type to determine who can execute the command
- Supports `Player` or custom `Component` types as the first parameter

**Parameter Resolution:**
The first parameter determines command execution context:
- If `Player`: the command can be executed by any player
- If custom `Component` (like a `VIPPlayer` component): the command only works for players with that component
- Subsequent parameters are parsed from user input

**Example:**

```csharp
[PlayerCommand(Name = "spawn")]
public void SpawnCommand(Player player, VehicleModelType model, IWorldService worldService)
{
    player.SendClientMessage($"Spawned a {model}!");
    var vehicle = worldService.CreateVehicle(model, player.Position, player.Angle, -1, -1);
    player.PutInVehicle(vehicle);
}
```

## Console Commands

### ConsoleCommandAttribute

### ConsoleCommandAttribute

The `[ConsoleCommand]` attribute marks a method as a console command:

**Capabilities:**
- Optional `ConsoleCommandDispatchContext` parameter (if present, must be the first parameter) for command metadata
- Can receive any parsed parameters like player commands
- No permission checking (intended for server-side use)
- Name can be explicit or inferred from method name

See the Registering Command Handlers section above for a console command example.

## Options

### Command Aliasing

Use `[Alias]` to provide shorthand names for commands. Multiple aliases are supported:

```csharp
[CommandGroup("economy")]
[PlayerCommand(Name = "money")]
[Alias("$", "cash")]
public void MoneyCommand(Player player)
{
    player.SendClientMessage($"Money: ${player.Money}");
}
```

Now `/economy money`, `/$`, and `/cash` all work. Note that aliases bypass the command group—they're global shortcuts regardless of the group hierarchy. Aliases work for both player and console commands.

### Command Groups

Command groups organize commands into hierarchies. Apply groups to the entire system class or to individual methods:

```csharp
[CommandGroup("admin")]
public class AdminCommandsSystem : ISystem
{
    [PlayerCommand(Name = "kick")]
    public void KickCommand(Player player, Player target) { }

    [PlayerCommand(Name = "ban")]
    public void BanCommand(Player player, Player target) { }
}
```

This creates `/admin kick` and `/admin ban` commands. Groups can be stacked for deeper hierarchies by applying multiple `[CommandGroup]` attributes.

### Command Overloading

Multiple command handlers can have the same name with different parameter signatures. This is useful for commands that support different use cases:

```csharp
[CommandGroup("teleport")]
[PlayerCommand(Name = "player")]
public void TeleportCommand(Player player, Player target)
{
    // /teleport player <target_name>
    player.Position = target.Position;
    player.SendClientMessage($"Teleported to {target.Name}");
}

[CommandGroup("teleport")]
[PlayerCommand(Name = "player")]
public void TeleportCommand(Player player, float x, float y, float z)
{
    // /teleport player <x> <y> <z>
    player.Position = new Vector3(x, y, z);
    player.SendClientMessage($"Teleported to ({x}, {y}, {z})");
}

[CommandGroup("teleport")]
[PlayerCommand(Name = "player")]
[Alias("tp")]
public void TeleportCommand(Player player, Player target, float x, float y, float z)
{
    // /teleport player <target_name> <x> <y> <z> OR /tp <target_name> <x> <y> <z>
    // Admin command to teleport another player
    target.Position = new Vector3(x, y, z);
    player.SendClientMessage($"Teleported {target.Name} to ({x}, {y}, {z})");
}
```

The command system automatically selects the correct overload based on parameter types and count:
- `/teleport player Johnny` calls the first overload (Player parameter)
- `/teleport player 100 200 50` calls the second overload (three float parameters)
- `/teleport player Johnny 100 200 50` or `/tp Johnny 100 200 50` calls the third overload (Player + three floats)

Command overloading works for both player and console commands.

### Permission Checking

> [!NOTE]
> Permission checking documentation coming soon.

### Optional Parameters and Dependency Injection

Commands support optional parameters for flexible syntax and dependency injection for services:

```csharp
[PlayerCommand(Name = "money")]
public void MoneyCommand(Player player, int? amount = null, IWorldService worldService = null)
{
    if (amount.HasValue)
    {
        player.Money = amount.Value;
        player.SendClientMessage($"Money set to ${amount.Value}");
    }
    else
    {
        player.SendClientMessage($"Current money: ${player.Money}");
    }
}
```

### Command Introspection

The `IPlayerCommandService` provides access to all registered commands:

```csharp
[PlayerCommand(Name = "help")]
public void HelpCommand(Player player, IPlayerCommandService commands)
{
    player.SendClientMessage("--- Available Commands ---");
    
    var commandList = commands.Registry.GetAll()
        .OrderBy(c => c.Name)
        .ToList();

    foreach (var cmd in commandList)
    {
        var aliases = cmd.Aliases.Count > 0 
            ? $" ({string.Join(", ", cmd.Aliases.Select(a => $"/{a.Name}"))})" 
            : "";
        player.SendClientMessage($"/{cmd.Name}{aliases}");
    }
}
```

## Return Types

Command methods support the following return types:

- `void` - Standard synchronous command execution
- `bool` - Indicates success (`true`) or failure (`false`)
- `Task` - Asynchronous command execution
- `Task<bool>` - For synchronous completion, the bool indicates success/failure. For async completion, the task completion is assumed to be success regardless of the return value


