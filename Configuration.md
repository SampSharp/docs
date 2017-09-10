- [Configuration Template](#configuration-template)
- [Plugin](#plugin)
- [Gamemode](#gamemode)
- [Debug symbols](#debug-symbols)
- [Encoding](#encoding)
- [Example configuration](#example-configuration)

Configuration Template
----------------------
The SampSharp package comes with a `server.cfg.template` file. You can either rename this file to `server.cfg` and configure it, or, if you don't want to loose your existing configuration, your can add to your existing configuration.

Plugin
------
After you have installed SampSharp to your server, you need to enable the plugin. Edit `server.cfg` inside your server directory and add `SampSharp` to your `plugins` line. If you don't have a `plugins` line in your configuration file, add it at the end of the file. If you are running your server on Linux, use `libSampSharp.so` instead of `SampSharp`.

Because SampSharp provides the gamemode, we need to disable the PAWN gamemode by setting `gamemode0` to empty.

Gamemode
--------
To let SampSharp know which gamemode you want to start add the following line to your `server.cfg` file:
```
gamemode YourGameMode:GameMode
```
YourGameMode and GameMode represents the namespace and class of the entry point.

Debug symbols
-------------
If any errors occur in your gamemode, SampSharp will try to print the error and stack trace to the console. To display information such as file names and line numbers, SampSharp will need a `.mdb` symbols file. If you use Visual Studio to develop your gamemode, Visual Studio will automatically generate `.pdb` symbol files. The plugin can convert these files for you, but you'll need to specify which files need to be converted. To do this, add the following line to your `server.cfg` file:
```
symbols YourGameMode.dll
```
Change YourGameMode.dll to the file name of your gamemode. If you need multiple symbol files to be converted, add them, seperated by a single space, to the same line.

Encoding
--------
SA-MP uses the ANSI character encoding, but the .NET/mono run time uses unicode characters. SampSharp will handle this conversion for you, but you'll need to specify which ANSI code page to use. By default codepage 1250 will be used.

SampSharp currently supports the following codepages:

| Identifier | .NET Name    | Description                                      |
|------------|--------------|--------------------------------------------------|
| 437        | IBM437       | OEM United States                                |
| 720        | DOS-720      | Arabic (Transparent ASMO); Arabic (DOS)          |
| 737        | ibm737       | OEM Greek (formerly 437G); Greek (DOS)           |
| 775        | ibm775       | OEM Baltic; Baltic (DOS)                         |
| 850        | ibm850       | OEM Multilingual Latin 1; Western European (DOS) |
| 852        | ibm852       | OEM Latin 2; Central European (DOS)              |
| 855        | IBM855       | OEM Cyrillic (primarily Russian)                 |
| 857        | ibm857       | OEM Turkish; Turkish (DOS)                       |
| 858        | IBM00858     | OEM Multilingual Latin 1 + Euro symbol           |
| 862        | DOS-862      | OEM Hebrew; Hebrew (DOS)                         |
| 866        | cp866        | OEM Russian; Cyrillic (DOS)                      |
| 874        | windows-874  | ANSI/OEM Thai (ISO 8859-11); Thai (Windows)      |
| 1250       | windows-1250 | ANSI Central European; Central European (Windows)|
| 1251       | windows-1251 | ANSI Cyrillic; Cyrillic (Windows)                |
| 1252       | windows-1252 | ANSI Latin 1; Western European (Windows)         |
| 1253       | windows-1253 | ANSI Greek; Greek (Windows)                      |
| 1254       | windows-1254 | ANSI Turkish; Turkish (Windows)                  |
| 1255       | windows-1255 | ANSI Hebrew; Hebrew (Windows)                    |
| 1256       | windows-1256 | ANSI Arabic; Arabic (Windows)                    |
| 1257       | windows-1257 | ANSI Baltic; Baltic (Windows)                    |
| 1258       | windows-1258 | ANSI/OEM Vietnamese; Vietnamese (Windows)        |

(*Source: [https://msdn.microsoft.com/en-us/goglobal/bb964653.aspx](https://msdn.microsoft.com/en-us/goglobal/bb964653.aspx)*)

Example configuration
-------
The following example configuration is a modified version of `server.cfg.template`:

```
echo Executing Server Config...
lanmode 0
rcon_password changeme
maxplayers 50
port 7777
hostname SA-MP 0.3 Server running SampSharp
announce 0
query 1
chatlogging 0
weburl github.com/ikkentim/SampSharp
onfoot_rate 40
incar_rate 40
weapon_rate 40
stream_distance 300.0
stream_rate 1000
maxnpc 0
logtimeformat [%H:%M:%S]

gamemode0 empty 1
gamemode YourGameMode:GameMode

plugins SampSharp
# plugins libSampSharp.so
```