// Runs in <head>, BEFORE the DOM renders (loadTime: beforeDOMReady).
// Detects the preferred language, persists it, and redirects the homepage
// ("/" or "") to "/cn" when the preference is Chinese. Mirrors the v4
// Head.tsx inline redirect so the English homepage stays at "/" and the
// Chinese homepage at "/cn" with zero content flash.
;(function () {
  const path = window.location.pathname
  if (path !== "/" && path !== "") return

  const LANG_KEY = "quartz-preferred-lang"
  const savedLang = localStorage.getItem(LANG_KEY)

  if (savedLang) {
    if (savedLang === "cn") window.location.replace("/cn")
  } else {
    const browserLang =
      navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage
    const detectedLang = browserLang && browserLang.toLowerCase().startsWith("zh") ? "cn" : "en"
    localStorage.setItem(LANG_KEY, detectedLang)
    if (detectedLang === "cn") window.location.replace("/cn")
  }
})()
