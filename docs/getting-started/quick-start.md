---
title: Quick Start
uid: quick-start
---

#  Quick Start

Welcome to SampSharp! This guide will help you create and run your first gamemode using SampSharp v1.x for open.mp.

## Prerequisites

Before you begin, you'll need:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet) or later
- open.mp server with SampSharp component (see [Setting Up open.mp Server](#setting-up-openmp-server))
- A basic understanding of C# and object-oriented programming

### Choose Your IDE

# [Visual Studio](#tab/visualstudio)

Install [Visual Studio](https://visualstudio.microsoft.com/) with the `.NET desktop development` workload:
1. Download and run the Visual Studio installer
2. Select the `.NET desktop development` workload during installation
3. Complete the installation

> [!NOTE]
> The `.NET desktop development` workload includes the .NET 10 SDK, so you don't need to install it separately.

# [Visual Studio Code](#tab/vscode)

Install [Visual Studio Code](https://code.visualstudio.com/) and the required extensions:
- [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
- [C# DevKit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit)

---

## Setting Up open.mp Server

SampSharp requires a **64-bit version** of open.mp because the .NET runtime runs as x64.

1. Download the x64 build from the [SampSharp open.mp x64 releases page](https://github.com/SampSharp/openmultiplayer-x64-builds/releases) and extract it anywhere on your system (e.g., `C:\open.mp` or `~/open.mp`).

2. Download the SampSharp component from the [SampSharp releases page](https://github.com/ikkentim/SampSharp/releases) and extract it into the `components` directory of your open.mp server installation.

3. **Verify the install.** Run `omp-server.exe` once from the open.mp directory and check the startup output for a line like `Successfully loaded component SampSharp (0.11.0.0)`. If SampSharp is missing from the loaded components list, the component files are not in the right place. You may see errors about `runtimeconfig.json` at the bottom of the log — those are expected at this stage since no gamemode has been built or wired up yet. Stop the server with `Ctrl+C` once verified.

## Creating Your First Project

Install the SampSharp template:
```bash
dotnet new install SampSharp.Templates
```

Create a new project:
```bash
dotnet new sampsharp -n MyFirstGameMode
cd MyFirstGameMode
```

The template automatically creates:
- A configured `Startup.cs` class with the ECS framework initialized
- A sample `MyFirstSystem.cs` system with example events and commands
- A `.csproj` file with the necessary SampSharp NuGet package references

**Startup.cs** implements `IEcsStartup` to configure the ECS framework, logging, and middleware.

**MyFirstSystem.cs** is an example system showing how to handle events, commands, and access services. For more details on systems, see the <xref:systems> page.

## Running Your Gamemode

### Configure Your IDE

# [Visual Studio](#tab/visualstudio)

1. Open the project in Visual Studio.
2. Press `F5` or go to **Debug** > **Start Debugging** to launch the project with the debugger attached.

# [Visual Studio Code](#tab/vscode)

Create a `.vscode/launch.json` file in your project root:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "SampSharp Gamemode",
            "type": "dotnet",
            "request": "launch",
            "projectPath": "${workspaceFolder}/MyFirstGameMode.csproj"
        }
    ]
}
```
Update the `projectPath` to match your project's `.csproj` file location.

---

### Launch Steps

The first launch is a one-time setup. The gamemode application starts on its own, detects it is not running inside an open.mp server, and helps you wire up a launch profile that starts the server with your gamemode loaded. Every launch after that reuses the profile.

1. **First Launch**: Start the debugger with your launch configuration. The gamemode application starts in isolation, prints a setup banner, and prompts you to enter the path to your open.mp server directory.
2. **Enter Path**: Provide the full path to your open.mp installation (e.g., `C:\open.mp` or `/home/user/open.mp`).
3. **Profile Generated**: A `Properties/launchSettings.json` file is written with an `open.mp` profile pointing at `omp-server.exe`, and the gamemode exits.
4. **Second Launch**: Start the debugger again. Your IDE uses the `open.mp` profile to launch the server, which loads the gamemode and attaches the debugger.

> [!TIP]
> `Properties/launchSettings.json` is a standard .NET launch profile file. It hardcodes the path to *your* open.mp install, so add it to `.gitignore` rather than committing it — teammates can regenerate their own profile on first launch.

## Next Steps

- **Jump to a Specific Topic**: Skip ahead to <xref:commands>, <xref:vehicles>, or another feature page.
- **Check Out Examples**: Visit the [SampSharp samples repository](https://github.com/sampsharp/samples) for complete example gamemodes
- **Join the Community**: Have questions? Join us on [Discord](https://discord.gg/gwcHpqp) where you can get help and discuss development with other SampSharp developers
