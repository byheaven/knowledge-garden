import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils/lang"
// @ts-expect-error - Inline script loaded as text by the tsup text-loader plugin
import languageSwitcherScript from "./scripts/languageswitcher.inline.ts"
import styles from "./styles/languageswitcher.scss"

const LanguageSwitcher: QuartzComponentConstructor = () => {
  const Switcher: QuartzComponent = (props: QuartzComponentProps) => {
    const displayClass = (props as { displayClass?: "mobile-only" | "desktop-only" }).displayClass
    return (
      <button
        class={classNames(displayClass, "language-switcher")}
        aria-label="Switch Language"
        type="button"
      >
        {/* Shown when the current language is English */}
        <span class="enIcon">EN</span>
        {/* Shown when the current language is Chinese */}
        <span class="cnIcon">中</span>
      </button>
    )
  }

  Switcher.beforeDOMLoaded = languageSwitcherScript as string
  Switcher.css = styles as string
  return Switcher
}

export default LanguageSwitcher
