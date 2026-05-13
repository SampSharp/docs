---
title: SampSharp
_disableContribution: true
_disableAffix: true
---

# Welcome to SampSharp

Build powerful open.mp game modes with modern C# and a battle-tested Entity Component System architecture.

---

## What is SampSharp?

SampSharp is a framework that lets you write open.mp game modes in **C#** instead of Pawn. Powered by the .NET runtime, it brings modern programming practices, strong typing, and access to the entire NuGet ecosystem to SA-MP/open.mp development. 

The new **SampSharp v1.x** (for open.mp) features an **Entity Component System (ECS)** architecture that makes your code more modular, testable, and maintainable compared to traditional callback-based approaches.

---

## Why Choose SampSharp?

- **🎯 ECS Architecture** — Build scalable systems with clear separation of concerns using the Entity Component System pattern
- **🔷 Modern C#** — Write type-safe, expressive code with the latest C# language features and LINQ
- **⚡ High Performance** — .NET's performance and JIT compilation deliver efficient game mode execution
- **📦 NuGet Ecosystem** — Use thousands of battle-tested libraries for logging, JSON, async operations, and more
- **🖥️ Multi-Platform** — Run seamlessly on Windows and Linux servers
- **🐳 Container Ready** — Deploy easily with Docker for consistent environments
- **🔧 Rich Tooling** — Get IntelliSense, debugging, and refactoring support from Visual Studio and VS Code

```csharp
class PlayerSystem : ISystem
{
    [Event]
    public void OnPlayerConnect(Player player)
    {
        player.SendClientMessage($"Welcome {player.Name}! You're the {player.Id}th player.");
        Console.WriteLine($"{player.Name} connected to the server.");
    }

    [Event]
    public void OnPlayerDisconnect(Player player)
    {
        Console.WriteLine($"{player.Name} disconnected from the server.");
    }
}
```

---

## Getting Started

Ready to build? Check out the resources below:

- **[Documentation](~/docs/index.md)** — Learn the framework concepts and architecture
- **[Sample Projects](https://github.com/SampSharp/samples)** — Real-world examples to learn from

---

## Community & Support

Have questions? Join us on [Discord](https://discord.gg/gwcHpqp) or visit the [GitHub repository](https://github.com/ikkentim/SampSharp).
