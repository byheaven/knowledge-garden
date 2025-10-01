import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/prevNext.scss"
import { classNames } from "../util/lang"
import { FileTrieNode } from "../util/fileTrie"
import { FullSlug } from "../util/path"

// Configuration options for PrevNext (matches Explorer's options)
export interface Options {
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  order: ("filter" | "sort")[]
}

// Default options (matches Explorer's default sorting)
const defaultOptions: Options = {
  sortFn: (a, b) => {
    // Sort order: folders first, then files. Sort folders and files alphabetically
    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    if (!a.isFolder && b.isFolder) {
      return 1
    } else {
      return -1
    }
  },
  filterFn: (node) => node.slugSegment !== "tags",
  order: ["filter", "sort"],
}

export default ((userOpts?: Partial<Options>) => {
  const PrevNext: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Merge user options with defaults
    const opts = { ...defaultOptions, ...userOpts }

    // Determine current language based on slug
    const currentSlug = fileData.slug || ""
    let currentLang: "cn" | "en" = "en"

    if (currentSlug === "cn" || currentSlug.startsWith("cn/")) {
      currentLang = "cn"
    }

    // Build FileTrieNode tree from allFiles (same as Explorer)
    const entries = allFiles
      .filter((f) => f.slug != null)
      .map((f) => [f.slug!, f] as [FullSlug, QuartzPluginData])

    const trie = FileTrieNode.fromEntries(entries)

    // Apply language filtering: extract cn/ or en/ subtree
    const langFolder = trie.children.find(
      (child) => child.isFolder && child.slugSegment === currentLang
    )

    if (langFolder) {
      trie.children = langFolder.children
    } else {
      // If no language folder found, return null (no navigation)
      return null
    }

    // Apply user-configured filter and sort operations
    for (const fn of opts.order) {
      switch (fn) {
        case "filter":
          trie.filter(opts.filterFn)
          break
        case "sort":
          trie.sort(opts.sortFn)
          break
      }
    }

    // Get flattened list via depth-first traversal
    const allEntries = trie.entries()

    // Filter out folder pages (index files) and extract slugs
    const pages = allEntries
      .filter(([slug, node]) => {
        // Keep only files (not folders) and exclude index files
        return !node.isFolder && !slug.endsWith("/index") && slug !== "index"
      })
      .map(([slug]) => slug)

    // Find current page index
    const currentIndex = pages.findIndex((slug) => slug === currentSlug)

    // If current page not found, don't render navigation
    if (currentIndex === -1) {
      return null
    }

    const prevSlug = currentIndex > 0 ? pages[currentIndex - 1] : null
    const nextSlug = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

    // Don't render if there's no prev or next
    if (!prevSlug && !nextSlug) {
      return null
    }

    // Get page data for titles
    const prevPage = prevSlug ? allFiles.find((f) => f.slug === prevSlug) : null
    const nextPage = nextSlug ? allFiles.find((f) => f.slug === nextSlug) : null

    const prevTitle = prevPage?.frontmatter?.title ?? ""
    const nextTitle = nextPage?.frontmatter?.title ?? ""

    return (
      <nav class={classNames(displayClass, "prev-next")}>
        <div class="prev-next-container">
          {prevSlug ? (
            <a href={`/${prevSlug}`} class="prev" rel="prev">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <div class="link-content">
                <span class="link-label">Previous</span>
                <span class="link-title">{prevTitle}</span>
              </div>
            </a>
          ) : (
            <div class="spacer"></div>
          )}

          {nextSlug ? (
            <a href={`/${nextSlug}`} class="next" rel="next">
              <div class="link-content">
                <span class="link-label">Next</span>
                <span class="link-title">{nextTitle}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          ) : (
            <div class="spacer"></div>
          )}
        </div>
      </nav>
    )
  }

  PrevNext.css = style
  return PrevNext
}) satisfies QuartzComponentConstructor
