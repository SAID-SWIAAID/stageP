import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig } from "eslint/config"

export default defineConfig({
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    js.configs.recommended,
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    reactHooks.configs["recommended-latest"],
  ],
  ignorePatterns: ["dist"],
  languageOptions: {
    ecmaVersion: "latest",
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
      sourceType: "module",
    },
  },
  settings: { react: { version: "18.2" } },
  plugins: [reactRefresh],
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/prop-types": "off",
  },
})
