import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { Explorer, RecentNotes } from "./.quartz/plugins"

// --- BYHEAVEN bilingual override callbacks -----------------------------------
// These must be registered BEFORE loadQuartzConfig() so the option overrides are
// merged into the plugin instances when the layout is built.

// Explorer language pruning.
// The Explorer serializes filterFn via `.toString()` and re-hydrates it with
// `new Function` on the client, so this MUST be a self-contained pure function
// with no external closure references. It runs in the browser and reads the
// preferred language from localStorage, keeping only nodes whose top-level path
// segment matches the preferred language. Nodes that are not under cn/ or en/
// (e.g. the "tags" folder) are dropped, matching the default explorer behavior
// of hiding tags.
Explorer({
  filterFn: (node: { slugSegments?: string[]; slugSegment?: string }) => {
    const segs = node.slugSegments ?? []
    // The synthetic root has no segments — keep it so its children recurse.
    if (segs.length === 0) return true
    const top = segs[0] ?? node.slugSegment ?? ""
    const saved = localStorage.getItem("quartz-preferred-lang")
    let preferred = saved
    if (!preferred) {
      const bl =
        navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage
      preferred = bl && bl.toLowerCase().startsWith("zh") ? "cn" : "en"
    }
    // Keep only the matching language subtree; this drops the opposite-language
    // folder and any non-language top-level folder (e.g. tags).
    return top === preferred
  },
})

// Recent Notes: exclude the language homepages and the root index server-side.
// Per-language client filtering (showing only the visitor's language) is handled
// by the bilingual plugin's afterDOMReady client script, since the visitor's
// language is only known in the browser.
RecentNotes({
  filter: (f: { slug?: string }) => {
    const slug = f.slug ?? ""
    return slug !== "cn" && slug !== "en" && slug !== "index" && slug !== ""
  },
})
// -----------------------------------------------------------------------------

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
