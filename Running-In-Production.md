Introduction
------------
In development mode, SampSharp runs in a separate process from the samp-server,
which allows you to stop and start the game mode as much as you want during
development. This does however hit server performance quite badly. Running
SampSharp in production mode is much better for your server performance. In
production mode SampSharp runs the game mode inside the samp-server process. In
order to run SampSharp in production mode you need to download the 32-bit (x86)
version of .NET Core.

Prerequisites
-------------
- [SA-MP server package](https://www.sa-mp.com/download.php) 
(extract it anywhere you like)

Prerequisites (Windows)
-----------------------
For Windows you can simply download a 32-bit (x86) edition of a recent version
of .NET Core Runtime. Make sure to download the .NET Core Runtime binaries, you
do not need to download the installer! You can download it from
[the .NET Core download page](https://dotnet.microsoft.com/download/dotnet-core).

Prerequisites (Linux)
---------------------
Microsoft has not yet officially released 32-bit binaries of .NET Core for
Linux. A pre-build a version of the 32-bit .NET Core Run for Linux which can 
[be downloaded from this website](https://deploy.timpotze.nl/packages/dotnet20200127.zip).

[Talk about releasing an official buid is ongoing on GitHub](https://github.com/dotnet/coreclr/issues/9265)

Installing the SampSharp Plugin
-------------------------------
Download the latest SampSharp package (`SampSharp-*.zip`) from the
[SampSharp releases page on GitHub](https://github.com/ikkentim/SampSharp/releases/tag/0.8.0) 
and copy the contents of the folder to your SA-MP server directory. Update the
`server.cfg` file to include the SampSharp plugin. See
[Getting Started](getting-started) for an example configuration file.

Configuring SampSharp
---------------------
Extract the .NET Core Runtime binaries into a `dotnet` folder in your
samp-server directory. Create a `gamemode` folder in your server directory where
you can store the binaries of your compiled game mode. Add the following values
to your `server.cfg` file:

```
coreclr dotnet/shared/Microsoft.NETCore.App/2.2.6
gamemode gamemode/MyGameMode.dll
```

Please note the version number in the `coreclr` path may differ depending on the
version of the .NET Core Runtime you have downloaded. Also please make sure the
`gamemode` path matches the path to your game mode.

After adding your game mode binaries to the `gamemode` folder you should be able
to run the samp-server.

Publishing your Game Mode
-------------------------
In order to compile and gather all required files for your game mode you can use
the publish function of dotnet. In Visual Studio, open your project and select
`Build -> Publish MyGameMode`. Select the `gamemode` folder from your server (or
some other folder) and hit Publish.
