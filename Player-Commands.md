- [Introduction](#introduction)
- [Decorating Methods](#decorating-methods)
- [Naming](#naming)
- [Parameters](#parameters)
- [Custom Parameter Types](#custom-parameter-types)
- [Return Values](#return-values)
- [Grouping Commands](#grouping-commands)
- [Permissions](#permissions)
- [Default Values](#default-values)
- [Overloading Commands](#overloading-commands)
- [Ignore Case](#ignore-case)
- [Usage Message](#usage-message)
- [Overriding Default Behavior](#overriding-default-behavior)
- [Custom Command Class](#custom-command-class)

Introduction
------------
SampSharp provides an easy-to-use commands system. A command can be created by registering a class to the `CommandManager` service or by decorating a method with the `Command` attribute.

Decorating Methods
------------------
A method can be decorated with the `Command` attribute to tell the command manager to load it. 

### Eligible Methods
- The method must either be static or a member of a subclass of `BasePlayer`.
- The method may be of any protection level in a class of any accessibility level.
- The method must be marked with the `Command` attribute.
- The method's return type must be either `void` or `bool`.
- If the method is static, the first parameter must be (of a subtype) of type `BasePlayer`.

### Static Methods
A static method marked as a command must accept a `BasePlayer` or subclass of `BasePlayer` as first parameter. Subsequent parameters indicate the parameters of the command itself.

``` c#
class AnyClass
{
    [Command("helloworld")]
    private static void HelloWorldCommand(BasePlayer sender, int times)
    {
        for(var i = 0; i < times; i++)
            sender.SendClientMessage("Hello, world!");
    }
}
```

### Subclass of BasePlayer
All parameters of a method marked as a command within a subtype of the `BasePlayer` type indicate the parameters of the command itself.

``` c#
class MyPlayer : BasePlayer
{
    [Command("helloworld")]
    private void HelloWorldCommand(int times)
    {
        for(var i = 0; i < times; i++)
            sender.SendClientMessage("Hello, world!");
    }
}
```

Naming
------
You can specify different types of names to commands. Each of these types have a different purpose.

### Names
You can give a command multiple names simply by listing them all within the `Command` attribute. The following command is available via `/admin vehicle [model]`, `/admin veh [model]` and `/admin v [model]`.

``` c#
[CommandGroup("admin")]
class AnyClass
{
    [Command("vehicle", "veh", "v")]
    private static void SpawnVehicleCommand(BasePlayer sender, VehicleModelType model) { }
}
```

### Display Name
If a command has multiple names, you can specify the display name which will, for example, be used in the usage message.
``` c#
[Command("vehicle", "veh", "v", DisplayName = "v")]
```

### Shortcut
If a command is in a group, but you also want to give it a short command, you can specify a shortcut. The following command is available via `/admin vehicle [model]`, `/admin veh [model]` and `/v [model]` (the shortcut).

``` c#
[CommandGroup("admin")]
class AnyClass
{
    [Command("vehicle", "veh", Shortcut = "v", DisplayName = "v")]
    private static void SpawnVehicleCommand(BasePlayer sender, VehicleModelType model) { }
}
```

Parameters
----------
The framework supports a number of parameter types by default: `int`, `float`, `string`, `BasePlayer`, a subclass of `BasePlayer` or any type of enumeration. The command text is automatically parsed for these types.

``` c#
class AnyClass
{
    [Command("hello")]
    private static void SayHelloCommand(BasePlayer sender, BasePlayer player, int money)
    {
        player.SendClientMessage("{0} says hello and has given you ${1}!", player, money)
        player.Money += money;
    }

    [Command("like")]
    private static void LikeCommand(BasePlayer sender, VehicleModelType model)
    {
        BasePlayer.SendClientMessageToAll("{0} would like to have a {1}!", sender, model);
    }
}
```

The behavior of `string` parameters is a special case. If a non-last parameter of type `string` is parsed, only a *single* word (separated by a space) is taken. If a last parameter of type `string` is parsed, the whole remainder of the command text is taken.

``` c#
class AnyClass
{
    [Command("repeat")]
    private void RepeatCommand(string word, int times)
    {
        // `/repeat hello 2` prints `hello` twice.

        for(var i = 0; i < times; i++)
            sender.SendClientMessage(word);
    }

    [Command("like")]
    private static void LikeCommand(BasePlayer sender, string message)
    {
        // `/like big guns` prints `John Doe likes big guns!`.

        BasePlayer.SendClientMessageToAll("{0} likes {1}!", sender, message);
    }
}
```

Custom Parameter Types
----------------------
### Specifying Parser
If you'd like a parameter to be parsed in a non-default way you can explicitly specify the parser.

``` c#
class AnyClass
{
    [Command("repeat")]
    private void RepeatCommand(BasePlaye sender, [Parameter(typeof(WordType))]string word)
    {
        // `/repeat hello world` still only prints `hello` twice. `world` is discarded.

        for(var i = 0; i < 2; i++)
            sender.SendClientMessage(word);
    }
}
```

### Writing Parsers
It is also possible to write your own parsers.

``` c#
class CustomType : ICommandParameterType
{
    #region Implementation of ICommandParameterType

    /// <summary>
    ///     Gets the value for the occurance of this parameter type at the start of the commandText. The processed text will be
    ///     removed from the commandText.
    /// </summary>
    /// <param name="commandText">The command text.</param>
    /// <param name="output">The output.</param>
    /// <returns>true if parsed successfully; false otherwise.</returns>
    public bool Parse(ref string commandText, out object output)
    {
        output = null;
                
        // Can't parse without intput.
        if (string.IsNullOrWhiteSpace(commandText))
            return false;

        // Get the first word.
        var word = commandText.TrimStart().Split(' ').First();

        // Set the output (color) based on the input.
        switch (word.ToLower())
        {
            case "red":
                output = Color.Red;
                break;
            case "green":
                output = Color.Green;
                break;
            case "blue":
                output = Color.Blue;
                break;
        }

        // Remove the word from the input and trim the start.
        if (output != null)
        {
            commandText = commandText.Substring(word.Length).TrimStart();
            return true;
        }

        return false;
    }

    #endregion
}

class AnyClass
{
    [Command("repeat")]
    private static void RepeatCommand(BasePlayer sender, [Parameter(typeof(CustomType))]Color color)
    {
        // `/repeat red` prints `Hello!` in red.

        sender.SendClientMessage(color, "Hello!");
    }
}
```

Return Values
-------------
The command manager accepts two return types: `void` and `bool`. If the `void` return type is used the command manager assumes that the execution has successfully concluded. If a `bool` return type is used the command manager assume the same if `true` is returned. If `false` is returned, the default `SERVER: Unknown command` message is displayed.

``` c#
class AnyClass
{
    [Command("useless")]
    private static bool RepeatCommand(BasePlayer sender)
    {
        // Always prints `SERVER: Unknown command`
        return false;
    }
}
```

Grouping Commands
-----------------
In order to keep commands organized, you can group them. This is an optional feature and can be used if desired.

### Assign Group to Class
In order to assign a command group to a class, attach a `CommandGroup` attribute to the class.

``` c#
[CommandGroup("admin"))]
class AdminCommandsClass
{
    [Command("spawn")]
    private static void SpawnCommand(BasePlayer sender)
    {
        // Command: `admin spawn`
    }

    [Command("restart"))]
    private static void RestartCommand(BasePlayer sender)
    {
        // Command: `/admin restart`
    }
}
```

### Nesting
Command groups can also be nested or assigned synonyms.

``` c#
[CommandGroup("admin"))]
class AdminCommandsClass
{
    [CommandGroup("vehicle", "veh")]
    class AdminVehicleCommandsClass
    {
        [Command("spawn")]
        private static void SpawnCommand(BasePlayer sender)
        {
            // Command: `/admin vehicle spawn` or `/admin veh spawn`
        }

        [Command("delete"))]
        private static void DeleteCommand(BasePlayer sender, int vehicleid)
        {
            // Command: `/admin vehicle delete` or `/admin veh delete`
        }
    }
}
```

### Assign Group to Method
Command groups can be assigned to specific methods in various ways.

``` c#
class AnyClass
{
    [Command("alpha bravo")]
    private static void BravoACommand(BasePlayer sender)
    {
        // Command: `/alpha bravo`
    }

    [CommandGroup("alpha")]
    [Command("bravo")]
    private static void BravoBCommand(BasePlayer sender)
    {
        // Command: `/alpha bravo`
    }
}
```

Permissions
-----------
It is possible to indicate that a specific permission is required to execute a command. By default, there are two permission checkers: `AdminChecker` and `SilentAdminChecker`.

If a permission checker does not specify a 'permission denied'-message, the command manager will look for an alternative command. If a message has been specified, the message will be displayed when the player attempts to invoke the command with insufficient permissions.

Permission checks can also be manually written.

``` c#
public class RichPermissionChecker : IPermissionChecker
{
    #region Implementation of IPermissionChecker

    /// <summary>
    ///     Gets the message displayed when the player is denied permission.
    /// </summary>
    public string Message
    {
        get { return "You need at least $1000 to run this command."; }
    }

    /// <summary>
    ///     Checks the permission for the specified player.
    /// </summary>
    /// <param name="player">The player.</param>
    /// <returns>true if allowed; false if denied.</returns>
    public bool Check(BasePlayer player)
    {
        return player.Money > 1000;
    }
    #endregion
}

class AnyClass
{
    [Command("amirich", PermissionChecker = typeof(RichPermissionChecker))]
    private static void RichCommand(BasePlayer sender)
    {
        sender.SendClientMessage("You are rich!");
    }

    [Command("admin", PermissionChecker = typeof(SilentAdminChecker))]
    private static void AdminCommand(BasePlayer sender)
    {
        // If a player tries to invoke this command, but isn't an admin,
        // the command manager will look for a different overload of this command.
        sender.SendClientMessage("Admin stuff...");
    }
}
```

Permission checks can also be assigned to command group to indicate that all member of the group require a certain permission.

``` c#
[CommandGroup("admin", PermissionChecker = typeof(SilentAdminChecker))]
class AdminCommandsClass
{
    [Command("spawn")]
    private static void SpawnCommand(BasePlayer sender)
    {
        // Command: `admin spawn`
        // Spawn a car for this admin...
    }

    [Command("restart"))]
    private static void RestartCommand(BasePlayer sender)
    {
        // Command: `admin restart`
        // Restart the server...
    }
}
```

Default Values
--------------
You can make tailing parameters optional by specifying a default value.
``` c#
class AnyClass
{
    [Command("repeat")]
    private static void RepeatCommand(BasePlayer sender, string word, int times = 1)
    {
        // Command: `/repeat [word] <times>`. 
        // `/repeat hello` prints `hello` once. 
        // `/repeat hello 2` prints `hello` twice.

        for(var i = 0; i < times; i++)
            sender.SendClientMessage(word);
    }
}
```

Overloading Commands
--------------------
You can specify different overloads of a single command with different arguments. 

**Be aware!** If one overload ends, for example, with a string and the other with a number, eg. `/test [message]` and `/test [number]`, then a call with command text `/test 1337` might be handled by `/test [message]`!

``` c#
class AnyClass
{
    [Command("transfer")]
    private static void TransferCommand(BasePlayer sender, int amount)
    {
        sender.SendClientMessage("You entered amount: {0}", amount);
    }
    [Command("transfer")]
    private static void TransferCommand(BasePlayer sender, string word, amount)
    {
        sender.SendClientMessage("You entered amount: {0} and word: {1}", amount, word);
    }
}
```

Ignore Case
-----------
By default the case of a command is ignored. Both `/help` and `/HeLP` will be handled by a command marked `[Command("help")]`. If you do not want the case to be ignored, set IgnoreCase to false.

``` c#
class AnyClass
{
    [Command("HELP", IgnoreCase = false)]
    private static void HelpCommand(BasePlayer sender, int amount)
    {
        sender.SendClientMessage("YOU ENTERED HELP IN UPPER CASE");
    }
}
```

Usage Message
-------------
By default, the command manager automatically constructs a usage message if the user failed to enter a properly formatted command. You can override the default usage message by specifying the `UsageMessage` value in the `Command` attribute.

``` c#
class AnyClass
{
    [Command("help", UsageMessage = "Usage: /help [lots] [of] [arguments] [here(STRING)]")]
    private static void HelpCommand(BasePlayer sender, int lots, int of, int arguments, string here)
    {
        //
    }
}
```

Overriding Default Behavior
----------------------------
The command manager has a lots of pre-defined behaviors. You can change it's behavior by overriding the `CommandManager` and the `DefaultCommand`:

``` c#
public class MyCommandManager : CommandsManager
{
    public MyCommandManager(BaseMode gameMode) : base(gameMode)
    {
    }

    #region Overrides of CommandsManager

    protected override ICommand CreateCommand(CommandPath[] commandPaths, string displayName, bool ignoreCase,
        IPermissionChecker[] permissionCheckers, MethodInfo method, string usageMessage)
    {
        // Create an instance of your own command type.
        return new MyCommand(commandPaths, displayName, ignoreCase, permissionCheckers, method, usageMessage);
    }

    #endregion
}

public class MyCommand : DefaultCommand
{
    public MyCommand(CommandPath[] names, string displayName, bool ignoreCase,
        IPermissionChecker[] permissionCheckers, MethodInfo method, string usageMessage)
        : base(names, displayName, ignoreCase, permissionCheckers, method, usageMessage)
    {
    }

    #region Overrides of DefaultCommand

    protected override ICommandParameterType GetParameterType(ParameterInfo parameter, int index, int count)
    {
        // Override GetParameterType to use your own automatical detection of parameter types.
        // This way, you can avoid having to attach `ParameterType` attributes to all parameters of a custom type.

        // use default parameter type detection.
        var type = base.GetParameterType(parameter, index, count);
            
        if (type != null)
            return type;

        // if no parameter type was found check if it's of any type we recognize.
        if (parameter.ParameterType == typeof (bool))
        {
            // TODO: detected this type to be of type `bool`. 
            // TODO: Return an implementation of ICommandParameterType which processes booleans.
        }

        // Unrecognized type. Return null.
        return null;
    }
        
    protected override bool SendPermissionDeniedMessage(IPermissionChecker permissionChecker, BasePlayer player)
    {
        // Override SendPermissionDeniedMessage to send permission denied messages in the way you prefer.

        if (permissionChecker == null) throw new ArgumentNullException(nameof(permissionChecker));
        if (player == null) throw new ArgumentNullException(nameof(player));

        if (permissionChecker.Message == null)
            return false;

        // Send permission denied message in red instead of white.
        player.SendClientMessage(Color.Red, permissionChecker.Message);
        return true;
    }
        
    #endregion
}

[Controller]
public class MyCommandController : CommandController
{
    #region Overrides of CommandController

    public override void RegisterServices(BaseMode gameMode, GameModeServiceContainer serviceContainer)
    {
        // Register our own commands manager service instead of the default.
        CommandsManager = new MyCommandsManager(gameMode);
        serviceContainer.AddService(CommandsManager);

        // Register commands in game mode.
        CommandsManager.RegisterCommands(gameMode.GetType());
    }

    #endregion
}
```

Custom Command Class
--------------------
A command can manually be defined by creating a class which implements `ICommand`. The commands can be registered to the `CommandManager` using the `CommandManager.Register` method.

``` c#
class CustomCommand : ICommand
{
    #region Implementation of ICommand

    /// <summary>
    ///     Determines whether this instance can be invoked by the specified player.
    /// </summary>
    /// <param name="player">The player.</param>
    /// <param name="commandText">The command text.</param>
    /// <returns>A value indicating whether this instance can be invoked.</returns>
    public CommandCallableResponse CanInvoke(BasePlayer player, string commandText)
    {
        // If the player is an admin and the command text equals "/admin" allow the player to invoke this command.
        return player.IsAdmin && commandText == "/admin"
            ? CommandCallableResponse.True
            : CommandCallableResponse.False;
    }

    /// <summary>
    ///     Invokes this command.
    /// </summary>
    /// <param name="player">The player.</param>
    /// <param name="commandText">The command text.</param>
    /// <returns>true on success; false otherwise.</returns>
    public bool Invoke(BasePlayer player, string commandText)
    {
        // Send a friendly message to the caller.
        player.SendClientMessage("You are an admin!");
        return true;
    }

    #endregion
}

class GameMode : BaseMode
{
    protected override void OnInitialized(EventArgs args)
    {
        // Get the instance of the command manager.
        var commandManager = Services.GetService<ICommandsManager>();

        // Register an instance of CustomCommand to the command manager.
        commandManager.Register(new CustomCommand());
    }
}
```
