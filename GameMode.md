- [Introduction](#introduction)
- [Initialization](#initialization)

Introduction
------------
Your game mode class is your main SampSharp class. Every SA-MP callback is
turned into a C# event by SampSharp and can be found within your game mode
class. Functions which are normally run from within your `OnGameModeInit`
callback in Pawn, can be found as methods within the game mode class. You can
create a game mode class by creating a class which inherrits from `BaseMode`. In
general, you should only have one class which inherrits from `BaseMode`.

Initialization
--------------
The initialization of your game mode should generally be handled from within the
`Initialized` event. The easiest way to add behaviour to this
event is by overriding the event invocator, `OnInitialized`.

``` cs
public class GameMode : BaseMode
{
    protected override void OnInitialized(EvenArgs e)
    {
        // Call the base implementation of this method. The base implementation handles calling the Initialized event.
        base.OnInitialized(e);

        // Handle your game mode initialization here.
        SetGameModeText("My game mode");
        UsePlayerPedAnimations();
        // ...

    }
}
```

