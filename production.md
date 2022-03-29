---
title: Running a Server in Production
---

Introduction
------------
When you want to run your game mode on a samp-server you'll need to publish your dotnet project and download/extract the .NET Runtime and SampSharp plugin into your server directory.

Publishing your Game Mode
-------------------------
In order to compile and gather all required files for your game mode you can use the publish function of dotnet. In Visual Studio, open your project and select `Build -> Publish MyGameMode` and hit Publish. You can also publish your project with the dotnet CLI using `dotnet publish --configuration Release`.

Installation
-------------
- [SA-MP server package](https://www.sa-mp.com/download.php) 
(extract it anywhere you like)
- x86 version of the .NET Runtime
- The SampSharp plugin

### .NET Runtime (Windows)
For Windows you can simply download a 32-bit (x86) edition of a recent version of the .NET Runtime. Make sure to download the .NET Runtime binaries, you do not need to download the installer! You can download it from [the .NET Core download page](https://dotnet.microsoft.com/download/dotnet-core).

### .NET Runtime (Linux)
Microsoft has not yet officially released 32-bit binaries of .NET Core for Linux. A pre-build a version of the 32-bit .NET Core Run for Linux which can  [be downloaded from this website](https://deploy.timpotze.nl/packages/dotnet20200127.zip).

### Extracting the .NET Runtime
Extract the .NET Runtime binaries into a `runtime` folder in your samp-server directory. Create a `gamemode` folder in your server directory where you can store the binaries of your compiled game mode.

After adding your game mode binaries to the `gamemode` folder you should be able to run the samp-server.

### SampSharp plugin
Download the latest SampSharp package (`SampSharp-*.zip`) from the [SampSharp releases page on GitHub](https://github.com/ikkentim/SampSharp/releases/latest) and copy the contents of the folder to your SA-MP server directory. Update the `server.cfg` file to include the SampSharp plugin, you can do this by adding the line `plugins SampSharp` on Windows or `plugins libSampSharp.so` on Linux.
