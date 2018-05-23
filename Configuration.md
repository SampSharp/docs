- [Introduction](#introduction)
- [Configuration](#configuration)
- [Intermission](#intermission)

Introduction
------------
The default plugin configurations should work for nearly everyone. In certain
situations you might want to change the SampSharp plugin and server communicate,
or what should happen when no SampSharp server has connected to the plugin.

Configuration
-------------
In order to modify the way the SA-MP server and SampSharp server communicate,
there are a few `server.cfg` options available. There are 3 different ways for 
the servers to communicate with each other: TCP connections, named pipes and
Unix domain sockets.

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

Intermission
------------
When the SampSharp server has not yet been started or when the SampSharp server
has stopped, the `intermission` filterscript will be loaded. If you do not want
this filterscript to be loaded add `intermission 0` to your `server.cfg`. For
more information about intermission scripts, see [Intermissions](Intermissions).