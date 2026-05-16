---
title: Implementing Commands
uid: commands
---

# Implementing Commands

The SampSharp command system provides a declarative way to handle player and console commands through attributes. Commands are discovered automatically from <xref:SampSharp.Entities.ISystem> implementations and can include complex features like overloading, aliasing, command groups, and permission checking.

## Setup

To enable the command system, call `UseCommands()` in your <xref:SampSharp.Entities.IEcsStartup>.Initialize() method:

```csharp
public class Startup : IEcsStartup
{
    public void Initialize(IStartupContext context)
    {
        context.UseEntities()
            .UseCommands();
    }
}
```

## Core Concepts

### Player Commands vs Console Commands

**Player Commands** are invoked when a player types a message starting with `/` in the game chat:
- Always require a <xref:SampSharp.Entities.SAMP.Player> parameter as the first argument
- Automatically receive the player who executed the command
- Intended for in-game gameplay commands

**Console Commands** (also known as **RCON commands**) are executed from the server console:
- Execute without automatic player context (typically server-side)
- Optional <xref:SampSharp.Entities.SAMP.Commands.ConsoleCommandDispatchContext> parameter can provide player context if the command was executed by a player
- Do not have automatic permission checking
- Useful for server administration and debugging

### Registering Command Handlers

Command methods must be part of an <xref:SampSharp.Entities.ISystem> implementation. The command system automatically discovers and registers these methods:

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

### Command Naming

Command names come from the `Name` property of the attribute. If `Name` is not specified, the command system infers it from the method name:
- Method name is converted to lowercase
- If the method name ends with `"Command"`, that suffix is removed

**Examples:**
- Method `KillCommand()` → command name `kill`
- Method `ServerStatus()` → command name `server_status`
- Method `StatusCommand()` → command name `status`
- Method `Help()` → command name `help`

By default, command names are **case-insensitive**, so `/Kill`, `/KILL`, and `/kill` all invoke the same command. If you need exact case matching, configure case sensitivity in your startup:

```csharp
public class Startup : IEcsStartup
{
    public void Initialize(IStartupContext context)
    {
        context.UseEntities()
            .UsePlayerCommands(cfg => cfg.StringComparison = StringComparison.Ordinal)
            .UseConsoleCommands(cfg => cfg.StringComparison = StringComparison.Ordinal);
    }
}
```

With `StringComparison.Ordinal`, `/kill` and `/Kill` are now treated as different commands.

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
- Supports <xref:SampSharp.Entities.SAMP.Player> or custom <xref:SampSharp.Entities.Component> types as the first parameter

**Parameter Resolution:**
The first parameter determines command execution context:
- If <xref:SampSharp.Entities.SAMP.Player>: the command can be executed by any player
- If custom <xref:SampSharp.Entities.Component> (like a `VIPPlayer` component): the command only works for players with that component
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

The `[ConsoleCommand]` attribute marks a method as a console command:

**Capabilities:**
- Optional <xref:SampSharp.Entities.SAMP.Commands.ConsoleCommandDispatchContext> parameter (if present, must be the first parameter) for command metadata
- No permission checking (intended for server-side use)

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

Command groups organize commands into hierarchies. Apply groups to the entire system class or to individual methods using `[CommandGroup]`:

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

### Optional Parameters

Commands support optional parameters to make command syntax more flexible. Optional parameters can have default values:

```csharp
[PlayerCommand(Name = "money")]
public void MoneyCommand(Player player, int? amount = null)
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

Now `/money` displays the current money, while `/money 5000` sets it to 5000.

### Dependency Injection

Commands can receive dependencies from your service collection. Any registered service can be injected as a parameter. Dependency injection parameters can appear anywhere in the method signature, even before optional parameters:

```csharp
[PlayerCommand(Name = "money")]
public void MoneyCommand(Player player, IWorldService worldService, int? amount = null)
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

The injected `IWorldService` is provided automatically, while `amount` remains optional from user input.

