---
title: DocFX Cross-Reference (xref) Guide
---

# DocFX Cross-Reference (xref) Guide

This file summarizes all essential knowledge for writing correct cross-references (xrefs) in DocFX-based documentation, so you never make mistakes again.

## 1. YAML Frontmatter and UID
- Every conceptual Markdown file that should be referenced **must** have a unique `uid` in its YAML frontmatter:
  ```yaml
  ---
  title: My Page Title
  uid: my-unique-id
  ---
  ```
- The `uid` must be unique within the documentation set.
- If a file has no `uid`, it **cannot** be referenced via xref.
- For API reference files, the UID is auto-generated from the API signature (e.g., `System.String`).

## 2. Basic xref Syntax
- To reference a UID from anywhere in your docs, use:
  ```
  <xref:my-unique-id>
  ```
- Or, for Markdown link text:
  ```
  [Link Text](xref:my-unique-id)
  ```
- This works for both conceptual docs and API docs.

## 3. Best Practices
- Always check that the target file has a `uid` in its YAML frontmatter.
- Use short, descriptive UIDs (lowercase, hyphens/underscores if needed).
- Never duplicate UIDs across files.
- Prefer `xref:` links over relative links for conceptual docs when possible.
- For API docs, use the full type/member name as UID (e.g., `System.String`, `MyNamespace.MyClass.MyMethod`).

## 4. Troubleshooting
- If an xref link does not resolve, check:
  - The target file has a `uid`.
  - The UID is spelled correctly.
  - The UID is unique.
- Use DocFX build output to spot unresolved xrefs.

## 5. Example
```markdown
See [the events article](xref:events) for more details.
```

## 6. Useful Links
- [DocFX Markdown Documentation](https://dotnet.github.io/docfx/docs/markdown.html)
- [DocFX Links and Cross References](https://dotnet.github.io/docfx/docs/links-and-cross-references.html)

---

**Summary:**
- Always use `uid` in YAML frontmatter for xref targets.
- Use `xref:uid` syntax for cross-references.
- Check for uniqueness and spelling.
- Prefer xref over relative links for maintainability.

---

## 7. DocFX Markdown Features Cheat Sheet

### Alerts
Use blockquotes with special keywords for colored callouts:

```
> [!NOTE]
> Information the user should notice even if skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Essential information required for user success.

> [!CAUTION]
> Negative potential consequences of an action.

> [!WARNING]
> Dangerous certain consequences of an action.
```

### Includes
Reuse content from other markdown files:

Inline include:
```
Text before [!INCLUDE [<title>](<filepath>)] and after.
```
Block include:
```
[!INCLUDE [my-block](../../includes/my-block.md)]
```

### Code Snippets
Embed code from files, optionally with line/region selection and highlights:
```
[!code-csharp[](Program.cs)]
[!code-csharp[](Program.cs#region)]
[!code-csharp[](Program.cs#L12-L16)]
[!code-csharp[](Program.cs?highlight=2,5-7,9-)]
```

### Tabs
Create tabbed content for platform or language variants:
```
# [Linux](#tab/linux)
Linux content...

# [Windows](#tab/windows)
Windows content...

---
```

### Diagrams
Embed diagrams using mermaid or PlantUML:

**Mermaid:**
````
```mermaid
flowchart LR
  A --> B
```
````

**PlantUML:**
````
```plantuml
Bob -> Alice : hello
```
````

### Math Expressions
Use LaTeX math inline or as blocks (modern template only):

Inline: `This is inline math: $\sqrt{3x-1}$`

Block:
```
$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$
```

### Images & Video
Embed images:
```
![alt-text](image-link.png)
```
Embed video:
```
> [!Video https://www.youtube.com/embed/ID]
```

---

**Summary:**
- Always use `uid` in YAML frontmatter for xref targets.
- Use `xref:uid` syntax for cross-references.
- Prefer xref over relative links for maintainability.
- Use DocFX Markdown features (alerts, includes, code snippets, tabs, diagrams, math, etc.) for rich documentation.
