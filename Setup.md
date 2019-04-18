- [Introduction](#introduction)
- [SA-MP Server](#sa-mp-server)
- [SampSharp Plugin](#sampsharp-plugin)
- [Visual Studio and .NET Core](#visual-studio-and-net-core)
- [NuGet Repository](#nuget-repository)

Introduction
------------
In order to get started with SampSharp, you'll need to install a few things: 

- A SA-MP server
- The SampSharp plugin for the SA-MP server
- Visual Studio and .NET Core
- Add the NuGet Repository to Visual Studio

SA-MP Server
------------
The SA-MP Server package can be downloaded from the 
[SA-MP website](http://sa-mp.com). Once unzipped, open the `server.cfg` file
with a text editor.

- Add `plugins SampSharp` to the file
- Change the `rcon_password` to a secure long password
- Change `gamemode0` to `empty 1`
- Remove the `filterscripts` value

As of SampSharp 0.8:
- Add a `coreclr` value which points to the dotnet runtime path.
- Add a `gamemode` value which points to your gamemode dll path. (see ["Publishing the project"](starting-development#publishing-the-project))

```
echo Executing Server Config...
lanmode 0
rcon_password mysecurepassword
maxplayers 50
port 7777
hostname SA-MP 0.3 Server
gamemode0 empty 1
gamemode path/to/your/Gamemode.dll
coreclr path/to/downloaded/dotnet-runtime/
announce 0
chatlogging 0
weburl www.sa-mp.com
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

Dotnet runtime
----------------
The dotnet runtime package can be downloaded from the [Microsoft website for windows](https://www.microsoft.com/net/download/thank-you/dotnet-runtime-2.1.1-windows-x86-binaries) or in case of linux there's a unofficial runtime located [here](https://deploy.timpotze.nl/packages/dotnet20180628.zip) ([refs issue #25](https://github.com/SampSharp/docs/issues/25)).

For Windows the value in the server config should look something like:
```
corclr path/to/downloaded/dotnet-runtime-2.1.1-win-x86/shared/Microsoft.NETCore.App/2.1.1
```

for the unofficial linux dotnet runtime:

```
coreclr path/to/downloaded/dotnet-runtime/
```

SampSharp Plugin
----------------
The plugin can be downloaded from [the releases page][releases] on GitHub. Copy
the contents of the folder in the ZIP file to your SA-MP server directory.

Visual Studio and .NET Core
---------------------------
Download and install Visual Studio from [the Visual Studio website](https://www.visualstudio.com/downloads/). The Community Edition can be
downloaded for free. During the setup process make sure to mark the ".NET Core 
cross-platform development" workload for installation.

NuGet Repository
----------------
SampSharp hosts it own [NuGet package repository][NuGet repository] which
contains the framework and various other SampSharp related packages. In order to
uses these packages, you have to add the repository to your package manager.

1. In Visual Studio's toolbar click on `Tools > Options...`
1. In the left menu, select `NuGet Package Manager > Package Sources`
1. Click on the big +(plus) icon in the upper right corner of the window.
1. In the Name field type `SampSharp`. 
1. In the Source field type `http://nuget.timpotze.nl/api/v2/`.
1. Click on OK.

![Packages Sources window in Visual Studio](http://deploy.timpotze.nl/sstatic/pack-man.jpeg)

[releases]: https://github.com/ikkentim/SampSharp/releases
[samp-server]: http://sa-mp.com/download.php
[NuGet repository]: http://nuget.timpotze.nl