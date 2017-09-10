- [Introduction](#introduction)
- [Folder Structure](#folder-structure)
- [Referencing the Framework](#referencing-the-framework)
- [Project Debug Settings](#project-debug-settings)
- [Defining the Entry Point](#defining-the-entry-point)

Introduction
------------
This chapter contains a few tips and tricks for setting up your development environment. We assume you are running windows, you have already installed [Visual Studio](https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx), the [NuGet package repository](package-manager), [the SA-MP server, Mono and SampSharp](installation).

Folder Structure
----------------
To keep everything organised, it's useful to have a good folder structure. We will shortly discuss a simple but effective way to keep your server directory from cluttering.

Create a folder(e.g. `YourGamemode`) and create two folders `env` (testing environment) and `src` (source code) inside it. Copy your server files into the `env` folder. Using Visual Studio, create a new solution inside the `src` folder:

1. Inside Visual Studio click on `File > New > Project`... .
1. In the tree on the left select `Templates > Visual C#`. Then select `Class Library` in the middle column.
1. Name your project and uncheck `Create directory for solution`.
1. Click on `Browse...` and select the `src` folder inside your development folder.
1. Click on `OK`

Your folder structure should start looking like this:
```
YourGamemode/
    env/
        plugins/
            SampSharp.dll
            ...
        mono/
            ...
        filterscripts/
            empty.amx
            ...
        gamemodes/
            empty.amx
            ...
        gamemode/ (We'll make this folder in a later steps)
            SampSharp.GameMode.dll
            YourGamemode.dll
            YourGamemode.dll.mdb
        samp-server.exe
        ...
    src/
        YourGamemode/
            YourGamemode.csproj
            GameMode.cs
            ...
        YourGamemode.sln
```

Referencing the Framework
-------------------------
To be able to interact with the server, you need to add the framework to your project's references.

1. Open your project using Visual Studio.
1. In the Solution explorer, right click on References under your project.
1. Click on `Manage NuGet Packages...`.
1. Under `Online` select the SampSharp repository.
1. Click on `Framework for SA-MP#` and click on Install.

Project Debug Settings
----------------------
To be able to let the `Start Debugging (F5)` button start the server, you need to configure your project.

1. Open your project using Visual Studio.
1. In the Solution explorer, right click on your project.
1. Click on `Properties`.
1. In the properties menu on the left, select `Build`.
1. Under `Output` set `Output path` to `..\..\env\gamemode\`.
1. In the properties menu on the left, select `Debug`.
1. Under `Start action` select and set `Start external program` to the path to your `samp-server.exe` using the browse(`...`) button.
1. Under `Start Options` set `Working directory` to `..`.

Defining the Entry Point
------------------------
You can now create the entry point of your gamemode.
In you project, create a class named `GameMode` and let it inherit from `BaseMode`.
Next, you need to configure this entry point in your server.cfg. See the [Configuration](configuration) page for details.

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