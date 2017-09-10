TODO.
=======
- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installing the Plugin](#installing-the-plugin)
- [Configuration](#configuration)
- [NuGet Repository](#nuget-repository)

Introduction
------------
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

Requirements
------------
- **Basic C# knowledge**: In order to use SampSharp you will at least need to
  know the basics of C#.
- **Visual Studio and .NET Core**: SampSharp can run on either .NET Core, .Net
  Framework or Mono. The documentation on this website will assume you are
  using Visual Studio along with .NET Core, but you should also be able to use
  other SampSharp with other IDEs and runtimes.  .NET Core can be installed
  using the Visual Studio installer.
- **SA-MP server**: The SA-MP server which can be downloaded from [SA-MP's
  download page](samp-server). The server does not have to be located anywhere
  near your game mode project. You must at least change the RCON password in
  the `server.cfg` file.
- **The SampSharp plugin**: The plugin can be installed using [the installation
  instructions](#installing-the-plugin) which can be found below.

Installing the Plugin
---------------------
### Windows
The plugin can be downloaded from [the releases page][releases] on GitHub.
Place the `SampSharp.dll` file inside of the `plugins` folder of your SA-MP
server directory. If the `plugins` directory does not yet exist, you should
create it. In your `server.cfg`, you need to append `SampSharp` to the
`plugins` value. If the `plugin` does not yet exist, you should add it:

```
# if SampSharp is the only plugin you use:
plugins SampSharp

# or if you've already installed other plugins you should, for example, use:
plugins streamer SampSharp
```

### Linux
The plugin can be downloaded from [the releases page][releases] on GitHub.
Place the `libSampSharp.so` file inside of the `plugins` folder of your SA-MP
server directory. If the `plugins` directory does not yet exist, you should
create it. In your `server.cfg`, you need to append `libSampSharp.so` to the
`plugins` value. If the `plugin` does not yet exist, you should add it:

```
# if SampSharp is the only plugin you use:
plugins libSampSharp.so

# or if you've already installed other plugins you should, for example, use:
plugins streamer libSampSharp.so
```

Configuration
-------------
In order to modify the way the SA-MP server and SampSharp server communicate,
there are a few `server.cfg` options available. **Please note the default
configuration should work just fine**. There are 3 different ways for the
servers to communicate with each other: TCP connections, named pipes and Unix
domain sockets.

The configuration values listed below only sets the behaviour of the SA-MP 
server. In order to set the way the SampSharp server will try to connect to the
SA-MP server, please check the [GameMode Builder options](gamemode-builder). 

### TCP Connection
Using a TCP connection could be useful when you want to debug your game mode on
Windows while you need to have your SA-MP server running on Linux. Please be
aware that you should **not** use a TCP connection on a production server,
because it has a fairly big overhead, which causes a slower connection than the
alternative options. Please also note that while the TCP communication client is
available on both Windows and Linux, the TCP communication server in the SA-MP
server plugin is only available on Linux.

In order to use a TCP connection, you will have to add `com_type tcp` to your
`server.cfg`. There are 2 additional options available:

- **`com_ip`** *(default: `127.0.0.1`)*: The IP from which the server should
allow incoming connections.
- **`com_port`** *(default: `8888`)*: The port on which the server should allow
incoming connections.

### Named Pipes
Named pipes are the preferred and default way of communication between the
servers on Windows. If you add `com_type pipe` to your `server.cfg` or don't
specify a `com_type` at all, you will be using named pipes. Communication trough
named pipes is only available on Windows, because Linux does not support
bidirectional named pipes. Trough the `com_pipe` option you can set the name of
the pipe the servers should be using for their communication. If you have
multiple servers running on your machine, be sure to make each pair of
SA-MP/SampSharp servers use their own named socket. The default `com_pipe` value
is `SampSharp`.

### Unix Domain Sockets
Like the name suggests, Unix domain sockets are only available on Linux. This
manner of communication is the preferred and default on Linux. If you add 
`com_type dsock` to your `server.cfg` or don't specify a `com_type` at all, you
will be using Unix domain sockets. Trough the `com_dsock` option you can set the
path to the domain socket the servers should be using for their communication.
If you have multiple servers running on your machine, be sure to make each pair
of SA-MP/SampSHarp servers use their own domain socket. The `com_dsock` value is
`/tmp/SampSharp`.

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


[Tim Potze]: https://github.com/ikkentim
[Object-Oriented Programming]: https://en.wikipedia.org/wiki/Object-oriented_programming
[NuGet]: https://www.nuget.org/
[releases]: https://github.com/ikkentim/SampSharp/releases
[samp-server]: http://sa-mp.com/download.php
[NuGet repository]: http://nuget.timpotze.nl

[img packman]: http://deploy.timpotze.nl/sstatic/pack-man.jpeg
