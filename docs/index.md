---
layout: home

hero:
  name: ".NET SA-MP"
  text: "Raise your SA-MP game modes to a whole new level with the power of .NET"
  image:
    src: /images/sampsharp.png
    alt: SampSharp
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View Documentation
      link: /introduction
---

```csharp
class GameMode : BaseMode
{
    protected override void OnPlayerConnected(BasePlayer player, EventArgs e)
    {
        base.OnPlayerConnected(player, e);

        player.SendClientMessage($"Welcome {player.Name}, to a SampSharp powered server!");
    }
}
```

<div class="features-grid">

<div class="feature">
<div class="feature-icon">📝</div>

### Modern Language

SampSharp allow you to write you game mode in C#: an Object-Oriented language.

</div>

<div class="feature">
<div class="feature-icon">⚡</div>

### High Performance

Make good use of the high performance .NET Core has to offer.

</div>

<div class="feature">
<div class="feature-icon">📦</div>

### Thousands of Packages

Unleash the power of thousands of available NuGet Packages.

</div>

<div class="feature">
<div class="feature-icon">🖥️</div>

### Any platform

SampSharp can run on both Windows and Linux.

</div>

<div class="feature">
<div class="feature-icon">🐳</div>

### Containerized

SampSharp can easily run in a Docker container.

</div>

<div class="feature">
<div class="feature-icon">🔒</div>

### Thread-Safe

SampSharp is 100% thread-safe!

</div>

</div>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.feature {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s;
}

.feature:hover {
  background: var(--vp-code-block-bg);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
}

.feature h3 {
  margin: 0.5rem 0;
}

.feature p {
  margin: 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
