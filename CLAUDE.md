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

## Site Customization History

This section documents all customizations and optimizations made to this Quartz instance.

### Multi-language Support System

**Commits**: `f9374ae`, `d8bc4c0`, `c713c14`, `94b7700`, `f2bc3c4`, `e80b556`

Implemented a comprehensive bilingual (English/Chinese) support system:

- **Language Detection**: Auto-detects browser language on first visit
- **Persistent Preference**: Stores user's language choice in `localStorage`
- **Language Switcher Component**: Toggle button for switching between languages
- **Explorer Filtering**: Shows only content from selected language folder
- **Preference-based Routing**: Redirects to appropriate homepage based on saved preference

**Key Files**:
- `quartz/components/LanguageSwitcher.tsx` - UI component
- `quartz/components/scripts/languageswitcher.inline.ts` - Client-side logic
- `quartz/components/scripts/explorer.inline.ts` - Language filtering integration

### Search Enhancement for CJK Languages

**Commits**: `82432ee`, `72184f9`, `10ffa2f`, `d12f7a8`

Enhanced search functionality to properly support Chinese, Japanese, and Korean content:

- **Mixed Content Support**: Handles both CJK and non-CJK characters in search queries
- **Improved Tokenization**: Better word boundary detection for CJK text
- **Search Highlighting**: Yellow highlight color for better visibility (changed from pink)
- **CSS Fixes**: Removed conflicting rules that prevented search highlight display

**Modified Files**:
- `quartz/components/scripts/search.inline.ts` - Search logic improvements
- `quartz/styles/base.scss` - Highlight color changes

### Recent Notes Component

**Commit**: `5ec8b59`

Added a Recent Notes component with intelligent positioning:

- **Responsive Layout**: Different positioning for desktop vs mobile
- **Desktop**: Displays between social links and Explorer in left sidebar
- **Mobile**: Shows inside Explorer content area at the top
- **Language Filtering**: Only shows notes from current language preference
- **Configurable Limit**: Defaults to showing 3 most recent notes (changed from 5 in commit `9bf0701`)

**Key Files**:
- `quartz/components/RecentNotes.tsx` - Component implementation
- `quartz/components/scripts/explorer.inline.ts` - Dynamic positioning logic
- `quartz.layout.ts` - Component configuration

### Navigation Components

#### PrevNext Component Enhancement

**Commits**: `5835a43`, `9bf0701`

Redesigned Previous/Next navigation to match Explorer's file ordering:

- **Tree-based Sorting**: Uses `FileTrieNode` structure matching Explorer
- **Custom Configuration**: Supports user-defined `sortFn`, `filterFn`, and `order`
- **Folder Page Exclusion**: Automatically skips all `index.md` files
- **Language-aware**: Filters navigation within current language context
- **Depth-first Traversal**: Maintains consistent ordering across all folder levels

**Key Files**:
- `quartz/components/PrevNext.tsx` - Refactored component
- `quartz/components/styles/prevNext.scss` - Styling with dotted separator

**Configuration Example**:
```typescript
Component.PrevNext({
  sortFn: (a, b) => a.displayName.localeCompare(b.displayName),
  filterFn: (node) => node.slugSegment !== "tags",
  order: ["filter", "sort"]
})
```

#### Mobile Table of Contents

**Commit**: `b157c4c`

Added mobile-optimized TOC positioning:

- **Responsive Display**: Shows TOC in `beforeBody` section on mobile devices
- **Typography Optimization**: Improved text rendering for mobile screens

### Folder Page Enhancements

**Commit**: `9bf0701`

Improved folder page (folder index) display:

- **Dual Content Display**: Shows both custom content AND file listing
  - Previously: either/or behavior (custom content OR file list)
  - Now: both displayed together
- **Visual Separator**: Added dotted line separator between content and file list
- **Consistent Styling**: Matches PrevNext component separator design

**Modified Files**:
- `quartz/components/pages/FolderContent.tsx` - Logic changes
- `quartz/components/styles/listPage.scss` - Added `.page-listing` separator styles

### UI/UX Improvements

#### Explorer Scroll Persistence

**Commit**: `9bf0701`

Fixed Explorer sidebar scroll position persistence:

- **Scroll Position Saving**: Stores scroll position on `prenav` event
- **Position Restoration**: Uses `requestAnimationFrame` for reliable restoration
- **Timing Fix**: Ensures DOM is fully rendered before applying scroll position

**Modified File**: `quartz/components/scripts/explorer.inline.ts`

#### Typography & Readability

**Commit**: `5ea018a`

Enhanced article readability:

- **Body Font Size**: Increased from default to `1.1rem`
- **Better Reading Experience**: More comfortable text size for long-form content

**Modified File**: `quartz/styles/base.scss`

### Theme Customizations

#### Baseline Theme Colors

**Commits**: `9bf0701`, `5ea018a`

Applied Obsidian Baseline theme's "Things" color scheme:

**Dark Mode**:
- Main content background: `rgb(36, 38, 42)` (#24262a)
- Sidebar background: `rgb(32, 34, 37)` (#202225)

**Light Mode**:
- Main content background: `white`
- Sidebar background: `rgb(245, 246, 248)` (#f5f6f8)

**Modified Files**:
- `quartz/styles/themes/_index.scss` - Main theme file
- `quartz/styles/themes/publish.css` - Consistency update

#### Favicon Update

**Commit**: `3713c87`

Updated site favicon with custom superhero image (square-cropped).

#### Darkmode Icon Fix

**Commit**: `f9374ae`

Enhanced darkmode toggle icon:

- **Consistent Sizing**: Fixed icon consistency issues
- **Hover Effect**: Improved hover interaction feedback

### Technical Infrastructure

#### Absolute Path Fix

**Commit**: `e8c3920`

Fixed favicon 404 errors during SPA navigation by using absolute paths.

### Component Export Updates

**Commit**: `9bf0701`

Added missing component exports:

- Exported `PageList` component from `quartz/components/index.ts`
- Enables proper folder page listing functionality

## Development Guidelines for This Instance

### When Working with Navigation Components

1. **Always use FileTrieNode**: Navigation components (PrevNext, Explorer) use tree-based structure
2. **Language filtering first**: Apply language filtering before sorting/filtering
3. **Test with multiple languages**: Verify functionality works for both `cn/` and `en/` content

### When Working with Layouts

1. **Check mobile responsiveness**: Many components have mobile-specific positioning
2. **Use Chrome DevTools MCP**: Verify layouts programmatically, not just visually
3. **Maintain visual consistency**: Use existing separator styles for new sections

### When Working with Themes

1. **Reference Baseline theme**: Color choices based on Obsidian Baseline "Things" scheme
2. **Differentiate backgrounds**: Main content vs sidebar colors are intentionally different
3. **Test both light/dark modes**: Ensure changes work in both themes
