import type { QuartzTransformerPlugin } from "@quartz-community/types"
// @ts-expect-error - Inline script loaded as text by the tsup text-loader plugin
import headRedirect from "./headRedirect.inline.ts"
// @ts-expect-error - Inline script loaded as text by the tsup text-loader plugin
import langClient from "./langClient.inline.ts"

/**
 * BYHEAVEN bilingual head injector (transformer-only, runs once).
 *
 *   - `headRedirect` is emitted as an inline beforeDOMReady JSResource. Quartz
 *     renders beforeDOMReady inline scripts directly inside <head>, so it runs
 *     before any content paints: detects the preferred language, persists it,
 *     and redirects the homepage to "/cn" when the preference is Chinese.
 *   - `langClient` is emitted as an inline afterDOMReady JSResource: sets the
 *     `saved-lang` attribute on <html> (driving the switcher glyph) and hides
 *     cross-language items in any Recent Notes list. Re-runs on every SPA nav.
 *
 * `markdownPlugins` returns an empty list purely to satisfy Quartz's transformer
 * category validation (a transformer must expose at least one of textTransform /
 * markdownPlugins / htmlPlugins); the real work is in externalResources.
 */
export const BilingualHead: QuartzTransformerPlugin = () => {
  return {
    name: "BilingualHead",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        js: [
          {
            loadTime: "beforeDOMReady",
            contentType: "inline",
            script: headRedirect as string,
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: langClient as string,
          },
        ],
      }
    },
  }
}

export default BilingualHead
