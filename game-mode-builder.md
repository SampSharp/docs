---
title: GameModeBuilder
---

Introduction
--------
The `GameModeBuilder` can be used to configure how your game mode is launched. Generally, you'll be using the `GameModeBuilder` from the entry-point of your assembly.

``` c#
public static class Program
{
    public static void Main()
    {
        new GameModeBuilder()
            .Use<GameMode>()
            .Run();
    }
}
```

Game Mode Instance
------------------
In order for your game mode to properly function, you need to indicate which class provides the game mode functionality; a class which implements `IGameModeProvider`. The `BaseMode` class in the `SampSharp.GameMode` library implements this interface. Generally you'll want to create a class which inherits from `BaseMode` and use this class as the game mode provider. By using the `Use` method you can specify the game mode provider:

``` cs
.Use<MyGameMode>()

// or if you wish to specify the constructor manually:

.Use(new MyGameMode())
```

SampSharp Logging
-----------------
SampSharp provides some logging messages to show what is going on within SampSharp itself. By using the `UseLogLevel` method you can change the minimum level of log messages which are written to the output. By default, the log messages are printed to the standard console output. If you wish to change the output stream, you can use the `UseLogStream` method. The following log levels are available:

- `CoreLogLevel.Initialisation` *(highest)*: Only show the messages which appear during the initialization of SampSharp.
- `CoreLogLevel.Error`: Show errors and higher.
- `CoreLogLevel.Warning`: Show warnings and higher.
- `CoreLogLevel.Info` *(default)*: Show information messages and higher.
- `CoreLogLevel.Debug` *(lowest)*: Show all messages, including debug messages.

Redirect Console Output
-----------------------
By using `RedirectConsoleOutput` method of the `GameModeBuilder` you can forward all data written to the console using the `System.Console` class to the SA-MP server log. It is however a better practise to use a logging package from NuGet because these provides for better options than SA-MP has to offer, such as log rotation, formatting and writing logs to logging services such as Elastic Search. Some examples of good logging packages are Log4Net, Micosoft.Extensions.Logging and NLog.

Encoding
----
C# uses Unicode for storing text while SA-MP uses a "byte oriented" charset. The characters displayed by SA-MP depend on the active localization of the machine of the player. In SA-MP without SampSharp you might have noticed that when someone types something in Russian (using a Cyrillic charset), the text appears as some random symbols on the screen of an English user(using a Latin charset). This is because the bytes representing symbols in the Cyrillic charset represent different symbols in the Latin charset.

In order to let characters sent by players represent the same characters on the server, the characters need to be translated to Unicode. In order to do this, you will need to specify which character set (encoding) the server expects to receive. At the moment, SampSharp only supports one encoding to be active. In order to set the active encoding, you can use `UseEncoding` method of the `GameModeBuilder`. There are 3 overloads of the `UseEncoding` method:

- `UseEncoding(System.Text.Encoding encoding)`: Using this method you can specify an encoding to use. This is particulary useful if you wish to load an encoding which is built into .NET
- `UseEncoding(string filePath)`: Using this method you can load an encoding based on an encoding description file. You can find these files in the [codepages repository](github.com/sampsharp/codepages). Please note these codepages are also available using the `UseEncodingCodePage` method
- `UseEncoding(System.Stream stream)`: Using this method you can load an encoding description file from a stream

SampSharp also provdes some embedded code pages. You can use one of these code pages using the `UseEncodingCodePage` method. The following code pages are embedded in SampSharp and are available through this method:

- 8859-1
- 8859-10
- 8859-11
- 8859-13
- 8859-14
- 8859-15
- 8859-16
- 8859-2
- 8859-3
- 8859-4
- 8859-5
- 8859-6
- 8859-7
- 8859-8
- 8859-9
- cp1250
- cp1251
- cp1252
- cp1253
- cp1254
- cp1255
- cp1256
- cp1257
- cp1258
- cp437
- cp737
- cp775
- cp850
- cp852
- cp855
- cp857
- cp860
- cp861
- cp862
- cp863
- cp864
- cp865
- cp866
- cp869
- cp874
- cp932
- cp936
- cp949
- cp950 

See the [code pages Wikipedia article](https://en.wikipedia.org/wiki/Code_page) for more information code pages and which code page might best suit your users.