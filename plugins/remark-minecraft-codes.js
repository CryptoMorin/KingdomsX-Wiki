import { visit } from "unist-util-visit";

/* ---------------- COLORS ---------------- */

const LEGACY_COLORS = {
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

function reset() {
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
const FORMAT_NAKED = /^&#([0-9A-Fa-f]{3,6})/;
// {#RGB} {#RRGGBB}
const FORMAT_BRACES_HEX = /^{#([0-9A-Fa-f]{3,6})}/;
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

      let state = reset();
      let out = [];

      const push = (content, st, extraClass = "") => {
        const styleAttr = style(st);

        out.push(
          `<span class="mc-token ${extraClass}"${
            styleAttr ? ` style="${styleAttr}"` : ""
          }>${content}</span>`
        );
      };

      const applyFormatting = (code) => {
        if (LEGACY_COLORS[code]) state.color = LEGACY_COLORS[code];

        else if (code === "l") state.bold = true;
        else if (code === "o") state.italic = true;
        else if (code === "n") state.underline = true;
        else if (code === "m") state.strike = true;
        else if (code === "k") state.obfuscated = true;
        else if (code === "r") state = reset();
      };

      let buffer = "";

      const flush = () => {
        if (!buffer) return;
        push(buffer, { ...state });
        buffer = "";
      };

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        /* -------- LEGACY & CODES -------- */
        if (ch === "&" && i + 1 < text.length) {
          const code = text[i + 1].toLowerCase();

          flush();          
          applyFormatting(code);
          push(`&${code}`, { ...state }, "mc-code");

          i++;
          continue;
        }

        const chunk =  text.slice(i);

        // &#RRGGBB
        let match = chunk.match(FORMAT_NAKED)
        if (match) {
          flush();
          state = reset();
          state.color = '#' + match[1];
          buffer += match[1];
          i += state.color.length;
          continue;
        }

        // {#RRGGBB}
        match = chunk.match(FORMAT_BRACES_HEX)
        if (match) {
          flush();
          state = reset();
          state.color = '#' + match[1];
          buffer += match[1];
          i += state.color.length;
          continue;
        }

        // {#r,g,b}
        chunk = chunk.match(FORMAT_BRACES_RGB);
        if (match) {
          flush();
          state = reset();
          state.color = `rgb(${match[1]})`;
          buffer += match[1];
          i += state.color.length;
          continue;
        }

        // {#Named}
        chunk = chunk.match(FORMAT_BRACES_NAMED);
        if (match) {
          const name = match[1].toLowerCase();
          if (NAMED_COLORS[name]) {
            flush();
            state = reset();
            state.color = NAMED_COLORS[name];
            buffer += match[1];
            i += state.color.length;
            continue;
          }
        }

        buffer += ch;
      }

      flush();

      node.type = "html";
      node.value = `<span class="mc-root">${out.join("")}</span>`;
    });
  };
}