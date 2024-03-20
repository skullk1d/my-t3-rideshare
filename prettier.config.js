/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginConfig} */
const config = {
  plugins: ["prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports"],
  importOrder: [/* "^components/(.*)$",  */ "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  arrowParens: "always",
  printWidth: 100,
  singleQuote: true,
  trailingComma: "all",
  semi: true,
};

export default config;
