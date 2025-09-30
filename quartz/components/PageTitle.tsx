import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// @ts-ignore
import script from "./scripts/pagetitle.inline"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const slug = fileData.slug || ""
  const baseDir = pathToRoot(slug)

  // Detect if page is under a language prefix and link directly to language homepage
  let homeLink: string
  if (slug.startsWith("cn/") || slug === "cn") {
    // Use absolute path to avoid relative path issues on language homepage
    homeLink = "/cn/"
  } else if (slug.startsWith("en/") || slug === "en") {
    // Use absolute path to avoid relative path issues on language homepage
    homeLink = "/en/"
  } else {
    homeLink = baseDir
  }

  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={homeLink}>{title}</a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`

PageTitle.afterDOMLoaded = script

export default (() => PageTitle) satisfies QuartzComponentConstructor
