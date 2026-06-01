// src/headRedirect.inline.ts
var headRedirect_inline_default = '(function(){let n=window.location.pathname;if(n!=="/"&&n!=="")return;let a="quartz-preferred-lang",e=localStorage.getItem(a);if(e)e==="cn"&&window.location.replace("/cn");else{let t=navigator.language||navigator.userLanguage,o=t&&t.toLowerCase().startsWith("zh")?"cn":"en";localStorage.setItem(a,o),o==="cn"&&window.location.replace("/cn")}})();\n';

// src/langClient.inline.ts
var langClient_inline_default = 'var g="quartz-preferred-lang";function d(){let e=navigator.language||navigator.userLanguage;return e&&e.toLowerCase().startsWith("zh")?"cn":"en"}function c(){return localStorage.getItem(g)??d()}function f(e){let n=e.pathname;return n==="/cn"||n.startsWith("/cn/")||n.includes("/cn/")}function L(){let e=c(),n=document.querySelectorAll(".recent-notes");for(let a of n){let o=a.querySelectorAll(".recent-li");for(let t of o){let r=t.querySelector("a.internal");if(!r)continue;let s=f(r),u=e==="cn"?s:!s;t.style.display=u?"":"none"}let i=Array.from(o).filter(t=>t.style.display!=="none");a.style.display=i.length===0?"none":""}}function l(){document.documentElement.setAttribute("saved-lang",c()),L()}l();document.addEventListener("nav",l);\n';

// src/index.ts
var BilingualHead = () => {
  return {
    name: "BilingualHead",
    markdownPlugins() {
      return [];
    },
    externalResources() {
      return {
        js: [
          {
            loadTime: "beforeDOMReady",
            contentType: "inline",
            script: headRedirect_inline_default
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: langClient_inline_default
          }
        ]
      };
    }
  };
};
var src_default = BilingualHead;

export { BilingualHead, src_default as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map