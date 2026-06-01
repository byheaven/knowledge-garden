// afterDOMReady client script. Two responsibilities, both re-run on SPA "nav":
//   1. Set the `saved-lang` attribute on <html> so the LanguageSwitcher CSS
//      can show the EN / 中 glyph for the current preference.
//   2. Hide cross-language items inside any `.recent-notes` container, based
//      on the user's preferred language. v5's recent-notes component renders
//      no `data-slug`, so language is inferred from each link's resolved
//      pathname (anchors expose an absolute `.pathname` after the browser
//      resolves the relative href).
const LANG_STORAGE_KEY = "quartz-preferred-lang"

function detectBrowserLanguage(): "cn" | "en" {
  const browserLang =
    navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage
  if (browserLang && browserLang.toLowerCase().startsWith("zh")) {
    return "cn"
  }
  return "en"
}

function getPreferredLanguage(): "cn" | "en" {
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null
  return saved ?? detectBrowserLanguage()
}

function linkIsChinese(link: HTMLAnchorElement): boolean {
  // `link.pathname` is the browser-resolved absolute path of the relative href.
  const p = link.pathname
  return p === "/cn" || p.startsWith("/cn/") || p.includes("/cn/")
}

function filterRecentNotesByLanguage() {
  const preferredLang = getPreferredLanguage()
  const containers = document.querySelectorAll(".recent-notes")

  for (const container of containers) {
    const items = container.querySelectorAll(".recent-li")

    for (const item of items) {
      const link = item.querySelector("a.internal") as HTMLAnchorElement | null
      if (!link) continue

      const isChinese = linkIsChinese(link)
      const shouldShow = preferredLang === "cn" ? isChinese : !isChinese
      ;(item as HTMLElement).style.display = shouldShow ? "" : "none"
    }

    const visible = Array.from(items).filter(
      (item) => (item as HTMLElement).style.display !== "none",
    )
    ;(container as HTMLElement).style.display = visible.length === 0 ? "none" : ""
  }
}

function applyLanguageState() {
  document.documentElement.setAttribute("saved-lang", getPreferredLanguage())
  filterRecentNotesByLanguage()
}

applyLanguageState()
document.addEventListener("nav", applyLanguageState)
