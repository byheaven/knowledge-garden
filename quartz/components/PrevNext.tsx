import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/prevNext.scss"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"

interface Options {
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const PrevNext: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }

    // Determine current language based on slug
    const currentSlug = fileData.slug || ""
    let currentLang: "cn" | "en" = "en"

    if (currentSlug === "cn" || currentSlug.startsWith("cn/")) {
      currentLang = "cn"
    }

    // Filter files based on language
    const languageFilter = (f: QuartzPluginData) => {
      const slug = f.slug || ""

      // Filter out homepage files
      const isHomepage = slug === "cn" || slug === "en" || slug === "index" || slug === ""
      if (isHomepage) return false

      // Filter by language
      if (currentLang === "cn") {
        return slug.startsWith("cn/")
      } else {
        return slug.startsWith("en/") || slug === "index"
      }
    }

    // Get filtered and sorted pages
    const pages = allFiles.filter(languageFilter).sort(opts.sort)

    // Find current page index
    const currentIndex = pages.findIndex(p => p.slug === currentSlug)

    // If current page not found, don't render navigation
    if (currentIndex === -1) {
      return null
    }

    const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

    // Don't render if there's no prev or next
    if (!prevPage && !nextPage) {
      return null
    }

    const prevTitle = prevPage?.frontmatter?.title ?? ""
    const nextTitle = nextPage?.frontmatter?.title ?? ""

    return (
      <nav class={classNames(displayClass, "prev-next")}>
        <div class="prev-next-container">
          {prevPage ? (
            <a href={`/${prevPage.slug}`} class="prev" rel="prev">
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
            <a href={`/${nextPage.slug}`} class="next" rel="next">
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
