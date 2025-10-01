# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is **Quartz v4**, a static site generator for publishing digital gardens and notes as websites. It's built with TypeScript, uses Preact for components, and processes Markdown content through a plugin-based architecture.

## Common Development Commands

### Build and Development

- `npx quartz build` - Build the site into static files
- `npx quartz build --serve` - Build and serve locally with hot reload
- `npx quartz build --serve -d docs` - Build and serve documentation
- `npm run docs` - Build and serve docs specifically

### Code Quality

- `npm run check` - Run TypeScript check and Prettier format check
- `npm run format` - Auto-format code with Prettier
- `npm test` - Run tests using tsx test runner

### CLI Operations

- `npx quartz create` - Initialize a new Quartz site
- `npx quartz sync` - Sync content to/from GitHub
- `npx quartz update` - Update Quartz to latest version

## Architecture Overview

### Core Build System

The build process follows a three-stage pipeline:

1. **Parse** (`quartz/processors/parse`) - Transform Markdown to AST
2. **Filter** (`quartz/processors/filter`) - Apply content filtering
3. **Emit** (`quartz/processors/emit`) - Generate output files

### Plugin System

Quartz uses a plugin-based architecture with three types:

- **Transformers** (`quartz/plugins/transformers/`) - Process content (syntax highlighting, links, etc.)
- **Filters** (`quartz/plugins/filters/`) - Filter content (remove drafts, etc.)
- **Emitters** (`quartz/plugins/emitters/`) - Generate output (HTML pages, RSS, assets, etc.)

### Component Architecture

- **Components** (`quartz/components/`) - Preact components for UI elements
- **Layout System** - Defined in `quartz.layout.ts` with shared and page-specific layouts
- **Styling** - Located in `quartz/styles/` using SCSS

### Configuration

- `quartz.config.ts` - Main site configuration (theme, plugins, analytics)
- `quartz.layout.ts` - Layout and component configuration
- `tsconfig.json` - TypeScript configuration with Preact JSX settings

## Key File Locations

### Content and Output

- `content/` - Markdown source files
- `public/` - Static assets (generated during build)
- `docs/` - Documentation source files

### Core System Files

- `quartz/build.ts` - Main build orchestration logic
- `quartz/bootstrap-cli.mjs` - CLI entry point
- `quartz/cfg.ts` - Configuration type definitions
- `quartz/util/` - Core utilities (path handling, performance, etc.)

### Development Configuration

- `.prettierrc` - Code formatting (100 char width, no semicolons, trailing commas)
- `package.json` - Requires Node.js ≥22, npm ≥10.9.2

## Important Development Notes

### Documentation Review Policy

**Before Making Code Changes**: Always consult the documentation in the `docs/` directory before making any code changes. This ensures you understand the existing architecture, patterns, and conventions specific to Quartz v4.

### Layout Verification Policy

**After CSS/Layout Changes**: Always verify layout changes using Chrome DevTools MCP by programmatically inspecting element properties via `evaluate_script`. DO NOT use screenshots for layout verification. Instead:
1. Use `mcp__chrome-devtools__evaluate_script` to inspect element positions, dimensions, and computed styles
2. Verify alignment, spacing, and layout properties programmatically
3. Check `getBoundingClientRect()` for position and size
4. Check `getComputedStyle()` for CSS properties like margins, padding, position, etc.

### Code Style

- Uses Prettier with 100 character line width
- No semicolons, trailing commas enabled
- TypeScript strict mode enabled
- Preact JSX with `jsxImportSource: "preact"`

### Plugin Development

When creating or modifying plugins:

- Follow the three-tier system (transformers/filters/emitters)
- Export from `quartz/plugins/index.ts`
- Use the `Plugin` interface from `quartz/plugins/types.ts`

### Component Development

- Components are Preact-based, not React
- Use TypeScript interfaces for props
- Import from `quartz/components/` for existing components
- Follow the layout system defined in `quartz.layout.ts`

### Content Processing

- Markdown files in `content/` are processed through the plugin pipeline
- Frontmatter is supported and processed by the FrontMatter transformer
- Links between notes are resolved by the CrawlLinks transformer

### Performance Considerations

- The build system supports concurrent processing
- Use `--concurrency=1` flag for profiling
- Custom OG image generation can be disabled to speed up builds (see quartz.config.ts:91)

### Testing

- Uses `tsx --test` for test execution
- Tests should be co-located with source files or in appropriate test directories

## Common Modification Patterns

