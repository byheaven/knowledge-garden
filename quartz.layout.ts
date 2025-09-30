import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.Comments({
        provider: "waline",
        options: {
          serverURL: "https://discuss.byheaven.net",
          lang: "en",
          dark: "auto",
          login: "enable",
          emoji: ["https://unpkg.com/@waline/emojis@1.2.0/tw-emoji"],
        },
      }),
      condition: (page) => {
        // Show comments on all content pages except folder index pages
        const slug = page.fileData.slug || ""
        return !slug.endsWith("/index") && page.fileData.filePath?.endsWith(".md")
      },
    }),
  ],
  footer: Component.Footer(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.Socials({
      links: {
        GitHub: "https://github.com/byheaven",
        X: "https://x.com/byheaven0912",
        RSS: "https://byheaven.net/index.xml",
      },
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search() },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.Socials({
      links: {
        GitHub: "https://github.com/byheaven",
        X: "https://x.com/byheaven0912",
        RSS: "https://byheaven.net/index.xml",
      },
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search() },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
