// Client script for the LanguageSwitcher button.
// On click, flips the preferred language, persists it, and navigates to the
// opposite homepage ("/" for en, "/cn" for cn). The initial `saved-lang`
// attribute (for the glyph) is set by the plugin's shared langClient script.
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

// Ensure the attribute is set as early as this script runs too (idempotent).
document.documentElement.setAttribute("saved-lang", getPreferredLanguage())

function switchLanguage() {
  const currentLang = getPreferredLanguage()
  const newLang: "cn" | "en" = currentLang === "cn" ? "en" : "cn"
  const newPath = newLang === "cn" ? "/cn" : "/"

  localStorage.setItem(LANG_STORAGE_KEY, newLang)
  document.documentElement.setAttribute("saved-lang", newLang)
  window.location.href = newPath
}

document.addEventListener("nav", () => {
  for (const button of document.getElementsByClassName("language-switcher")) {
    button.addEventListener("click", switchLanguage)
    window.addCleanup(() => button.removeEventListener("click", switchLanguage))
  }
})
