const LANG_STORAGE_KEY = "quartz-preferred-lang"

// Update page title link based on saved language preference
function updatePageTitleLink() {
  const pageTitleLink = document.querySelector(".page-title a") as HTMLAnchorElement
  if (!pageTitleLink) return

  const currentPath = window.location.pathname

  // Only update if we're on a language page (cn/ or en/)
  const isOnLanguagePage = currentPath.startsWith("/cn/") || currentPath === "/cn" ||
                          currentPath.startsWith("/en/") || currentPath === "/en"

  if (!isOnLanguagePage) return

  // Get saved language preference
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as "cn" | "en" | null

  // If there's a saved preference, always point to the preferred language homepage
  if (savedLang) {
    pageTitleLink.setAttribute("href", `/${savedLang}/`)
  }
}

document.addEventListener("nav", () => {
  updatePageTitleLink()
})