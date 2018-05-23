SampSharp was written by [Tim Potze] in order to
allow you to write game modes using C#. Although SampSharp also allows you to
write game modes using any other .NET language, such as Visual Basic and F#,
only C# is officially supported. The focus of SampSharp is to allow you to
write game modes fully in an [Object Oriented manner
][Object-Oriented Programming] without having to worry about SA-MP's native
identifiers. The use of C# also provides other benefits, such as better
performance and the availability of [thousands of NuGet packages][NuGet].

SampSharp runs in a separate process, which allows you to run your game mode on
any platform, using any runtime. The SampSharp plugin for the  SA-MP server
communicates with the SampSharp server (the process in which your game mode is
running) using SampSharp's own protocol. If you're interested in this protocol,
you can find its documentation of the [SampSharp protocol](sampsharp-protocol)
page.

SampSharp has mapped all SA-MP natives and callbacks into Object-Oriented
classes. This means you no longer need to bother about IDs of players or
vehicles. All callbacks are available as event within your game mode class and
the classes related to the event.

``` cs
void Example(GameMode gameMode, Player player)
{
    // Listen to PlayerText events for all players:
    gameMode.PlayerText += (sender, e) => {
        Console.WriteLine($"Player {sender} says: {e.Text}");
    };

    // Listen to PlayerText events for a specific player:
    player.Text += (sender, e) => {
        Console.WriteLine($"Player {player} says: {e.Text}");
    };
}
```

[Tim Potze]: https://github.com/ikkentim
[Object-Oriented Programming]: https://en.wikipedia.org/wiki/Object-oriented_programming
[NuGet]: https://www.nuget.org/
