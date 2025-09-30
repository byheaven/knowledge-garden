const LANG_STORAGE_KEY = "quartz-preferred-lang"

// Detect browser language
function detectBrowserLanguage(): "cn" | "en" {
  const browserLang = navigator.language || (navigator as any).userLanguage
  // Check if language code starts with 'zh' (Chinese variants)
  if (browserLang && browserLang.toLowerCase().startsWith("zh")) {
    return "cn"
  }
  return "en"
}

// Get current language from URL
function getCurrentLanguage(): "cn" | "en" | null {
  const path = window.location.pathname
  if (path.startsWith("/cn/") || path === "/cn") return "cn"
  if (path.startsWith("/en/") || path === "/en") return "en"
  return null
}

// Auto-redirect on root page based on preference or browser language
function autoRedirectOnRoot() {
  const path = window.location.pathname

  // Only handle root page
  if (path !== "/" && path !== "") return

  // Check if user has a saved preference
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null

  if (savedLang) {
    // Redirect to saved preference
    window.location.href = `/${savedLang}`
  } else {
    // First visit: detect browser language
    const detectedLang = detectBrowserLanguage()
    localStorage.setItem(LANG_STORAGE_KEY, detectedLang)
    window.location.href = `/${detectedLang}`
  }
}

// Handle language switch button click
function switchLanguage() {
  const currentPath = window.location.pathname
  let newPath: string
  let newLang: "cn" | "en"

  // Detect current language and switch
  if (currentPath.startsWith("/cn/") || currentPath === "/cn") {
    // Switch from Chinese to English
    newPath = currentPath.replace(/^\/cn/, "/en")
    newLang = "en"
  } else if (currentPath.startsWith("/en/") || currentPath === "/en") {
    // Switch from English to Chinese
    newPath = currentPath.replace(/^\/en/, "/cn")
    newLang = "cn"
  } else {
    // At root or other path, go to opposite of saved preference
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null
    newLang = savedLang === "cn" ? "en" : "cn"
    newPath = `/${newLang}`
  }

  // Save new preference
  localStorage.setItem(LANG_STORAGE_KEY, newLang)

  // Navigate to new path
  window.location.href = newPath
}

// Run auto-redirect immediately on page load to avoid flash
autoRedirectOnRoot()

document.addEventListener("nav", () => {
  // Set up language switcher button
  for (const languageButton of document.getElementsByClassName("language-switcher")) {
    languageButton.addEventListener("click", switchLanguage)
    window.addCleanup(() => languageButton.removeEventListener("click", switchLanguage))
  }

  // Do NOT automatically update language preference based on current URL
  // Language preference should only change when user manually clicks the switch button
})