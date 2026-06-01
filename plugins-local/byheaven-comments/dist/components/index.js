// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/scripts/waline.inline.ts
var waline_inline_default = `var l="quartz-preferred-lang";function c(){let n=navigator.language||navigator.userLanguage;return n&&n.toLowerCase().startsWith("zh")?"cn":"en"}function d(){return localStorage.getItem(l)??c()}var a=null,g=()=>document.documentElement.getAttribute("saved-theme")==="dark",o=n=>{if(!a)return;let t=n.detail.theme==="dark";a.update({dark:t})};document.addEventListener("nav",()=>{let n=document.querySelector(".waline");if(n){if(!document.querySelector('link[href*="waline.css"]')){let t=document.createElement("link");t.rel="stylesheet",t.href="https://unpkg.com/@waline/client@v3/dist/waline.css",document.head.appendChild(t)}import("https://unpkg.com/@waline/client@v3/dist/waline.js").then(t=>{let e=n.dataset,s=d()==="cn"?"zh-CN":"en",i={el:n,serverURL:e.serverUrl,path:e.path==="window.location.pathname"?window.location.pathname:e.path||window.location.pathname,lang:s,dark:g(),pageSize:e.pageSize?parseInt(e.pageSize):10,login:e.login||"enable",copyright:e.copyright==="1",pageview:!0};if(e.emoji)try{i.emoji=JSON.parse(e.emoji)}catch(r){console.warn("Failed to parse emoji config",r)}if(e.meta)try{i.meta=JSON.parse(e.meta)}catch(r){console.warn("Failed to parse meta config",r)}if(e.requiredMeta)try{i.requiredMeta=JSON.parse(e.requiredMeta)}catch(r){console.warn("Failed to parse requiredMeta config",r)}e.wordLimit&&(i.wordLimit=parseInt(e.wordLimit)),a=t.init(i)}).catch(t=>{console.error("Failed to load Waline:",t)}),document.addEventListener("themechange",o),window.addCleanup(()=>{document.removeEventListener("themechange",o),a&&(a.destroy(),a=null)})}});
`;
var l;
function S(n2) {
  return n2.children;
}
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

// src/components/Comments.tsx
function boolToStringBool(b2) {
  return b2 ? "1" : "0";
}
var Comments = (opts) => {
  const Component = ({ displayClass, fileData }) => {
    const commentsOverride = fileData.frontmatter?.comments;
    if (commentsOverride === false || commentsOverride === "false") {
      return /* @__PURE__ */ u2(S, {});
    }
    const slug = fileData.slug ?? "";
    const isRealFile = typeof fileData.filePath === "string" && fileData.filePath.endsWith(".md");
    if (slug.endsWith("/index") || !isRealFile) {
      return /* @__PURE__ */ u2(S, {});
    }
    const serverURL = opts?.serverURL ?? "";
    return /* @__PURE__ */ u2(
      "div",
      {
        class: classNames(displayClass, "waline"),
        "data-server-url": serverURL,
        "data-path": opts?.path ?? "window.location.pathname",
        "data-dark": String(opts?.dark ?? "auto"),
        "data-emoji": opts?.emoji ? JSON.stringify(opts.emoji) : "",
        "data-meta": opts?.meta ? JSON.stringify(opts.meta) : "",
        "data-required-meta": opts?.requiredMeta ? JSON.stringify(opts.requiredMeta) : "",
        "data-word-limit": opts?.wordLimit !== void 0 ? String(opts.wordLimit) : "",
        "data-page-size": String(opts?.pageSize ?? 10),
        "data-login": opts?.login ?? "enable",
        "data-copyright": boolToStringBool(opts?.copyright ?? true)
      }
    );
  };
  Component.afterDOMLoaded = waline_inline_default;
  return Component;
};
var Comments_default = Comments;

export { Comments_default as Comments };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map