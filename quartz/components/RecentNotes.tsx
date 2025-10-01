import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/recentNotes.inline"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: (f: QuartzPluginData) => {
    // Filter out homepage files
    const slug = f.slug || ""
    const isHomepage = slug === "cn" || slug === "en" || slug === "index" || slug === ""
    return !isHomepage
  },
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }

    // Filter all pages first
    const allPages = allFiles.filter(opts.filter)

    // Group pages by language BEFORE sorting
    const pagesByLang: Record<string, QuartzPluginData[]> = {}
    for (const page of allPages) {
      const slug = page.slug || ""
      let lang = "en" // default

      if (slug.startsWith("cn/")) {
        lang = "cn"
      } else if (slug.startsWith("en/")) {
        lang = "en"
      }

      if (!pagesByLang[lang]) {
        pagesByLang[lang] = []
      }
      pagesByLang[lang].push(page)
    }

    // Sort each language group and take top N
    const pages: QuartzPluginData[] = []
    for (const lang in pagesByLang) {
      const sortedPages = pagesByLang[lang].sort(opts.sort)
      pages.push(...sortedPages.slice(0, opts.limit))
    }

    // Sort merged results by date to maintain chronological order in HTML
    pages.sort(opts.sort)

    const remaining = Math.max(0, allPages.length - pages.length)
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <ul class="recent-ul">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const tags = page.frontmatter?.tags ?? []

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a href={`/${page.slug}`} class="internal" data-slug={page.slug}>
                        {title}
                      </a>
                    </h3>
                  </div>
                  {page.dates && (
                    <p class="meta">
                      <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                    </p>
                  )}
                  {opts.showTags && (
                    <ul class="tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
            </a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = style
  RecentNotes.afterDOMLoaded = script
  return RecentNotes
}) satisfies QuartzComponentConstructor
