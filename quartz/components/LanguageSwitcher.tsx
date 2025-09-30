// @ts-ignore
import languageSwitcherScript from "./scripts/languageswitcher.inline"
import styles from "./styles/languageswitcher.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const LanguageSwitcher: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "language-switcher")} aria-label="Switch Language">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="languageIcon"
      >
        <title>Switch Language</title>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </button>
  )
}

LanguageSwitcher.beforeDOMLoaded = languageSwitcherScript
LanguageSwitcher.css = styles

export default (() => LanguageSwitcher) satisfies QuartzComponentConstructor