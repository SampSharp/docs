# SampSharp Documentation

This repository contains the source files for the SampSharp documentation. The site is built with [DocFX](https://dotnet.github.io/docfx/), a powerful documentation generator designed for .NET projects.

> **For Documentation Contributors Only**
> 
> This guide is intended for people contributing to the SampSharp documentation. If you're looking for SampSharp documentation, visit [sampsharp.net](https://sampsharp.net).

## Quick Start

### Prerequisites

- .NET 10 SDK or later

### Running Locally

1. Install DocFX (one-time setup):

   ```bash
   dotnet tool install -g docfx
   ```

2. Build the SampSharp component:

   ```bash
   cd sampsharp-src && ./build.sh component
   ```

3. Start the development server:

   ```bash
   docfx --serve
   ```

   The site will be available at `http://localhost:8080/`

## Contributing

### Writing Documentation

All documentation is written in Markdown in the `docs/` folder. For Markdown syntax reference, see the [DocFX Markdown Documentation](https://dotnet.github.io/docfx/docs/markdown.html).

#### Adding a New Page

1. Create a new `.md` file in the appropriate folder under `docs/`:
   - `docs/core-concepts/` - ECS concepts and architecture fundamentals
   - `docs/features/` - Feature-specific guides
   - `docs/reference/` - Reference material
   - `docs/support/` - Support content (troubleshooting, migration guides)

2. Add a YAML frontmatter header to the file:
   ```yaml
   ---
   title: Your Page Title
   uid: unique-identifier
   ---
   ```

3. Add the file reference to the corresponding `toc.yml`:
   ```yaml
   - href: your-page.md
   ```

#### Documentation Structure

```
docs/
├── index.md                    # Home page
├── getting-started.md          # Getting started guide
├── core-concepts/
│   ├── toc.yml                 # Core concepts table of contents
│   ├── index.md
│   ├── entities-components.md
│   ├── systems.md
│   └── events.md
├── features/
│   ├── toc.yml                 # Features table of contents
│   ├── command-system.md
│   ├── dialog-menus.md
│   ├── players.md
│   ├── timers.md
│   ├── vehicles.md
│   └── objects.md
├── reference/
│   ├── toc.yml                 # Reference table of contents
│   ├── advanced-topics.md
│   └── examples.md
├── support/
│   ├── toc.yml                 # Support table of contents
│   ├── platform-support.md
│   ├── migration-guide.md
│   ├── troubleshooting.md
├── legacy/                     # Legacy/deprecated content
│   ├── toc.yml
│   ├── index.md
│   └── ...
└── toc.yml                     # Main table of contents
```

### Markdown Tips

- **Internal links**: Use relative paths with `.md` extension: `[link text](systems.md)` or `[link text](../guides/systems.md)`
- **External links**: Use full URLs: `[link text](https://example.com)`
- **Cross-references**: Link to other documentation pages using `<xref:uid>` (where `uid` is the page's `uid` field from frontmatter): `<xref:systems>`
- **Note blocks**: Use `> [!NOTE]` syntax for important callouts
- **Tabs**: Use DocFX tab syntax for tabbed content (see [DocFX Markdown Documentation](https://dotnet.github.io/docfx/docs/markdown.html))
- **Code references**: Use `<xref:NameSpace.ClassName>` to create cross-references to API documentation

## Resources

- [DocFX Documentation](https://dotnet.github.io/docfx/)
- [DocFX Markdown Guide](https://dotnet.github.io/docfx/docs/markdown.html)
- [SampSharp Project](https://sampsharp.net/)
