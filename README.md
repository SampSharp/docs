# SampSharp Documentation

This repository contains the SampSharp documentation source files. The site is built with [DocFX](https://dotnet.github.io/docfx/), a powerful documentation generator with excellent .NET integration.

## For Documentation Maintainers

### Prerequisites

- .NET SDK 6.0 or later

### Running Locally

1. Install DocFX (one-time setup):

   ```bash
   dotnet tool install -g docfx
   ```

2. Start the development server:

   ```bash
   docfx --serve
   ```

   The site will be available at `http://localhost:8080/`

3. Build the static site:

   ```bash
   docfx
   cp docs/public/sampsharp.png _site/
   ```

### Adding/Editing Documentation

All documentation is written in Markdown in the `docs/` folder.

- **Create a new page**: Add a new `.md` file in `docs/`
- **Update navigation**: Edit `docs/toc.yml` to add the page to the table of contents
- Internal links should use `.md` extension: `[link text](page.md)`
- External links require full URLs: `https://example.com`

```
├── docs/
│   ├── .vitepress/
│   │   ├── config.js           # VitePress configuration
│   │   └── theme/
│   │       ├── index.js        # Theme entry point
│   │       └── style.css       # Custom styles
│   ├── index.md                # Home page
│   ├── introduction.md         # Documentation pages
│   ├── getting-started.md
│   ├── images/                 # Images and assets
│   └── ...other markdown files
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for auto-deployment
├── package.json
└── README.md
```

### Troubleshooting

**Build errors about dead links**

Check:

- Internal links should use absolute paths: `/page-name` not `./page-name`
- External links should include full URLs: `https://example.com`
- File names must match exactly (case-sensitive on Linux/Mac)

**Syntax highlighting not working for code blocks**

Some languages (like PAWN) may not be built-in. The build will fall back to text highlighting, which is fine.

**Site not deploying via GitHub Actions**

1. Check that your repository has a `main` branch (not `master`)
2. Verify GitHub Pages is configured to use GitHub Actions as source
3. Check the Actions tab in your GitHub repository for error logs

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch via the GitHub Actions workflow (`.github/workflows/deploy.yml`).

To manually deploy or host elsewhere:

1. Build: `npm run docs:build`
2. Upload the contents of `docs/.vitepress/dist/` to your hosting provider
3. Configure your web server to serve the static files

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [SampSharp Project](https://sampsharp.net/)
