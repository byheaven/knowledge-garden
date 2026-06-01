// Client script for the BYHEAVEN Waline comments component.
//
// Ported from the v4 fork's `quartz/components/scripts/waline.inline.ts`.
// Lazy-loads @waline/client (CSS + JS from unpkg) on each SPA navigation when a
// `.waline` mount point is present, follows the bilingual preferred-language for
// the comment UI (zh-CN / en), tracks pageviews, and re-themes on dark-mode
// toggle. Cleans up listeners + the Waline instance on navigation away.

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

type WalineInstance = {
  update: (options?: Record<string, unknown>) => void
  destroy: () => void
}

type WalineOptions = {
  el: string | HTMLElement
  serverURL: string
  path?: string
  lang?: string
  emoji?: string[]
  dark?: boolean | "auto" | string
  meta?: string[]
  requiredMeta?: string[]
  wordLimit?: number
  pageSize?: number
  login?: "enable" | "disable" | "force"
  copyright?: boolean
  pageview?: boolean
}

type WalineElement = Omit<HTMLElement, "dataset"> & {
  dataset: DOMStringMap & {
    serverUrl: string
    path: string
    dark: string
    emoji: string
    meta: string
    requiredMeta: string
    wordLimit: string
    pageSize: string
    login: string
    copyright: string
  }
}

declare global {
  interface Window {
    Waline?: {
      init: (options: WalineOptions) => WalineInstance
    }
  }
}

let walineInstance: WalineInstance | null = null

const getTheme = (): boolean => {
  const savedTheme = document.documentElement.getAttribute("saved-theme")
  return savedTheme === "dark"
}

const updateTheme = (e: CustomEventMap["themechange"]) => {
  if (!walineInstance) return
  const isDark = e.detail.theme === "dark"
  walineInstance.update({ dark: isDark })
}

document.addEventListener("nav", () => {
  const walineContainer = document.querySelector(".waline") as WalineElement | null
  if (!walineContainer) {
    return
  }

  // Load CSS once.
  if (!document.querySelector('link[href*="waline.css"]')) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/@waline/client@v3/dist/waline.css"
    document.head.appendChild(link)
  }

  import("https://unpkg.com/@waline/client@v3/dist/waline.js")
    .then((module: { init: (options: WalineOptions) => WalineInstance }) => {
      const dataset = walineContainer.dataset

      // Comment UI language follows the bilingual preferred language.
      const preferredLang = getPreferredLanguage()
      const walineLang = preferredLang === "cn" ? "zh-CN" : "en"

      const options: WalineOptions = {
        el: walineContainer,
        serverURL: dataset.serverUrl,
        path:
          dataset.path === "window.location.pathname"
            ? window.location.pathname
            : dataset.path || window.location.pathname,
        lang: walineLang,
        dark: getTheme(),
        pageSize: dataset.pageSize ? parseInt(dataset.pageSize) : 10,
        login: (dataset.login as "enable" | "disable" | "force") || "enable",
        copyright: dataset.copyright === "1",
        pageview: true,
      }

      if (dataset.emoji) {
        try {
          options.emoji = JSON.parse(dataset.emoji)
        } catch (e) {
          console.warn("Failed to parse emoji config", e)
        }
      }

      if (dataset.meta) {
        try {
          options.meta = JSON.parse(dataset.meta)
        } catch (e) {
          console.warn("Failed to parse meta config", e)
        }
      }

      if (dataset.requiredMeta) {
        try {
          options.requiredMeta = JSON.parse(dataset.requiredMeta)
        } catch (e) {
          console.warn("Failed to parse requiredMeta config", e)
        }
      }

      if (dataset.wordLimit) {
        options.wordLimit = parseInt(dataset.wordLimit)
      }

      walineInstance = module.init(options)
    })
    .catch((error) => {
      console.error("Failed to load Waline:", error)
    })

  document.addEventListener("themechange", updateTheme)
  window.addCleanup(() => {
    document.removeEventListener("themechange", updateTheme)
    if (walineInstance) {
      walineInstance.destroy()
      walineInstance = null
    }
  })
})
