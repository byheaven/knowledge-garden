import { getPreferredLanguage, detectBrowserLanguage } from "./util"

const LANG_STORAGE_KEY = "quartz-preferred-lang"

// Set the language attribute on document root
const userPrefLang = detectBrowserLanguage()
const currentLang = localStorage.getItem(LANG_STORAGE_KEY) ?? userPrefLang
document.documentElement.setAttribute("saved-lang", currentLang)

// Auto-redirect on root page based on preference or browser language
function autoRedirectOnRoot() {
  const path = window.location.pathname

  // Only handle root page
  if (path !== "/" && path !== "") return

  // Check if user has a saved preference
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null

  if (savedLang) {
    // If saved preference is Chinese, redirect to /cn
    if (savedLang === "cn") {
      window.location.href = "/cn"
    }
    // If saved preference is English, stay on root (no redirect needed)
  } else {
    // First visit: detect browser language
    const detectedLang = detectBrowserLanguage()
    localStorage.setItem(LANG_STORAGE_KEY, detectedLang)
    if (detectedLang === "cn") {
      window.location.href = "/cn"
    }
    // If English, stay on root (no redirect needed)
  }
}

// Handle language switch button click
function switchLanguage() {
  const currentLang = getPreferredLanguage()
  let newPath: string
  let newLang: "cn" | "en"

  // Switch to opposite language - always go to homepage
  if (currentLang === "cn") {
    newPath = "/"
    newLang = "en"
  } else {
    newPath = "/cn"
    newLang = "cn"
  }

  // Save new preference and update attribute
  localStorage.setItem(LANG_STORAGE_KEY, newLang)
  document.documentElement.setAttribute("saved-lang", newLang)

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