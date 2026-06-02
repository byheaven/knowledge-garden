// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/scripts/languageswitcher.inline.ts
var languageswitcher_inline_default = 'var a="quartz-preferred-lang";function o(){let e=navigator.language||navigator.userLanguage;return e&&e.toLowerCase().startsWith("zh")?"cn":"en"}function r(){return localStorage.getItem(a)??o()}document.documentElement.setAttribute("saved-lang",r());function t(){let n=r()==="cn"?"en":"cn",c=n==="cn"?"/cn":"/";localStorage.setItem(a,n),document.documentElement.setAttribute("saved-lang",n),window.location.href=c}document.addEventListener("nav",()=>{for(let e of document.getElementsByClassName("language-switcher"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t))});\n';

// src/components/styles/languageswitcher.scss
var languageswitcher_default = ".language-switcher {\n  cursor: pointer;\n  padding: 0;\n  position: relative;\n  background: none;\n  border: none;\n  width: 24px;\n  height: 24px;\n  margin: 0;\n  text-align: inherit;\n  flex-shrink: 0;\n}\n.language-switcher span {\n  position: absolute;\n  width: 24px;\n  height: 24px;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--darkgray);\n  transition: all 0.2s ease;\n}\n\nbody button.language-switcher:hover span {\n  color: var(--secondary);\n  transform: scale(1.1);\n}\n\n/* Show Chinese glyph when current language is Chinese */\n:root[saved-lang=cn] .language-switcher > .enIcon {\n  display: none;\n}\n:root[saved-lang=cn] .language-switcher > .cnIcon {\n  display: flex;\n}\n\n/* Show English glyph when current language is English (default) */\n:root .language-switcher > .enIcon {\n  display: flex;\n}\n:root .language-switcher > .cnIcon {\n  display: none;\n}";
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/LanguageSwitcher.tsx
var LanguageSwitcher = () => {
  const Switcher = (props) => {
    const displayClass = props.displayClass;
    return /* @__PURE__ */ u2(
      "button",
      {
        class: classNames(displayClass, "language-switcher"),
        "aria-label": "Switch Language",
        type: "button",
        children: [
          /* @__PURE__ */ u2("span", { class: "enIcon", children: "EN" }),
          /* @__PURE__ */ u2("span", { class: "cnIcon", children: "\u4E2D" })
        ]
      }
    );
  };
  Switcher.beforeDOMLoaded = languageswitcher_inline_default;
  Switcher.css = languageswitcher_default;
  return Switcher;
};
var LanguageSwitcher_default = LanguageSwitcher;

// node_modules/@quartz-community/utils/dist/path.js
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s2, suffix) {
  return s2 === suffix || s2.endsWith("/" + suffix);
}
function trimSuffix(s2, suffix) {
  if (endsWith(s2, suffix)) {
    s2 = s2.slice(0, -suffix.length);
  }
  return s2;
}
function stripSlashes(s2, onlyStripPrefix) {
  if (s2.startsWith("/")) {
    s2 = s2.substring(1);
  }
  if (!onlyStripPrefix && s2.endsWith("/")) {
    s2 = s2.slice(0, -1);
  }
  return s2;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}

// src/components/styles/prevNext.scss
var prevNext_default = ".prev-next {\n  margin: 1.5rem 0 2rem;\n  padding-top: 1rem;\n  border-top: 1px dotted var(--lightgray);\n}\n\n.prev-next-container {\n  display: flex;\n  justify-content: space-between;\n  gap: 2rem;\n  flex-wrap: wrap;\n}\n@media (max-width: 600px) {\n  .prev-next-container {\n    flex-direction: column;\n    gap: 1rem;\n  }\n}\n\n.prev-next a {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 0.75rem;\n  text-decoration: none;\n  color: var(--gray);\n  transition: color 0.2s ease;\n  border-radius: 4px;\n}\n@media (max-width: 600px) {\n  .prev-next a {\n    padding: 0.5rem;\n  }\n}\n.prev-next a:hover {\n  color: var(--secondary);\n}\n.prev-next a svg {\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  opacity: 0.6;\n  transition: opacity 0.2s ease;\n}\n.prev-next a:hover svg {\n  opacity: 1;\n}\n\n.prev-next a.prev {\n  justify-content: flex-start;\n}\n.prev-next a.prev .link-content {\n  text-align: left;\n}\n\n.prev-next a.next {\n  justify-content: flex-end;\n}\n.prev-next a.next .link-content {\n  text-align: right;\n}\n\n.prev-next .link-content {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  min-width: 0;\n  flex: 1;\n}\n\n.prev-next .link-label {\n  font-size: 0.75rem;\n  color: var(--gray);\n  font-weight: 400;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  opacity: 0.7;\n}\n\n.prev-next .link-title {\n  font-size: 0.95rem;\n  color: inherit;\n  font-weight: 400;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media (max-width: 600px) {\n  .prev-next .link-title {\n    white-space: normal;\n    overflow: visible;\n  }\n}";

