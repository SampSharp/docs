- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installing the SampSharp Plugin](#installing-the-sampsharp-plugin)
- [Adding the Nuget repository](#adding-the-nuget-repository)
- [Creating a Game Mode Project](#creating-a-game-mode-project)
- [Starting and Stopping your Game Mode](#starting-and-stopping-your-game-mode)

Introduction
------------
This guide will get you started building and running your first SampSharp game
mode on Windows in development mode. For running your server in production mode
see [Running in Production](running-in-production).


Prerequisites
-------------
You'll need to download the following tools in order to start developing
SampSharp game modes:

- [Visual Studio 2019 or newer](https://visualstudio.microsoft.com/downloads/)
- [SampSharp Templates for Visual Studio][templates]
- [SA-MP server package](https://www.sa-mp.com/download.php) 
(extract it anywhere you like)



Installing the SampSharp Plugin
-------------------------------
Download the latest SampSharp package (`SampSharp-*.zip`) from the
[SampSharp releases page on GitHub](https://github.com/ikkentim/SampSharp/releases/tag/0.8.0) 
and copy the contents of the folder to your SA-MP server directory. Open the 
`server.cfg` file with your favourite text editor and replace the contents with
the following config. Don't forget to change the `rcon_password` to some other
memorable value.

```
echo Executing Server Config...
lanmode 0
rcon_password changeme
maxplayers 50
port 7777
hostname My First SampSharp Server
gamemode0 empty 1
announce 0
chatlogging 0
weburl www.sampsharp.net
onfoot_rate 40
incar_rate 40
weapon_rate 40
stream_distance 300.0
stream_rate 1000
maxnpc 0
logtimeformat [%H:%M:%S]
language English
plugins SampSharp
```

You should now be able to start your samp-server.exe. The end of the server
output should look as follows:

```
[SampSharp:INFO] Creating pipe \\.\pipe\SampSharp...
[SampSharp:INFO] Pipe created.
```

Creating a Game Mode Project
----------------------------
Using the [SampSharp Templates for Visual Studio][templates] it should be a
piece of cake to create your first SampSharp game mode.

- Open Visual Studio
- If you're seeing the welcoming screen, select "Create a new project",
otherwise select `File -> New -> Project...`
- Search for the "SampSharpGameMode" template and hit Next
- Give your project a nice name like "MyFirstGameMode" and click on Create
- You should now be able to hit Run and start your game mode
- 

Starting and Stopping your Game Mode
------------------------------------
While developing your game mode you can keep the game connected to the server
while you start and stop your game mode to make changes to it. Simply keep the
samp-server process running while you hit stop and start in Visual Studio.

SampSharp "attaches" your game mode to the samp-server by rotating to the next
game mode in the SA-MP server using the "gmx" RCON-command. This might take a
few moments after you started your game mode. SampSharp has implemented a
"fake gmx" (which doesn't actually rotates to the next game mode) in order to
speed this process up, tough it might have some unexpected side effects when
calling SA-MP functions which only work when the game mode is initializing.

In order to activate "fake gmx" edit the code in your Program class. By default
it should look as follows:

``` cs
public static void Main(string[] args)
{
	new GameModeBuilder()
		.Use<GameMode>()
		.Run();
}
```

By specifying FakeGmx as the default start behaviour you can enable "fake gmx":
``` cs
public static void Main(string[] args)
{
	new GameModeBuilder()
		.Use<GameMode>()
		.UseStartBehaviour(GameModeStartBehaviour.FakeGmx)
		.Run();
}
```

[templates]: https://marketplace.visualstudio.com/items?itemName=ikkentim.sampsharptempltes
