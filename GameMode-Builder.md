- [Introduction](#introduction)
- [Game Mode Instance](#game-mode-instance)
- [Start Behaviour](#start-behaviour)
- [Exit Behaviour](#exit-behaviour)
- [Communication Client](#communication-client)
- [Redirect Console Output](#redirect-console-output)
- [SampSharp Logging](#sampsharp-logging)
- [Encoding](#encoding)

Introduction
------------
The `GameModeBuilder` class is a utility to set up and configure your game mode
instance, set up the communication with the SA-MP server and to configure some
additional options. The builder should generally be created and run within the
entry-point of your application, which by default is located within the
`Program` class of you console application. Your entry point should look roughly
like this if you use the default SampSharp configuration:

``` cs
new GameModeBuilder()
    .Use<GameMode>()
    .Run();
```

Each method (except for `Run`) returns the updated game mode builder, which
allows you to chain configuration methods. For example, if you wish to set a
specific start behaviour, you can simply add `UseStartBehaviour` to the method
chain:

``` cs
new GameModeBuilder()
    .Use<GameMode>()
    .UseStartBehaviour(ModeStartBehaviour.FakeGmx)
    .Run();
```
Game Mode Instance
------------------
In order for your game mode to properly function, you need to indicate which
class provides the game mode functionality; a class which implements
`IGameModeProvider`. The `BaseMode` class in the `SampSharp.GameMode` library
implements this interface. Generally you'll want to create a class which
inherits from `BaseMode` and use this class as the game mode provider. By using
the `Use` method you can specify the game mode provider:

``` cs
.Use<MyGameMode>()

// or if you wish to specify the constructor manually:

.Use(new MyGameMode())
```

Start Behaviour
---------------
In SA-MP, certain actions are only available during OnGameModeInit, such as
adding static vehicles, disabling interiors or setting the player animation
type. Therefore, SampSharp needs to be attached to the SA-MP server before the
`OnGameModeInit` callback is called. SampSharp provides 3 different startup
behaviours. You can change the startup behaviour using
`.UseStartBehaviour(GameModeStartBehaviour.FakeGmx)` with your desired startup
behaviour.


### GameModeStartBehaviour.Gmx
A GMX (game mode exchange) RCON command is automatically send to the SA-MP
server, allowing SampSharp to attach before the next `OnGameModeInit` call.
This is the default start behaviour and should be used for servers running in
production. Please note that a GMX takes several seconds.
 
### GameModeStartBehaviour.FakeGmx
A fake GMX is particularly useful while you are developing your game mode.
SampSharp will not send an actual GMX RCON command to the SA-MP server, but will
pretend a `OnGameModeInit` call has been received from the server. After it has
processed this call, it will also call `OnPlayerConnect` for each player already
connected to the server. Using the fake GMX startup behaviour can save you
valuable time during development, because you don't need to restart your game
client every time you restart your server. Please note you should not use the
fake GMX startup behaviour on a production server because you will not be able
to run functions which only work during OnGameModeInit.

### GameModeStartBehaviour.None
This startup behaviour will not cause OnGameModeInit to be called at all. It is
inadvisable to use this behaviour.

Exit Behaviour
--------------
When the `OnGameModeExit` callback has been received, your game mode will be
cleaned up and unloaded. You can however specify what you wish to happen next.
By enabling the restart behaviour using
`.UseExitBehaviour(GameModeExitBehaviour.restart)`, your game mode will be
restarted after it has ended. By default the shut down behaviour is enabled
(`GameModeExitBehaviour.ShutDown`). The shut down behaviour will cause
`GameModeBuilder`'s `Run` (see [Introduction](#introduction)) method to return,
which allows the application to close down.

Communication Client
-------------------
As described in [Getting Started](getting-started#configuration), there are
various ways in which the SA-MP server and the SampSharp server can communicate.
If you've changed the communication config of the SA-MP server plugin in your
`server.cfg` file, you'll also need to set the same settings here. If you are
using the default configuration, you do not need to manually specify the
communication client. The following methods are available:

``` cs
// If you're using a TCP connection
.UseTcpClient(string ipAddress, int portNumber)

// If you're using a TCP connection to connect to your local machine
.UseTcpClient(int portNumber)

// If you're using a named pipe
.UsePipe(string pipeName)

// If you're using a unix domain socket
.UseUnixDomainSocket(string pathToSocket)

// If you've implemented a custom communication client (advanced)
.UseCommunicationClient(ICommunicationClient client)
```

Redirect Console Output
-----------------------
By using `.RedirectConsoleOutput()` you can forward all data written to the
console using the `System.Console` class. It is however better to use a logging
package from NuGet because there are much better options for logging other than
logging to your `server_log.txt` file. Some examples of good logging packages
are Log4Net, Micosoft.Extensions.Logging or NLog. Redirecting console output
should only ever be used for debugging purposes.

SampSharp Logging
-----------------
SampSharp provides some logs for debugging issues with the communication between
the servers. By using `.UseLogLevel(CoreLogLevel.Info)` you can change the
minimum level of `SampSharp.Core` log messages to appear.  By default, the log
messages are printed to the standard console output. If you wish to change the
output stream, you can use `.UseLogStream(stream)`. The following log levels are
available:

- `Initialisation` *(highest)*: Only show the messages which appear during the
  initialization of SampSharp.
- `Error`: Show errors and higher.
- `Warning`: Show warnings and higher.
- `Info` *(default)*: Show information messages and higher.
- `Debug` *(lowest)*: Show all messages, including debug messages.

Encoding
--------
C# uses Unicode for their strings, while SA-MP uses a "byte oriented" charset.
The characters displayed by SA-MP depend on the active localization of the
machine of the player. In SA-MP without SampSharp you might have noticed that
if someone types something in Russian (using a Cyrillic charset), the text
appears as some random symbols on the screen of an English user(using a Latin
charset). This is because the bytes representing symbols in the Cyrillic charset
represent different symbols in the Latin charset.

In order to let characters send by players represent the same characters on the
server, the characters need to be translated to Unicode, which is used by C#. In
order to do this, you will need to specify which character set (encoding) the
server expects to receive. At the moment, SampSharp only supports one encoding
to be active. In order to set the active encoding, you can use
`.UseEncoding(...)`. There are 3 overloads of the `UseEncoding` method:

- `UseEncoding(System.Text.Encoding encoding)`: Using this method you can
  specify an encoding to use. This is particulary useful if you wish to load an
  encoding which is build in to .NET.
- `UseEncoding(string filePath)`: Using this method you can load an encoding
  based on an encoding description file.
- `UseEncoding(System.Stream stream)`: Using this method you can load an
  encoding description file from a stream.

A number of encoding description files can be found in the `codepages` folder
inside the archieve which can be downloaded from the
[releases page](https://github.com/ikkentim/SampSharp/releases).

