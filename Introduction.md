SampSharp is a framework for writing game modes for SA-MP using C# using the .NET (core) runtime. This means you can make use of everything [.NET](https://dot.net) has to offer, including [thousands of NuGet packages](https://nuget.org).

SampSharp consists of a few parts:
- A plugin which hosts the .NET Runtime and provides the an API interface which SampSharp's .NET libraries consumes
- SampSharp.Core: A .NET library which provides a clean .NET API for using SA-MP native functions and hooking into SA-MP callbacks 
- Two variants of frameworks for writing a game mode with .NET: SampSharp.GameMode and SampSharp.Entities

See [Getting Started](getting-started) for information about how to start developing your first SampSharp game mode.

## Frameworks
SampSharp provides two frameworks for developing game modes. Though you can make any game mode you want with either framework, they differ vastly and how you structure you code and how you will interact with the different entities within SA-MP.

### SampSharp.GameMode
SampSharp.GameMode is the most mature framework we provide. This framework is the easiest to get started with for beginners. It provides classes and types for every entity or resource SA-MP has to offer. For every entity created in SA-MP an instance is created of the related object-oriented type. For example, when a player connects to the server, an instance of `Player` is created. If you want to send a message to that player, you can simple call `player.SendClientMessage("Your message here");`.

On GitHub you can find [a port of the Grandlarc game mode using SampSharp.GameMode](https://github.com/SampSharp/sample-gm-grandlarc/tree/main/src/Grandlarc).

``` cs
public class GameMode : BaseMode
{
    protected override void OnInitialized(EventArgs e)
    {
        Console.WriteLine(" Blank game mode by your name here");
        SetGameModeText("Blank game mode");
        
        base.OnInitialized(e);
    }
    
    [Command("hello")]
    public static void HelloCommand(Player player)
    {
        player.SendClientMessage($"Hello, {player.Name}!");
    }
}

[PooledType]
public class Player : BasePlayer
{
    // you can add your own properties and methods here.
}
```

### SampSharp.Entities
SampSharp.Entities is a relatively new framework. It provides an ["entity component system"-pattern](https://en.wikipedia.org/wiki/Entity_component_system) for writing SA-MP gamemodes. Every entity (player, vehicle, object, textdraw, etc.) created in SA-MP will create an entity with one or more components to define the behavior of the entity. For example, a player entity will have a `Player` component. You will be able to add or remove different components to/from the player to indicate the behaviour of the player. For example, you can apply a custom `Citizen` component to specify the respawning behaviour of the player.

Within systems you can capture various events from SA-MP, capture your own events or handle player commands. SampSharp.Entities provides dependency injection for all event and command handlers, as can be seen in the example below.

On GitHub you can find [a port of the Grandlarc game mode using SampSharp.Entities](https://github.com/SampSharp/sample-ecs-grandlarc/tree/main/src/Grandlarc).

```cs
public class MyFirstSystem : ISystem
{
    [Event]
    public void OnGameModeInit(IServerService serverService)
    {
        Console.WriteLine(" Blank game mode by your name here");
        serverService.AddPlayerClass(8, new Vector3(0, 0, 7), 0);
        serverService.SetGameModeText("Blank game mode");
    }

    [PlayerCommand("hello")]
    public void HelloCommand(Player player)
    {
        player.SendClientMessage($"Hello, {player.Name}!");
    }
}
```