---
name: docs-conventions
description: Documentation structure, style, and formatting conventions observed from existing feature articles
metadata:
  type: project
---

## File locations
- Feature articles: `docs/features/*.md`
- Each feature directory has a `toc.yml` listing article hrefs
- Top-level `docs/toc.yml` exists; features have their own `docs/features/toc.yml`

## Article structure (from vehicles.md, timers.md, objects.md, commands.md)
- YAML frontmatter: `title:` and `uid:` only — no other fields
- Single H1 matching the title
- Short intro paragraph (2–3 sentences max), no preamble fluff
- H2 for major sections, H3 for sub-topics
- **Bold lead** before code blocks ("Example: ...", or inline description)
- Code blocks use `csharp` fence; always use `[Event]` attribute on event handler methods
- xrefs with `<xref:FullyQualifiedTypeName>` for API types
- Inline cross-links rather than a dedicated "See Also" section
- End of section: `See <xref:...> for all available properties and methods.` is a common closing pattern

## Tone and density
- Direct, instructional — no marketing filler
- Assume C# developer; explain SA-MP-specific concepts (dialogs, menus) when first introduced
- Short sentences, active voice
- DocFX alerts used sparingly — only when genuinely useful (not decorative)

## Code sample idioms
- Event handlers shown inside `ISystem` class with `[Event]` attribute
- Services injected as method parameters (not constructor-injected in samples unless needed)
- Named parameters used in constructor calls for clarity (`caption:`, `button1:`, etc.)
- `async Task` return type shown when using `ShowAsync`

## AGENTS.md is actually a DocFX xref cheat sheet
- The file at `docs/AGENTS.md` (which is loaded as the project AGENTS file) is actually a DocFX cross-reference guide, not a traditional agent instructions file
- Key rule: prefer `<xref:uid>` syntax; use `[text](xref:uid)` only for custom link text
- UID for conceptual docs comes from YAML frontmatter `uid:` field
- UID for API docs is the fully-qualified type/member name
