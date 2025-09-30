import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import giscusScript from "./scripts/comments.inline"
// @ts-ignore
import walineScript from "./scripts/waline.inline"

type GiscusOptions = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl?: string
    lightTheme?: string
    darkTheme?: string
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: "top" | "bottom"
    lang?: string
  }
}

type WalineOptions = {
  provider: "waline"
  options: {
    serverURL: string
    path?: string
    lang?: string
    locale?: Record<string, string>
    emoji?: string[]
    dark?: boolean | "auto"
    meta?: string[]
    requiredMeta?: string[]
    wordLimit?: number
    pageSize?: number
    login?: "enable" | "disable" | "force"
    copyright?: boolean
    pageview?: boolean
  }
}

type Options = GiscusOptions | WalineOptions

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    if (opts.provider === "giscus") {
      return (
        <div
          class={classNames(displayClass, "giscus")}
          data-repo={opts.options.repo}
          data-repo-id={opts.options.repoId}
          data-category={opts.options.category}
          data-category-id={opts.options.categoryId}
          data-mapping={opts.options.mapping ?? "url"}
          data-strict={boolToStringBool(opts.options.strict ?? true)}
          data-reactions-enabled={boolToStringBool(opts.options.reactionsEnabled ?? true)}
          data-input-position={opts.options.inputPosition ?? "bottom"}
          data-light-theme={opts.options.lightTheme ?? "light"}
          data-dark-theme={opts.options.darkTheme ?? "dark"}
          data-theme-url={
            opts.options.themeUrl ?? `https://${cfg.baseUrl ?? "example.com"}/static/giscus`
          }
          data-lang={opts.options.lang ?? "en"}
        ></div>
      )
    } else if (opts.provider === "waline") {
      return (
        <div
          class={classNames(displayClass, "waline")}
          data-server-url={opts.options.serverURL}
          data-path={opts.options.path ?? "window.location.pathname"}
          data-lang={opts.options.lang ?? "en"}
          data-dark={opts.options.dark ?? "auto"}
          data-emoji={opts.options.emoji ? JSON.stringify(opts.options.emoji) : ""}
          data-meta={opts.options.meta ? JSON.stringify(opts.options.meta) : ""}
          data-required-meta={opts.options.requiredMeta ? JSON.stringify(opts.options.requiredMeta) : ""}
          data-word-limit={opts.options.wordLimit}
          data-page-size={opts.options.pageSize ?? 10}
          data-login={opts.options.login ?? "enable"}
          data-copyright={boolToStringBool(opts.options.copyright ?? true)}
        ></div>
      )
    }

    return <></>
  }

  Comments.afterDOMLoaded = opts.provider === "giscus" ? giscusScript : walineScript

  return Comments
}) satisfies QuartzComponentConstructor<Options>