### Adding New Components

1. Create component in `quartz/components/`
2. Export from `quartz/components/index.ts`
3. Add to appropriate layout in `quartz.layout.ts`

### Modifying Site Configuration

- Theme and styling: `quartz.config.ts`
- Layout and components: `quartz.layout.ts`
- Build behavior: Plugin configuration in `quartz.config.ts`

### Custom Plugin Development

1. Create in appropriate `quartz/plugins/` subdirectory
2. Follow existing plugin patterns
3. Export from `quartz/plugins/index.ts`
4. Add to plugin configuration in `quartz.config.ts`

## Multi-language System Architecture

This Quartz site implements a custom multi-language system. Understanding this architecture is **CRITICAL** when developing any component that displays content lists.

### Content Structure

```
content/
├── index.md          # English homepage (slug: "" or "index")
├── cn.md             # Chinese homepage (slug: "cn")
├── en/               # English content pages
│   ├── code.md
│   └── The vision of AMIO.md
└── cn/               # Chinese content pages
    ├── AMIO的愿景.md
    └── 刷机脑图.md
```

### URL Structure

- `/` - English homepage (index.md)
- `/cn` - Chinese homepage (cn.md)
- `/en/*` - English content pages
- `/cn/*` - Chinese content pages

### Language Preference Storage

Language preference is stored in `localStorage` with key `quartz-preferred-lang`:
- Value: `"cn"` or `"en"`
- **Priority**: First check localStorage, if not exists, then detect from browser language
- Updated only when user manually clicks language switcher button

### Language Switcher Behavior

Located in `quartz/components/scripts/languageswitcher.inline.ts`:

1. **On first visit** (no saved preference):
   - Detects browser language (`navigator.language`)
   - If browser language starts with 'zh', sets preference to `"cn"`, otherwise `"en"`
   - Saves detected language to localStorage
   - Redirects to corresponding homepage if Chinese

2. **On subsequent visits** (has saved preference):
   - Reads saved language preference from localStorage
   - Uses saved preference, ignoring browser language
   - Sets `saved-lang` attribute on `<html>` element
   - If on root path (`/`) and preference is Chinese, redirects to `/cn`

3. **On language switch button click**:
   - Toggles language preference in localStorage
   - Redirects to corresponding homepage (Chinese → `/cn`, English → `/`)
   - **Does NOT update preference based on current URL**

### Multi-language Filtering Strategy

**ALL components use client-side filtering based on user preference from localStorage.**

Components filter content based on the user's saved language preference (`localStorage.getItem('quartz-preferred-lang')`), NOT the current page URL.

#### Implementation Pattern

See `quartz/components/scripts/explorer.inline.ts` lines 222-231 for reference:

```typescript
// Get user's preferred language from localStorage
const preferredLang = getPreferredLanguage()

// Filter content to show only preferred language
const langFolder = trie.children.find(
  (child) => child.isFolder && child.slugSegment === preferredLang
)
if (langFolder) {
  trie.children = langFolder.children
}
```

#### Helper Functions

Use these functions from `languageswitcher.inline.ts`:

```typescript
function detectBrowserLanguage(): "cn" | "en" {
  const browserLang = navigator.language || (navigator as any).userLanguage
  if (browserLang && browserLang.toLowerCase().startsWith("zh")) {
    return "cn"
  }
  return "en"
}

function getPreferredLanguage(): "cn" | "en" {
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null
  if (savedLang) {
    return savedLang
  }
  return detectBrowserLanguage()
}
```

### Critical Rules for Multi-language Components

1. **ALL filtering is client-side**: Use `localStorage` preference, not current page URL
2. **Filter on `nav` event**: Re-filter content when user navigates between pages
3. **Use helper functions**: Always use `getPreferredLanguage()` to get user preference
4. **Content matching**:
   - Chinese: `f.slug?.startsWith("cn/") || f.slug === "cn"`
   - English: `f.slug?.startsWith("en/") || f.slug === "index"`

### Common Pitfalls to Avoid

❌ **Wrong**: Filtering based on current page URL or slug
❌ **Wrong**: Using CSS hide/show instead of data filtering
❌ **Wrong**: Assuming all English content is under `/en/` (index.md is at root)
❌ **Wrong**: Not re-filtering on navigation events
✅ **Right**: Use `getPreferredLanguage()` from localStorage
✅ **Right**: Filter at data level in client-side scripts
✅ **Right**: Re-filter on `nav` event
