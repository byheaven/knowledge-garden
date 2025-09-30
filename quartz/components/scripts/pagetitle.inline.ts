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

// Get user's preferred language
function getPreferredLanguage(): "cn" | "en" {
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null
  if (savedLang) {
    return savedLang
  }
  // If no saved preference, detect from browser
  return detectBrowserLanguage()
}

// Update page title link based on user's language preference
function updatePageTitleLink() {
  const pageTitleLink = document.querySelector(".page-title a") as HTMLAnchorElement
  if (!pageTitleLink) return

  // Get user's preferred language
  const preferredLang = getPreferredLanguage()

  // Point to the preferred language homepage
  // English homepage is at root /, Chinese homepage is at /cn/
  const targetPath = preferredLang === "en" ? "/" : "/cn/"
  pageTitleLink.setAttribute("href", targetPath)
}

document.addEventListener("nav", () => {
  updatePageTitleLink()
})