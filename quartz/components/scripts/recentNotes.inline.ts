import { getPreferredLanguage } from "./util"

function filterRecentNotesByLanguage() {
  const preferredLang = getPreferredLanguage()
  const recentNotesContainers = document.querySelectorAll(".recent-notes")

  for (const container of recentNotesContainers) {
    const items = container.querySelectorAll(".recent-li")

    for (const item of items) {
      const link = item.querySelector("a.internal") as HTMLAnchorElement
      if (!link) continue

      // Use data-slug attribute to determine the original target
      const slug = link.getAttribute("data-slug")
      if (!slug) continue

      let shouldShow = false

      // Determine visibility based on user preference using original slug
      const isChinese = slug.startsWith("cn/") || slug === "cn" || slug.includes("/cn/")

      if (preferredLang === "en") {
        // English mode: hide Chinese files
        shouldShow = !isChinese
      } else {
        // Chinese mode: only show Chinese files
        shouldShow = isChinese
      }

      if (shouldShow) {
        ;(item as HTMLElement).style.display = ""
      } else {
        ;(item as HTMLElement).style.display = "none"
      }
    }

    // Hide the container if all items are hidden
    const visibleItems = Array.from(items).filter(
      (item) => (item as HTMLElement).style.display !== "none",
    )
    if (visibleItems.length === 0) {
      ;(container as HTMLElement).style.display = "none"
    } else {
      ;(container as HTMLElement).style.display = ""
    }
  }
}

// Run filter immediately on script load (after DOM is ready)
filterRecentNotesByLanguage()

document.addEventListener("nav", () => {
  filterRecentNotesByLanguage()
})
