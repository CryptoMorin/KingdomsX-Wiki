import { visit } from "unist-util-visit";

export default function remarkPlaceholders() {
  return (tree) => {
    visit(tree, ["code", "inlineCode"], (node, index, parent) => handle(node));
  };
}

function handle(node) {
  const text = node.value.trim();

  if (
    text.startsWith("%") &&
    text.endsWith("%") &&
    text.length > 2
  ) {
    if (node.type === "code" && (text.length > 200 || text.includes('\n'))) {
      return;
    }

    let inner = text.slice(1, -1);
    inner = colorize(inner);

    // Don't use <code> because Docusaurus will Prism-ify it.
    // Causing "placeholder-text" to be replaced and a <pre> tag added.
    // We have to be aggressive with whitespaces in the source code, otherwise it'll look weird in production.
    node.type = "html";
    node.value = `
<span class="placeholder-text">
<span class="placeholder-enclosure">%</span>
<span class="placeholder-content">${inner}</span>
<span class="placeholder-enclosure">%</span>
</span>
  `.replaceAll('\n', '').trim();
  }
}

function colorize(text) {
  const esc = s =>
    s.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/_/g, "_<wbr>");

  let html = "";

  const modMatch = text.match(/^((?:[^@:\s]+@)*)(.*)$/);

  const modsPart = modMatch[1];
  const remainder = modMatch[2];

  // Mods
  if (modsPart) {
    for (const mod of modsPart.split("@").filter(Boolean)) {
      html += `<span class="mod">${esc(mod)}</span>`;
      html += `<span class="at">@</span><wbr>`;
    }
  }

  const colonIdx = remainder.indexOf(":");

  // No function section
  if (colonIdx === -1) {
    html += `<span class="namespace">${esc(remainder)}</span>`;
    return html;
  }

  const namespace = remainder.slice(0, colonIdx);
  const afterColon = remainder.slice(colonIdx + 1);

  html += `<span class="namespace">${esc(namespace)}</span>`;
  html += `<span class="sep">:</span><wbr>`;

  const firstSpace = afterColon.indexOf(" ");

  // Namespace + fn only
  if (firstSpace === -1) {
    html += `<span class="fn">${esc(afterColon)}</span>`;
    return html;
  }

  const fnName = afterColon.slice(0, firstSpace);
  const argsText = afterColon.slice(firstSpace + 1);

  html += `<span class="fn">${esc(fnName)}</span> `;

  argsText.split(",").forEach((arg, i, arr) => {
    const eqIdx = arg.indexOf("=");

    if (eqIdx === -1) {
      html += `<span class="arg">${esc(arg.trim())}</span>`;
    } else {
      const key = arg.slice(0, eqIdx).trim();
      const value = arg.slice(eqIdx + 1).trim();

      html += `<span class="arg">${esc(key)}</span>`;
      html += `<span class="sep">=</span>`;
      html += `<span class="value">${esc(value)}</span>`;
    }

    if (i < arr.length - 1) {
      html += `<span class="sep">,</span><wbr>`;
    }
  });

  return html;
}
