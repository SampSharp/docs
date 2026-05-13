---
title: SampSharp
_disableContribution: true
_disableToc: true
_disableAffix: true
---

# SampSharp

**Raise your SA-MP game modes to a whole new level with the power of .NET**

---

## Quick Start

```csharp
class GameMode : BaseMode
{
    protected override void OnPlayerConnected(BasePlayer player, EventArgs e)
    {
        base.OnPlayerConnected(player, e);
        player.SendClientMessage($"Welcome {player.Name}!");
    }
}
```

[Get Started](getting-started.md) • [View Documentation](introduction.md) • [Download](https://github.com/ikkentim/sampsharp/releases)

---

## Why SampSharp?

| Feature | Benefit |
|---------|---------|
| 📝 **Modern Language** | Write game modes in C# - a powerful, object-oriented language |
| ⚡ **High Performance** | Leverage the speed and efficiency of .NET Core |
| 📦 **NuGet Packages** | Access thousands of packages from the NuGet ecosystem |
| 🖥️ **Multi-Platform** | Run on Windows and Linux seamlessly |
| 🐳 **Container Ready** | Deploy easily in Docker containers |
| 🔒 **Thread-Safe** | Built-in thread-safety for concurrent operations |

---

## Documentation

Start with the [Introduction](introduction.md) to understand the framework, then follow the [Getting Started](getting-started.md) guide to set up your first project.

For API details, visit the [complete API reference](https://api.sampsharp.net/).

---

## Community

- **GitHub**: [github.com/ikkentim/sampsharp](https://github.com/ikkentim/sampsharp)
- **Discord**: [Join our server](https://discord.com/invite/gwcHpqp)
