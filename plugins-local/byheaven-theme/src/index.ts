import type { QuartzTransformerPlugin } from "@quartz-community/types"
// SCSS compiled to a CSS string by the tsup scss-text-loader (typed via types/globals.d.ts).
import themeCSS from "./styles/theme.scss"

// LXGW WenKai GB Screen (Chinese body/heading font) + Fira Code (code font),
// served from jsdelivr exactly as the v4 fork injected them in Head.tsx. In v5,
// a remote stylesheet is a CSSResource with `inline: false`, which Quartz renders
// as a <link rel="stylesheet"> in <head>.
const LXGW_WENKAI_GB_CSS =
  "https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-gb-screen@1.0.6/font.min.css"
const FIRA_CODE_CSS = "https://cdn.jsdelivr.net/npm/@fontsource/fira-code@5.2.0/index.min.css"

/**
 * BYHEAVEN visual theme (transformer-only, runs once).
 *
 * Emits, via externalResources().css:
 *   - the compiled theme stylesheet inline (palette + Baseline callouts +
 *     fork-specific layout/spacing/font-override tweaks), and
 *   - the two web-font stylesheets as remote <link>s.
 *
 * `markdownPlugins` returns an empty list purely to satisfy Quartz's transformer
 * category validation (a transformer must expose at least one of textTransform /
 * markdownPlugins / htmlPlugins); the real work is in externalResources.
 */
export const BilingualTheme: QuartzTransformerPlugin = () => {
  return {
    name: "ByheavenTheme",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        css: [
          // Web fonts first so @font-face is registered before the theme CSS
          // that references the font families resolves.
          { content: LXGW_WENKAI_GB_CSS, inline: false },
          { content: FIRA_CODE_CSS, inline: false },
          { content: themeCSS as string, inline: true },
        ],
      }
    },
  }
}

export default BilingualTheme
