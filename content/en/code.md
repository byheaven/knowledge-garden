---
{"publish":true,"created":"2025-09-29T22:01:36.492+08:00","modified":"2025-09-30T23:25:30.658+08:00","cssclasses":""}
---


```js
// 展开 ![[...]]（支持 #小节、#^块ID，含嵌套解析），然后复制到剪贴板，不创建新文件。

module.exports = async (tp) => {
    // 优先使用 Obsidian 全局 Notice；否则从模块引入
    let NoticeClass = (typeof Notice !== 'undefined') ? Notice : null;
    try {
      if (!NoticeClass) {
        const obsidian = require('obsidian');
        NoticeClass = obsidian.Notice;
      }
    } catch (_) {
      // 如果连 require('obsidian') 都不可用，就不显示通知
      NoticeClass = class { constructor() {} };
    }
  
    async function readFile(tfile) {
      return await app.vault.read(tfile); // 桌面版 Obsidian 中全局可用的 app
    }
  
    async function getSectionContent(tfile, hash) {
      const text = await readFile(tfile);
      const lines = text.split('\n');
  
      // 区块目标：#^blockid → 抓取该行（去掉末尾 ^id）
      if (hash.startsWith('^')) {
        const id = hash.slice(1);
        const idx = lines.findIndex(l => l.trim().endsWith('^' + id));
        if (idx === -1) return '';
        return lines[idx].replace(/\s*\^[A-Za-z0-9_-]+$/, '');
      }
  
      // 小节目标：#Heading → 直到下一个同级或更高级标题
      const heading = hash.trim();
      let start = -1, level = 0;
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^(#{1,6})\s+(.*)$/);
        if (m && m[2].trim() === heading) { start = i + 1; level = m[1].length; break; }
      }
      if (start === -1) return '';
      let end = lines.length;
      for (let i = start; i < lines.length; i++) {
        const m = lines[i].match(/^(#{1,6})\s+(.*)$/);
        if (m && m[1].length <= level) { end = i; break; }
      }
      return lines.slice(start, end).join('\n').trim();
    }
  
    function stripAlias(target) {
      // "Note#H|alias" → "Note#H"
      return target.split('|')[0];
    }
  
    async function resolveOne(rawMatch, rawTarget) {
      const target = stripAlias(rawTarget);
      const [pathPart, hash] = target.split('#');
  
      // 基于当前文件解析链接
      const tfile = app.metadataCache.getFirstLinkpathDest(pathPart, tp.file.path);
      if (!tfile) return rawMatch; // 找不到就保留原样
  
      if (hash) {
        const section = await getSectionContent(tfile, hash);
        return section || rawMatch;
      }
      return await readFile(tfile);
    }
  
    async function expandEmbeds(text, depth = 0) {
      if (depth > 6) return text; // 防循环
      const re = /!\[\[([^\]]+)\]\]/g;
  
      let out = '', last = 0, changed = false, m;
      while ((m = re.exec(text)) !== null) {
        changed = true;
        out += text.slice(last, m.index);
        out += await resolveOne(m[0], m[1]);
        last = m.index + m[0].length;
      }
      out += text.slice(last);
  
      return changed ? expandEmbeds(out, depth + 1) : out;
    }
  
    // --- 可选项 ---
    const INCLUDE_FRONTMATTER = true;  // 是否保留当前笔记的 YAML
    const STRIP_WIKI_LINKS   = false;  // 若为 true：[[Note|别名]]→别名；[[Note]]→Note
    // ---------------
  
    let expanded = await expandEmbeds(tp.file.content);
  
    if (!INCLUDE_FRONTMATTER) {
      expanded = expanded.replace(/^---\n[\s\S]*?\n---\n?/, '');
    }
    if (STRIP_WIKI_LINKS) {
      expanded = expanded.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
      expanded = expanded.replace(/\[\[([^\]]+)\]\]/g, '$1');
    }
  
    // 复制到剪贴板
    try {
      const { clipboard } = require('electron'); // 桌面版优先
      clipboard.writeText(expanded);
      new NoticeClass('Expanded embeds copied to clipboard ✅');
    } catch (e) {
      try {
        await navigator.clipboard.writeText(expanded); // Web 备选
        new NoticeClass('Expanded embeds copied to clipboard ✅');
      } catch (e2) {
        new NoticeClass('无法访问剪贴板——复制失败。');
      }
    }
  };
```
