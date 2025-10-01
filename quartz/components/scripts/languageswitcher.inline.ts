import { getPreferredLanguage, detectBrowserLanguage } from "./util"

const LANG_STORAGE_KEY = "quartz-preferred-lang"

// Set the language attribute on document root
// Note: Initial language detection and redirect is now handled in Head component
const userPrefLang = detectBrowserLanguage()
const currentLang = localStorage.getItem(LANG_STORAGE_KEY) ?? userPrefLang
document.documentElement.setAttribute("saved-lang", currentLang)

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

// Note: Auto-redirect logic moved to Head component for earlier execution
// This avoids page flash by redirecting before any content renders

document.addEventListener("nav", () => {
  // Set up language switcher button
  for (const languageButton of document.getElementsByClassName("language-switcher")) {
    languageButton.addEventListener("click", switchLanguage)
    window.addCleanup(() => languageButton.removeEventListener("click", switchLanguage))
  }

  // Do NOT automatically update language preference based on current URL
  // Language preference should only change when user manually clicks the switch button
})