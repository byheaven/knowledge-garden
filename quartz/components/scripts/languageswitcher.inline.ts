document.addEventListener("nav", () => {
  const switchLanguage = () => {
    const currentPath = window.location.pathname
    let newPath: string

    // Detect current language and switch
    if (currentPath.startsWith("/cn/") || currentPath === "/cn") {
      // Switch from Chinese to English
      newPath = currentPath.replace(/^\/cn/, "/en")
    } else if (currentPath.startsWith("/en/") || currentPath === "/en") {
      // Switch from English to Chinese
      newPath = currentPath.replace(/^\/en/, "/cn")
    } else if (currentPath === "/" || currentPath === "") {
      // From root, default to Chinese
      newPath = "/cn"
    } else {
      // If not in /cn or /en, prepend /cn
      newPath = "/cn" + currentPath
    }

    // Navigate to new path
    window.location.href = newPath
  }

  for (const languageButton of document.getElementsByClassName("language-switcher")) {
    languageButton.addEventListener("click", switchLanguage)
    window.addCleanup(() => languageButton.removeEventListener("click", switchLanguage))
  }
})