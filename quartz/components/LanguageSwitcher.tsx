// @ts-ignore
import languageSwitcherScript from "./scripts/languageswitcher.inline"
import styles from "./styles/languageswitcher.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const LanguageSwitcher: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "language-switcher")} aria-label="Switch Language">
      {/* English text label - shown when current language is English */}
      <span class="enIcon">EN</span>
      {/* Chinese text label - shown when current language is Chinese */}
      <span class="cnIcon">中</span>
    </button>
  )
}

LanguageSwitcher.beforeDOMLoaded = languageSwitcherScript
LanguageSwitcher.css = styles

export default (() => LanguageSwitcher) satisfies QuartzComponentConstructor