---
title: Platform & Version Support
uid: platform-support
---

# Platform & Version Support

SampSharp comes in two versions, each designed for different server platforms and with different capabilities:

- **SampSharp v1.x (for open.mp)** — A modern rewrite built from the ground up for the open.mp server. It embraces current .NET technologies, requires 64-bit architecture, and introduces a powerful ECS (Entity Component System) framework alongside the traditional gamemode framework.

- **SampSharp v0.x (Legacy)** — The original implementation targeting SA-MP servers. While it continues to receive maintenance and bug fixes, it is no longer the primary development focus and has inherent architectural limitations.

## Why SampSharp v1.x?

SampSharp v1.x was created to overcome fundamental limitations in the legacy codebase and to take advantage of modern server technology:

### Key Limitations of Legacy (v0.x)

> [!IMPORTANT]
> The legacy version is tied to 32-bit architecture and older .NET runtimes, which create several constraints:
> 
> - **Outdated .NET versions**: Locked to .NET versions that Microsoft no longer actively supports
> - **32-bit Linux unsupported**: Microsoft does not officially support .NET on 32-bit (x86) Linux; only unsupported community builds available

### Advantages of v1.x

> [!TIP]
> SampSharp v1.x delivers:
> 
> - **open.mp integration**: Built from the ground up to leverage open.mp's component extensibility platform, providing seamless integration with native open.mp features and future updates
> - **Modern .NET support**: Full support for latest .NET LTS releases (11, 12, etc.) on Windows and Linux
> - **Better Linux support**: Reliable .NET runtime on Linux x86_64
> - **Cleaner architecture**: Built with modern C# and design patterns for easier maintenance and feature development

## Support Matrix

| Platform | v1.x | v0.x (Legacy) |
|----------|------|---------------|
| **SA-MP Server** — Windows | ✗ Unsupported | ✓ Full Support |
| **SA-MP Server** — Linux | ✗ Unsupported | ◐ Partial Support † |
| **open.mp Server** — x86 (32-bit) | ◐ Coming Soon | ◐ Partial Support † |
| **open.mp Server** — x86_64 (64-bit) | ✓ Full Support | ✗ Unsupported |
| **Latest .NET Version** — Windows | ✓ Yes | ✓ Yes |
| **Latest .NET Version** — Linux | ✓ Yes | ✗ No † |
| **Gamemode Framework** | ✗ Not Planned | ✓ Yes |
| **ECS Framework** | ✓ Yes | ✓ Yes |

### Legend

- **✓ Full Support** — Fully supported and tested
- **◐ Partial Support** — Supported but with limitations or workarounds
- **✗ Unsupported** — Not supported in this version

### Footnotes

† **32-bit Linux and Unofficial Runtimes**

Microsoft does not officially support .NET on 32-bit (x86) Linux. For legacy SampSharp on x86 Linux or open.mp x86 servers, users must rely on community-built .NET 6 or .NET 8 runtimes. While functional in many cases, these unofficial builds contain bugs and the .NET 8 builds are known to be unstable. This is not a limitation of SampSharp itself, but rather the platform constraints of 32-bit Linux environments.

## Migration from Legacy

If you're currently using SampSharp v0.x and considering upgrading to v1.x, see the <xref:migration-guide> for detailed instructions on how to port your gamemode to the new architecture.

## Getting Started

Ready to start with SampSharp v1.x?

- <xref:getting-started>
- <xref:core-concepts>

For legacy support and documentation, see the <xref:legacy-docs> section.
