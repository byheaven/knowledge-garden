```dataviewjs
// multiple keys to match
const PROPS = ["刷机脑图", "pt"];
function hasAny(it) {
return PROPS.some(k => it?.[k] != null && it[k] !== false);
}
function valuesOf(it) {
// if an item has several keys, include all
return PROPS.flatMap(k => (it?.[k] != null && it[k] !== false) ? [String(it[k])] : []);
}
function formatList(items, indent = 0) {
if (!items || items.length === 0) return [];
const indentStr = "　".repeat(indent); // keep your full-width spaces
let out = [];
for (const it of items) {
out.push(indentStr + "• " + (it.text ?? ""));
if (it.children?.length) out = out.concat(formatList(it.children, indent + 1));
}
return out;
}
const tableData = dv.pages().where(p => {
const lists = p.file.lists ?? [];
return lists.some(hasAny);
}).map(p => {
const lists = p.file.lists ?? [];
const hits = lists.filter(hasAny).map(it => {
const vals = valuesOf(it);
// prefer property values; fallback（后备方案） to the item text if empty
let lines = [vals.length ? vals.join(" / ") : (it.text ?? "")];
if (it.children?.length) lines = lines.concat(formatList(it.children, 1));
return lines.join("<br>");
});
return [p.file.link, hits.join("<br>---<br>")];
});
dv.table(["File", "Post-train your brain"], tableData);
```