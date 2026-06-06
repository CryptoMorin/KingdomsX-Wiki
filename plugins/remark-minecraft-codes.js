import { visit } from "unist-util-visit";

/* ---------------- COLORS ---------------- */

const MINECRAFT_COLORS = {
  "0": "#000000",
  "1": "#0000AA",
  "2": "#00AA00",
  "3": "#00AAAA",
  "4": "#AA0000",
  "5": "#AA00AA",
  "6": "#FFAA00",
  "7": "#AAAAAA",
  "8": "#555555",
  "9": "#5555FF",

  a: "#55FF55",
  b: "#55FFFF",
  c: "#FF5555",
  d: "#FF55FF",
  e: "#FFFF55",
  f: "#FFFFFF",
};

const NAMED_COLORS = {
  navy: "#000080",
  maroon: "#800000",
};

/* ---------------- STATE ---------------- */

function newState() {
  return {
    color: null,
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    obfuscated: false,
  };
}

function style(state) {
  const s = [];

  if (state.color) s.push(`color:${state.color}`);
  if (state.bold) s.push(`font-weight:bold`);
  if (state.italic) s.push(`font-style:italic`);

  const deco = [];
  if (state.underline) deco.push("underline");
  if (state.strike) deco.push("line-through");
  if (deco.length) s.push(`text-decoration:${deco.join(" ")}`);

  if (state.obfuscated) {
    s.push(`filter: blur(0.5px); letter-spacing:1px`);
  }

  return s.join(";");
}

// &#RGB &#RRGGBB
const FORMAT_NAKED = /^&#((?:[0-9A-Fa-f]{3}){1,2})/;
// {#RGB} {#RRGGBB}
const FORMAT_BRACES_HEX = /^{#((?:[0-9A-Fa-f]{3}){1,2})}/;
// {#Orange}
const FORMAT_BRACES_NAMED = /^{#([A-z]{3,10})}/;
// {#r,g,b}
const FORMAT_BRACES_RGB = /^{#(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})}/;

/* ---------------- MAIN PLUGIN ---------------- */

export default function remarkMinecraftAdvanced() {
  return (tree) => {
    visit(tree, "inlineCode", (node, _, parent) => {
      const text = node.value;
      if (!text) return;
      if (parent?.type === "code") return;
      if (!text.includes('&') && !text.includes('{#')) return;

      const out = parseMinecraft(text);
      if (!out) return;

      node.type = "html";
      node.value = `<span class="mc-root">${out.join("")}</span>`;
    });
  };
}

function parseMinecraft(text) {
  let state = newState();
  const out = [];
  let found = false;
  let buffer = "";



  const push = (content, st) => {
    const styleAttr = style(st);

    out.push(
      `<span class="mc-token"${
        styleAttr ? ` style="${styleAttr}"` : ""
      }>${content}</span>`
    );
  };

  const applyFormatting = (state, code) => {
    if (MINECRAFT_COLORS[code]) {
      state.color = MINECRAFT_COLORS[code];
      return true;
    }

    else if (code === "l") { state.bold = true; return true; }
    else if (code === "o") { state.italic = true; return true; }
    else if (code === "n") { state.underline = true; return true; }
    else if (code === "m") { state.strike = true; return true; }
    else if (code === "k") { state.obfuscated = true; return true; }
    else if (code === "r") { state = newState(); return true; }
    return false;
  };

  const flush = () => {
    found = true;
    if (!buffer) return;
    push(buffer, { ...state });
    buffer = "";
  };



  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch !== '{' && ch !== '&') {
      buffer += ch;
      continue;
    }

    /* -------- Simple Color Formatting -------- */
    if (ch === "&" && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();

      if (applyFormatting({}, code)) {
        flush();
        if (!['l', 'o', 'n', 'm', 'k', 'r'].includes(code)) state = newState();
        applyFormatting(state, code);
        buffer += '&' + code;

        i++;
        continue;
      }
    }

    const chunk = text.slice(i);

    // &#RRGGBB
    let match = chunk.match(FORMAT_NAKED);
    if (match) {
      flush();
      state = newState();
      state.color = '#' + match[1];
      buffer += match[0];
      i += match[0].length;
      continue;
    }

    // {#RRGGBB}
    match = chunk.match(FORMAT_BRACES_HEX);
    if (match) {
      flush();
      state = newState();
      state.color = '#' + match[1];
      buffer += match[0];
      i += match[0].length;
      continue;
    }

    // {#r,g,b}
    match = chunk.match(FORMAT_BRACES_RGB);
    if (match) {
      flush();
      state = newState();
      state.color = `rgb(${match[1]})`;
      buffer += match[0];
      i += match[0].length;
      continue;
    }

    // {#Named}
    match = chunk.match(FORMAT_BRACES_NAMED);
    if (match) {
      const name = match[1].toLowerCase();
      if (NAMED_COLORS[name]) {
        flush();
        state = newState();
        state.color = NAMED_COLORS[name];
        buffer += match[0];
        i += match[0].length;
        continue;
      }
    }

    buffer += ch;
  }

  if (!found) return null;
  flush();
  return out;
}