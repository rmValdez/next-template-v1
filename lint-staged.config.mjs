/** @type {import('lint-staged').Config} */
export default {
  // TypeScript / TSX — lint then format
  "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],

  // JavaScript — format only
  "*.{js,mjs,cjs}": ["prettier --write"],

  // Styles, JSON, Markdown, YAML — format only
  "*.{css,json,md,yml,yaml}": ["prettier --write"],
};
