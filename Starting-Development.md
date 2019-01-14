- [Introduction](#introduction)
- [Creating a Project](#creating-a-project)
- [Referencing the Framework](#referencing-the-framework)
- [Creating a GameMode class](#creating-a-gamemode-class)
- [Starting the Game Mode](#starting-the-game-mode)

Introduction
------------
This page will focus on setting up your first game mode and giving you some
direction on where to go from there. Before continuing, please make sure you've
set up your server as described on the [Setup](setup) page.

Creating a Project
------------------
1. Click on `File > New > Project` (Shortcut: `Ctrl + Shift + N`).
1. Select `Visual C#` from the list on the left.
1. Select `.NET Core` from the expanded sub-list and choose `Console App (.NET Core)` from the list in the center.
1. Type the name and Location of your new Solution.
1. Click `OK` to save.

Referencing the Framework
-------------------------
To be able to interact with the server, you need to add the framework to your
project's references.

1. In the Solution explorer, right click on References under your project.
1. Click on `Manage NuGet Packages...`.
1. Under `Online` select the SampSharp repository.
1. Click on `Framework for SA-MP#` and click on Install.

Defining the Entry Point
------------------------
You can now create the entry point of your gamemode.
In you project, create a class named `GameMode` and let it inherit from
`BaseMode`.

Here is a simple GameMode class:

``` C#
using SampSharp.GameMode; // Contains BaseMode class
using SampSharp.GameMode.Controllers; // Contains ControllerCollection class

public class GameMode : BaseMode
{
    #region Overrides of BaseMode

    protected override void OnInitialized(EventArgs e)
    {
        Console.WriteLine("\n----------------------------------");
        Console.WriteLine(" Blank Gamemode by your name here");
        Console.WriteLine("----------------------------------\n");

        /*
         * TODO: Do your initialisation and loading of data here.
         */
        base.OnInitialized(e);
    }

    protected override void LoadControllers(ControllerCollection controllers)
    {
        base.LoadControllers(controllers);

        /*
         * TODO: Load or unload controllers here.
         */
    }

    #endregion
}
```

Starting the Game Mode
----------------------
In the newly created project, you will have a class named `Program`. In that class, in the `Main` method, you will have to create a `GameModeBuilder`, which will run your gamemode (Refer to [GameMode Builder](gamemode-builder) for details on what a GameMode Builder is, how it works and different configuration options).

A sample of a standard `Main` class:
``` C#
private static void Main(string[] args)
{
    new GameModeBuilder()
        .Use<GameMode>()
        .Run();
}
```
