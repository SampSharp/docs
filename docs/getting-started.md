---
title: Getting Started with SampSharp for open.mp
uid: getting-started
---

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

1. **First Launch**: Start the debugger with your launch configuration. The application will prompt you to enter the path to your open.mp server directory.
2. **Enter Path**: Provide the full path to your open.mp installation (e.g., `C:\open.mp` or `/home/user/open.mp`).
3. **Configuration Generated**: A `launchSettings.json` file will be generated with your open.mp path, and the application will close.
4. **Second Launch**: Start the debugger again. The gamemode will now launch directly with your open.mp server, fully configured and ready to debug.

## Next Steps

- **Explore the Documentation**: Learn about <xref:core-concepts>, <xref:commands>, and <xref:vehicles>
- **Check Out Examples**: Visit the [SampSharp samples repository](https://github.com/sampsharp/samples) for complete example gamemodes
- **Join the Community**: Have questions? Join us on [Discord](https://discord.gg/gwcHpqp) where you can get help and discuss development with other SampSharp developers
