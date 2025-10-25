import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      // "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      'vue/no-undef-components': 'error',
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // vue/no-undef-components 에러 발생 시 추가
  {
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['custom(\\-\\w+)+'],
      },
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
])
