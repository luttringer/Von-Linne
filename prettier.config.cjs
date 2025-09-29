/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 160,                // base para JS/TS/etc.
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  htmlWhitespaceSensitivity: "ignore",
  singleAttributePerLine: false,  // <- importante
  plugins: [require("prettier-plugin-tailwindcss")],
  overrides: [
    {
      files: ["*.html", "*.htm"],
      options: { printWidth: 240 } // <- subimos el margen en HTML
    }
  ]
};