// src/components/PrevNext.tsx
function langOf(slug2) {
  if (slug2 === "cn" || slug2.startsWith("cn/")) return "cn";
  if (slug2 === "en" || slug2.startsWith("en/")) return "en";
  return null;
}
function makeComparator(lang) {
  const locale = lang === "cn" ? "zh-CN" : "en";
  const collate = (x2, y2) => x2.localeCompare(y2, locale, { numeric: true, sensitivity: "base" });
  const segmentsOf = (slug2) => slug2.split("/").slice(1);
  return (a2, b2) => {
    const aSeg = segmentsOf(a2.slug);
    const bSeg = segmentsOf(b2.slug);
    const aTitle = a2.frontmatter?.title ?? a2.slug ?? "";
    const bTitle = b2.frontmatter?.title ?? b2.slug ?? "";
    const minLen = Math.min(aSeg.length, bSeg.length);
    for (let i2 = 0; i2 < minLen; i2++) {
      const aIsLeaf = i2 === aSeg.length - 1;
      const bIsLeaf = i2 === bSeg.length - 1;
      if (aIsLeaf !== bIsLeaf) {
        return aIsLeaf ? 1 : -1;
      }
      const aName = aIsLeaf ? aTitle : aSeg[i2];
      const bName = bIsLeaf ? bTitle : bSeg[i2];
      const cmp = collate(aName, bName);
      if (cmp !== 0) return cmp;
    }
    return aSeg.length - bSeg.length;
  };
}
function isContentPage(slug2) {
  if (langOf(slug2) === null) return false;
  if (slug2 === "cn" || slug2 === "en") return false;
  if (slug2.endsWith("/index")) return false;
  if (slug2.includes("/tags/")) return false;
  return true;
}
var PrevNext = () => {
  const Component = (props) => {
    const { allFiles, fileData } = props;
    const displayClass = props.displayClass;
    const currentSlug = fileData.slug ?? "";
    const currentLang = langOf(currentSlug);
    if (currentLang === null || !isContentPage(currentSlug)) return null;
    const pages = allFiles.filter((f3) => typeof f3.slug === "string").filter((f3) => langOf(f3.slug) === currentLang).filter((f3) => isContentPage(f3.slug)).sort(makeComparator(currentLang));
    const currentIndex = pages.findIndex((p2) => p2.slug === currentSlug);
    if (currentIndex === -1) return null;
    const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;
    if (!prevPage && !nextPage) return null;
    const prevTitle = prevPage?.frontmatter?.title ?? "";
    const nextTitle = nextPage?.frontmatter?.title ?? "";
    return /* @__PURE__ */ u2("nav", { class: classNames(displayClass, "prev-next"), children: /* @__PURE__ */ u2("div", { class: "prev-next-container", children: [
      prevPage ? /* @__PURE__ */ u2(
        "a",
        {
          href: resolveRelative(currentSlug, prevPage.slug),
          class: "prev",
          rel: "prev",
          children: [
            /* @__PURE__ */ u2(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                children: /* @__PURE__ */ u2("polyline", { points: "15 18 9 12 15 6" })
              }
            ),
            /* @__PURE__ */ u2("div", { class: "link-content", children: [
              /* @__PURE__ */ u2("span", { class: "link-label", children: "Previous" }),
              /* @__PURE__ */ u2("span", { class: "link-title", children: prevTitle })
            ] })
          ]
        }
      ) : /* @__PURE__ */ u2("div", { class: "spacer" }),
      nextPage ? /* @__PURE__ */ u2(
        "a",
        {
          href: resolveRelative(currentSlug, nextPage.slug),
          class: "next",
          rel: "next",
          children: [
            /* @__PURE__ */ u2("div", { class: "link-content", children: [
              /* @__PURE__ */ u2("span", { class: "link-label", children: "Next" }),
              /* @__PURE__ */ u2("span", { class: "link-title", children: nextTitle })
            ] }),
            /* @__PURE__ */ u2(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                children: /* @__PURE__ */ u2("polyline", { points: "9 18 15 12 9 6" })
              }
            )
          ]
        }
      ) : /* @__PURE__ */ u2("div", { class: "spacer" })
    ] }) });
  };
  Component.css = prevNext_default;
  return Component;
};
var PrevNext_default = PrevNext;

// src/components/styles/socials.scss
var socials_default = ".socials {\n  display: flex;\n  flex-direction: row;\n  gap: 1rem;\n  align-items: center;\n  margin: 0 !important;\n  padding: 0 !important;\n  line-height: 1 !important;\n}\n.socials a {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.7;\n  transition: opacity 0.2s ease;\n  line-height: 1 !important;\n}\n.socials a:hover {\n  opacity: 1;\n}\n.socials a svg {\n  display: block;\n}";

// src/components/Socials.tsx
var icons = {
  GitHub: /* @__PURE__ */ u2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [
        /* @__PURE__ */ u2("path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }),
        /* @__PURE__ */ u2("path", { d: "M9 18c-4.51 2-5-2-7-2" })
      ]
    }
  ),
  X: /* @__PURE__ */ u2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [
        /* @__PURE__ */ u2("path", { d: "M4 4l11.733 16h4.267l-11.733 -16z" }),
        /* @__PURE__ */ u2("path", { d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" })
      ]
    }
  ),
  Email: /* @__PURE__ */ u2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [
        /* @__PURE__ */ u2("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
        /* @__PURE__ */ u2("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
      ]
    }
  ),
  RSS: /* @__PURE__ */ u2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [
        /* @__PURE__ */ u2("path", { d: "M4 11a9 9 0 0 1 9 9" }),
        /* @__PURE__ */ u2("path", { d: "M4 4a16 16 0 0 1 16 16" }),
        /* @__PURE__ */ u2("circle", { cx: "5", cy: "19", r: "1" })
      ]
    }
  )
};
var Socials = (opts) => {
  const Component = (props) => {
    const displayClass = props.displayClass;
    const links = opts?.links ?? {};
    return /* @__PURE__ */ u2("div", { class: classNames(displayClass, "socials"), children: Object.entries(links).map(([text, link]) => /* @__PURE__ */ u2("a", { href: link, "aria-label": text, target: "_blank", rel: "noopener noreferrer", children: icons[text] || text })) });
  };
  Component.css = socials_default;
  return Component;
};
var Socials_default = Socials;

export { LanguageSwitcher_default as LanguageSwitcher, PrevNext_default as PrevNext, Socials_default as Socials };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map