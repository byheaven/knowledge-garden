import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils/lang"
import { resolveRelative } from "@quartz-community/utils/path"
import style from "./styles/prevNext.scss"

type Lang = "cn" | "en"

function langOf(slug: string): Lang | null {
  if (slug === "cn" || slug.startsWith("cn/")) return "cn"
  if (slug === "en" || slug.startsWith("en/")) return "en"
  // Slugs outside the cn/ and en/ trees (404, root index, tags) have no
  // language and never participate in same-language navigation.
  return null
}

/**
 * Order pages within one language the way the v4 trie did: alphabetically by
 * display title, using a locale matching the language so cn/en sort
 * consistently between server render and any client comparison.
 */
function makeComparator(lang: Lang) {
  const locale = lang === "cn" ? "zh-CN" : "en"
  return (a: QuartzPluginData, b: QuartzPluginData) => {
    const an = (a.frontmatter?.title ?? a.slug ?? "") as string
    const bn = (b.frontmatter?.title ?? b.slug ?? "") as string
    return an.localeCompare(bn, locale, { numeric: true, sensitivity: "base" })
  }
}

function isContentPage(slug: string): boolean {
  // A navigable article lives strictly under cn/ or en/, is not a folder index
  // page, and is not a tag page. This excludes the language homepages (cn / en),
  // the root index, the 404 page, and tags/* automatically.
  if (langOf(slug) === null) return false
  if (slug === "cn" || slug === "en") return false
  if (slug.endsWith("/index")) return false
  if (slug.includes("/tags/")) return false
  return true
}

const PrevNext: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, fileData } = props
    const displayClass = (props as { displayClass?: "mobile-only" | "desktop-only" }).displayClass
    const currentSlug = (fileData.slug ?? "") as string
    const currentLang = langOf(currentSlug)
    // Only content pages under cn/ or en/ get prev/next navigation.
    if (currentLang === null || !isContentPage(currentSlug)) return null

    // Same-language content pages only, ordered like the explorer.
    const pages = allFiles
      .filter((f): f is QuartzPluginData & { slug: string } => typeof f.slug === "string")
      .filter((f) => langOf(f.slug) === currentLang)
      .filter((f) => isContentPage(f.slug))
      .sort(makeComparator(currentLang))

    const currentIndex = pages.findIndex((p) => p.slug === currentSlug)
    if (currentIndex === -1) return null

    const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
    if (!prevPage && !nextPage) return null

    const prevTitle = (prevPage?.frontmatter?.title ?? "") as string
    const nextTitle = (nextPage?.frontmatter?.title ?? "") as string

    return (
      <nav class={classNames(displayClass, "prev-next")}>
        <div class="prev-next-container">
          {prevPage ? (
            <a
              href={resolveRelative(currentSlug as never, prevPage.slug as never)}
              class="prev"
              rel="prev"
            >
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

          {nextPage ? (
            <a
              href={resolveRelative(currentSlug as never, nextPage.slug as never)}
              class="next"
              rel="next"
            >
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

  Component.css = style as string
  return Component
}

export default PrevNext
