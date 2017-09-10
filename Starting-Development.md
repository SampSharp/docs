- [Introduction](#introduction)
- [Creating a Project](#creating-a-project)
- [Referencing the Framework](#referencing-the-framework)
- [Creating a GameMode class](#creating-a-gamemode-class)
- [Starting the Game Mode](#starting-the-game-mode)

Introduction
------------
This page will focus on setting up your first game mode and giving you some
direction on where to go from there. Before continuing, please make sure you've
set up your server as described on the [Getting Started](getting-started) page.

Creating a Project
------------------
TODO: Create the .NET Core console app.

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
TODO: Create a GameModeBuilder, configure it and run it. Refer to
[GameMode Builder](gamemode-builder) for details. 