### Command Introspection

The <xref:SampSharp.Entities.SAMP.Commands.IPlayerCommandService> provides access to all registered commands:

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

### Player Component Checking

Instead of <xref:SampSharp.Entities.SAMP.Player> (or `EntityId`), a custom <xref:SampSharp.Entities.Component> can be used as the first parameter of a player command. In this case, the command is only available to players who have that component attached.

```csharp
public class CivilianComponent : Component { }

[PlayerCommand(Name = "civonly")]
public void CivOnlyCommand(CivilianComponent civilian)
{
    // Only players with the CivilianComponent can use this command
    civilian.Player.SendClientMessage("You are a civilian!");
}
```

This allows for role-based or feature-based command access control using your own <xref:SampSharp.Entities.Component> types.

### Command Tags

Use `[CommandTag]` to attach custom metadata to commands as key-value pairs. Tags can be used for permission checking, categorization, or any other custom logic.

```csharp
[PlayerCommand(Name = "kick")]
[CommandTag("permission", "admin")]
[CommandTag("category", "moderation")]
public void KickCommand(Player player, Player target)
{
    target.Kick();
}
```

Multiple tags can be applied to the same command. Tags are typically used by custom <xref:SampSharp.Entities.SAMP.Commands.IPermissionChecker> implementations to enforce access control:

```csharp
public class MyPermissionChecker : IPermissionChecker
{
    public bool HasPermission(Player player, CommandDefinition command)
    {
        var permission = command.GetTag("permission");
        if (permission == null)
            return true; // No permission requirement
        
        return player.HasPermission(permission);
    }
}
```

## Return Types

Command methods support the following return types:

- `void` - Standard synchronous command execution
- `bool` - Indicates success (`true`) or failure (`false`)
- `Task` - Asynchronous command execution
- `Task<bool>` - For synchronous completion, the bool indicates success/failure. For async completion, the task completion is assumed to be success regardless of the return value

## Customization

The command system provides two main extension points for customization: permission checking and text formatting.

### Permission Checking

Implement <xref:SampSharp.Entities.SAMP.Commands.IPermissionChecker> to define custom permission logic for player commands. The default implementation allows all commands.

```csharp
public class MyPermissionChecker : IPermissionChecker
{
    public bool HasPermission(Player player, CommandDefinition command)
    {
        // Check if the command has a "permission" tag
        var permission = command.GetTag("permission");
        if (permission == null)
            return true; // No permission requirement

        // Check your permission system
        return player.IsAdmin || HasPlayerPermission(player, permission);
    }

    private bool HasPlayerPermission(Player player, string permission)
    {
        // Implement your game's permission system here
        return false;
    }
}
```

Register your custom permission checker in your startup class to replace the default:

```csharp
services.RemoveAll(typeof(IPermissionChecker));
services.AddSingleton<IPermissionChecker, MyPermissionChecker>();
```

### Custom Text Formatting

Implement <xref:SampSharp.Entities.SAMP.Commands.ICommandTextFormatter> to customize how command usage, not found, and other error messages are formatted. This is useful for localization or custom message styles.

```csharp
public class MyCommandTextFormatter : ICommandTextFormatter
{
    public string FormatCommandUsage(string commandName, string? group, CommandParameterInfo[] parameters, bool includeSlash = true)
    {
        var prefix = includeSlash ? "/" : "";
        var groupPrefix = group != null ? $"{group} " : "";
        var paramStr = string.Join(" ", parameters.Select(p => 
            p.IsOptional ? $"[{p.Name}]" : $"<{p.Name}>"
        ));
        
        return $"{prefix}{groupPrefix}{commandName} {paramStr}".Trim();
    }
}
```

Register your custom formatter in your startup class to replace the default:

```csharp
services.RemoveAll(typeof(ICommandTextFormatter));
services.AddSingleton<ICommandTextFormatter, MyCommandTextFormatter>();
```
