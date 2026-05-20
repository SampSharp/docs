---
title: SampSharp
_disableContribution: true
_disableAffix: true
---

<style>
  .page-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 30px 0;
  }
  
  @media (max-width: 640px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .feature-box {
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    border: 1px solid var(--bs-border-color, #e0e0e0);
    background-color: var(--bs-body-bg, #ffffff);
    color: var(--bs-body-color, #333333);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  @media (prefers-color-scheme: dark) {
    .feature-box {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
  
  .feature-box:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 120, 212, 0.15);
    border-color: #0078d4;
    background: linear-gradient(135deg, 
      rgba(0, 120, 212, 0.03) 0%, 
      rgba(80, 230, 255, 0.03) 100%
    );
  }
  
  @media (prefers-color-scheme: dark) {
    .feature-box:hover {
      box-shadow: 0 8px 24px rgba(0, 120, 212, 0.25);
    }
  }
  
  .feature-box-title {
    color: #0078d4;
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 18px;
    display: block;
    font-weight: 600;
  }
  
  .feature-box p {
    margin: 0;
    color: inherit;
    line-height: 1.5;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .emoji {
    font-size: 24px;
    margin-right: 8px;
  }
</style>

<div class="page-container">

# Welcome to SampSharp

Build powerful open.mp game modes with modern C# and a proven Entity-Component-System architecture.

## What is SampSharp?

SampSharp is a framework that lets you write open.mp game modes in **C#** instead of Pawn. Powered by the .NET runtime, it brings modern programming practices, strong typing, and access to the entire NuGet ecosystem to SA-MP/open.mp development. 

The new **SampSharp v1.x** (for open.mp) features an **Entity-Component-System (ECS)** architecture that makes your code more modular, testable, and maintainable compared to traditional callback-based approaches.

## Why Choose SampSharp?

<div class="features-grid">
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji">🎯</span> ECS Architecture</span>
    <p>Build scalable systems with clear separation of concerns using the Entity-Component-System pattern</p>
  </div>
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji">🔷</span> Modern C#</span>
    <p>Write type-safe, expressive code with the latest C# language features and LINQ</p>
  </div>
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji">⚡</span> High Performance</span>
    <p>.NET's performance and JIT compilation deliver efficient game mode execution</p>
  </div>
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji">📦</span> NuGet Ecosystem</span>
    <p>Use thousands of mature, reliable libraries for logging, JSON, async operations, and more</p>
  </div>
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji">🖥️</span> Multi-Platform</span>
    <p>Run seamlessly on Windows and Linux servers</p>
  </div>
  <div class="feature-box">
    <span class="feature-box-title"><span class="emoji"></span> Rich Tooling</span>
    <p>Get IntelliSense, debugging, and refactoring support from Visual Studio and VS Code. Deploy easily with Docker for consistent environments</p>
  </div>
</div>

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

- **[Documentation](xref:quick-start)** — Learn the framework concepts and architecture
- **[Sample Projects](https://github.com/SampSharp/samples)** — Real-world examples to learn from

---

## Community & Support

Have questions? Join us on [Discord](https://discord.gg/gwcHpqp) or visit the [GitHub repository](https://github.com/ikkentim/SampSharp).

</div>
