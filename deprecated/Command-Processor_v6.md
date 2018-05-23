- [Defining and Detecting Parameter Types](#defining-and-detecting-parameter-types)
- [Methods](#methods)
- [Permission Check](#permission-check)
- [Command Groups](#command-groups)
- [Ignore Case](#ignore-case)
- [Return Types](#return-types)
- [Inheriting the Command Class](#inheriting-the-command-class)
- [Custom Parameter Attributes](#custom-parameter-attributes)
- [Default Values](#default-values)
- [Usage Message](#usage-message)

> NOTE: This page is for version v0.6.X, for version v0.7+, see [Player Commands](player-commands).

Defining and Detecting Parameter Types
--------------------------------------

By default SampSharp looks at the parameters of the method to determine the parameters of the command. The parameter types it can automatically detect are: `int`, `float`, `string`, `GtaPlayer` or any subclass of `GtaPlayer` and any enumerator(e.g. `VehicleModelType`).

Notice that by default SampSharp thinks that you want a single word as argument when a method accepts a `string`:
``` c#
[Command("tell")] 
public static void TellCommand(Player sender, Player receiver, string message) 
{ 
    //.. 
}
```
In this example players can only send a single world to players using the `/tell [receiver] [message]` command.

If you want the string parameter to accept text instead of a single word, you need to mark it as a text parameter:
``` c#
[Command("tell")] 
[Text("message")] 
public static void TellCommand(Player sender, Player receiver, string message) 
{ 
    //.. 
}  
```
It might be good to know that what actually happens when a command is loaded, is that it calls the following delegate for every parameter that does not yet have an attribute associated with it:

``` c#
public class DetectedCommand : Command 
{ 
    //... 
    public static Func<Type, string, ParameterAttribute> ResolveParameterType { get; set; } 
    //... 

    // default value: 
    ResolveParameterType = (type, name) => 
            { 
                if (type == typeof (int)) return new IntegerAttribute(name); 
                if (type == typeof (string)) return new WordAttribute(name); 
                if (type == typeof (float)) return new FloatAttribute(name); 
                if (typeof (GtaPlayer).IsAssignableFrom(type)) return new PlayerAttribute(name); 

                return type.IsEnum ? new EnumAttribute(name, type) : null; 
            }; 
}
```

So when it has resolved every parameter of the tell command, the method internally looks like this:

``` c#
[Command("tell")] 
[Player("receiver")] 
[Text("message")] 
public static void TellCommand(Player sender, Player receiver, string message) 
{ 
    //.. 
}
```

Methods
-------
There are two places where you can define you commands: a static method anywhere in your code, or in your player class. I haven't checked this but AFAIK the command method must be public!

### Player class
If you have a Player class which is a sub class of GtaPlayer, you can put the commands straight in there:
``` c#
class Player : GtaPlayer 
{ 
  //... 
  [Command("help")] 
  public void HelpCommand() 
  { 
    //... 
  } 
  //... 
}  
```
Notice the method is not static and should not accept a `Player sender` parameter as first argument. If you put a Player argument in there ( HelpCommand(Player x) ) SampSharp will think it's an parameter of the command.

### A Static Method
Can be placed in any public class. Accepts a Player as first parameter which is the sender
``` c#
public class AnyClass 
{ 
  [Command("help")] 
  public static void HelpCommand(Player sender) 
  { 
    //... 
  } 
}
``` 

Permission Check
---
If you create admin commands, you obviously do not want any odd player to be able to use the command.

In the Command attribute you can specify various properties, including the "PermissionCheckMethod".

``` c#
public class AnyClass 
{ 
  public static bool IsAdmin(Player player) 
  { 
      return player.AdminLevel > 0; 
  } 

  [Command("adminhelp", PermissionCheckMethod="IsAdmin")] 
  public static void AdminHelpCommand(Player sender) 
  { 
    //... 
  } 
} 

// or 

class Player : GtaPlayer 
{ 
  // ... 
  public bool IsAdmin() 
  { 
      return AdminLevel > 0; 
  } 

  [Command("adminhelp", PermissionCheckMethod="IsAdmin")] 
  public void AdminHelpCommand() 
  { 
    //... 
  } 
  // ... 
} 
```
 
Notice that in the Player class, the specified permission check method is not static, and accepts no parameters.

If you return false in the permission check method, SampSharp will not call the command. If you return true, it will.

Command Groups
---
If you don't want to use command groups, skip this chapter
You can group commands together. If you, for example, want to use the following commands structure, this can be helpful for you:

```
/help
/player menu -or- /p menu -or- /menu
/player status -or- /p status
/admin player kick [player] -or- /admin p kick [player] -or- /a player kick [player] -or- /a p kick [player] -or- /kick [player]
/admin player ban [player] -or- /admin p ban [player] -or- /a player ban [player] -or- /a p ban [player]
/admin serverstatus -or- /a serverstatus
/admin restartserver -or- /a restartserver
```
You can register groups using the following function:
``` c#
CommandGroup.Register(string name, string alias = null, CommandGroup parent = null);  
```
As you can see you can also nest command groups inside other command groups.

You can implement all commands listed above like this:
(I'm not checking for permissions here, just showing how command groups work)

``` c#
//Somewhere near you initialization code... 
CommandGroup.Register("player", "p"); 
var admin = CommandGroup.Register("admin", "a"); 
CommandGroup.Register("player", "p", admin); 

// In some class... 
[Command("help")] 
public static void Help(Player s) {} 

[Command("menu", Shortcut="menu")] 
[CommandGroup("player")] // specify the group this command is in 
public static void PlayerMenu(Player s) {} 

[Command("status")] 
[CommandGroup("player")] 
public static void PlayerStatus(Player s) {} 

[Command("kick", Shortcut="kick")] 
[CommandGroup("admin", "player")] 
public static void AdminPlayerKick(Player s, Player kickee) {} 

[Command("ban")] 
[CommandGroup("admin", "player")] 
public static void AdminPlayerBan(Player s, Player banee) {} 

[Command("serverstatus")] 
[CommandGroup("admin")] 
public static void AdminServerstatus(Player s) {} 

[Command("restartserver")] 
[CommandGroup("admin")] 
public static void AdminRestartserver(Player s) {}  
```

In the example above, I've given all command groups aliases and given the menu and kick commands a shortcut.
It is also possible to give a command an alias:

``` c#
[Command("kick", Alias="kick")]  
```
If you decide not to use command groups, there is no difference between aliases and shortcuts.
If you do use command groups, there is. For example, you have The following command:

``` c#
[Command("b", Alias="c", Shortcut="d")] 
[CommandGroup("a", "e")] 
public static void abc(Player x){}  
```
You can call this command using any of following commands:
```
/a b
/a c
/e b
/e c
/d
```

As you can see, if you decide to call the command using the shortcut, you do not need to type in the command group. If you decide to call the command using the alias, you still need to enter the command group(or an alias of the command group)


Ignore Case
---
By default, SampSharp ignores the case of commands both /help and /HeLP will call a command tagged with [Command("help")]. However, if you do not wish this to happen you can disable this:

``` c#
// the /CAPSLOCK command 
[Command("CAPSLOCK", IgnoreCase=false)] 
public static void something(Player s) {} 
``` 

Return types
---
You can also make a command return a boolean. If it returns true, SampSharp will assume the command has successfully been executed. If it returns false, SampSharp will assume the command has not been executed and will show the "unknown command" message to the player.

Example:
``` c#
[Command("something")] 
public static bool something(Player s) 
{ 
    if(!s.CanDoSomething) return false; 

    s.SendClientMessage("You did something!"); 
    return true; 
} 
``` 
It's basically the same as the PermissionCheckMethod property in the Command attribute, but then you can check for permission within the command method itself.

Inheriting the Command class
---
If you do not want to use all the attributes and things explained above, you can also inherit from the Command class:
https://github.com/ikkentim/SampShar...nds/Command.cs

I'm not going to show an example of how to do this, because the system explained above is much easier, flexible and useful.

But if you decide to create a sub class of Command, you need to create an instance of it once to allow SampSharp to find it:
``` c#
//Somewhere near you initialization code... 
new MyAwesomeCommand();  
```
Custom Parameter Attributes
---
Lets say you have a `Street` class
``` c#
class Street 
{ 
  public string Name { get; private set;} 
  //Lots more info... 
}  
```
and you want to allow players to type /goto [streetname]

you can create a custom attribute:

``` c#
    public class StreetAttribute : WordAttribute 
    { 
        public StreetAttribute(string name) 
            : base(name) 
        { 
        } 

        public override bool Check(ref string command, out object output) 
        { 
            // Let the WordAttribute process the command first 
            if (!base.Check(ref command, out output)) 
                return false; 

            string word = (output as string).ToLower(); 

            Street result = null; 
            // TODO: find a street that matches the name stored in the word variable and store it in result 
            // If no street could be found, return false. 

            output = result; 
            return true; 
        } 
    }  
```
Now you can create the following command:
``` c#
[Command("goto")] 
[Street("street")] 
public static void goto(Player sender, Street street) 
{ 
}  
```
Notice you need to specify that 'street' is a Street using `[Street("street")]`

If you want SampSharp to automatically detect this, you need to add it to the parameter resolve delegate:

``` c#
//Somewhere near you initialization code... 

DetectedCommand.ResolveParameterType = (type, name) =>  
            { 
                if (type == typeof (Street)) return new StreetAttribute(name); 

                // I haven't tested this, but AFAIK it should not recursively call this delegate, but call the previous (default) delegate. 
                return DetectedCommand.ResolveParameterType(type, name); 
            };  
```
Now you can use:
``` c#
[Command("goto")] 
public static void goto(Player sender, Street street) 
{ 
}  
```

Default values
---
If you want a parameter to have a default value, it needs to be at the end of the command:
``` c#
[Command("tell")] 
[Text("message")] 
public static void tell(Player sender, Player receiver, int times = 1, string message = "I like trains!") 
{ 
}  
```
If you now type /tell. It will send the following message:
```
Usage: /tell [receiver] (times) (message)
```
Notice the ( ) brackets instead of [ ]. This indicates that these parameters are optional.

Usage Message
---
If you enter invalid parameters you will be shown a "Usage" message. By default this message looks like this:
```
Usage: /tell [receiver] (times) (message)
```
It is generated using the following delegate:
``` c#
public class DetectedCommand : Command 
{ 
    //... 
    public static Func<string, ParameterAttribute[], string> UsageFormat { get; set; } 
    //... 

    // default value: 
    UsageFormat = (name, parameters) => 
                string.Format("Usage: /{0}{1}{2}", name, parameters.Any() ? ": " : string.Empty, 
                    string.Join(" ", parameters.Select( 
                        p => p.Optional 
                            ? string.Format("({0})", p.DisplayName) 
                            : string.Format("[{0}]", p.DisplayName) 
                        )) 
                    ); 
}  
```
You can change it by setting the delegate:
``` c#
//Somewhere near you initialization code... 
DetectedCommand.UsageFormat = (name, parameters) => 
{ 
    return "some usage message"; 
}
```
