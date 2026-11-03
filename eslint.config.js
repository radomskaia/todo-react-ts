import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * A hand-picked subset of unicorn instead of its full `recommended` preset: rules
 * that catch bugs or point to a clearly better API, without the stylistic ones that
 * mostly need switching off.
 */
const unicornRules = {
  'unicorn/catch-error-name': 'error',
  'unicorn/error-message': 'error',
  'unicorn/new-for-builtins': 'error',
  'unicorn/no-abusive-eslint-disable': 'error',
  'unicorn/no-for-each': 'error',
  'unicorn/no-for-loop': 'error',
  'unicorn/no-instanceof-builtins': 'error',
  'unicorn/no-lonely-if': 'error',
  'unicorn/no-negated-condition': 'error',
  'unicorn/no-new-array': 'error',
  'unicorn/no-typeof-undefined': 'error',
  'unicorn/no-useless-spread': 'error',
  'unicorn/prefer-add-event-listener': 'error',
  'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-array-flat-map': 'error',
  'unicorn/prefer-array-some': 'error',
  'unicorn/prefer-at': 'error',
  'unicorn/prefer-dom-node-append': 'error',
  'unicorn/prefer-dom-node-text-content': 'error',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-keyboard-event-key': 'error',
  'unicorn/prefer-modern-dom-apis': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/prefer-optional-catch-binding': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-single-call': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/prefer-string-replace-all': 'error',
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-structured-clone': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/throw-new-error': 'error',
};

/** Rules shared by every JS and TS file. */
const commonRules = {
  'eqeqeq': ['error', 'always', { null: 'ignore' }],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
};

/**
 * Blank lines around control flow and before `return`, so branching stands out
 * from the statements around it. Fully autofixable.
 *
 * Taken from @stylistic rather than ESLint core: the core rule is deprecated and
 * is scheduled for removal in ESLint 11.
 */
const paddingLineRules = {
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'if' },
    { blankLine: 'always', prev: '*', next: 'for' },
    { blankLine: 'always', prev: '*', next: 'while' },
    { blankLine: 'always', prev: '*', next: 'switch' },
    { blankLine: 'always', prev: '*', next: 'try' },
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: 'block-like', next: '*' },
  ],
};

/** Import hygiene: all imports up top, one block, sorted, followed by a blank line. */
const importRules = {
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-duplicates': 'error',
  'import-x/order': [
    'error',
    {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
      ],
      'pathGroups': [{ pattern: '@/**', group: 'internal', position: 'before' }],
      'pathGroupsExcludedImportTypes': ['builtin'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true },
    },
  ],
};

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules', '.husky/_', '**/*.d.css.ts']),

  // Tooling configs: plain JS on Node, without type-aware rules.
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [js.configs.recommended],
    plugins: { 'import-x': importX, '@stylistic': stylistic, unicorn },
    languageOptions: { globals: globals.node },
    rules: {
      ...commonRules,
      ...unicornRules,
      ...paddingLineRules,
      ...importRules,
    },
  },

  // CommonJS files use `module` and `require` instead of ES module syntax.
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: {
      'import-x/first': 'off',
      'import-x/newline-after-import': 'off',
      'import-x/order': 'off',
    },
  },

  // Application code.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintReact.configs['recommended-type-checked'],
      jsxA11y.flatConfigs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { 'import-x': importX, '@stylistic': stylistic, unicorn },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Lets import-x parse imported TS files and follow the `@/` alias, which
    // no-cycle needs: without it every dependency looks empty and no cycle is found.
    settings: {
      'import-x/extensions':
        importX.flatConfigs.typescript.settings['import-x/extensions'],
      'import-x/parsers': importX.flatConfigs.typescript.settings['import-x/parsers'],
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      ...commonRules,
      ...unicornRules,
      ...importRules,
      ...paddingLineRules,

      // Named exports keep a symbol's name the same everywhere it is imported,
      // which makes renames and auto-imports reliable.
      'import-x/no-default-export': 'error',
      // A cycle between modules breaks initialisation order in subtle ways. The rule
      // walks the whole import graph, so it only runs in CI to keep local lint fast.
      'import-x/no-cycle': process.env.CI ? 'error' : 'off',
      // Code in another directory is reached through the `@/` alias, never `../`, so
      // moving a file does not break the imports inside it.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: String.raw`^\.\./`,
              message: 'Import through the `@/` alias instead of a parent directory.',
            },
          ],
        },
      ],

      // One consistent style for type imports, matching verbatimModuleSyntax.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      // The only unused-code check: TypeScript's noUnusedLocals/noUnusedParameters
      // are off so the same problem is not reported twice.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Numbers in template literals are routine; there is nothing to forbid.
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      // Async handlers in JSX props (onClick={async () => …}) are fine.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      // A switch over a union must name every member, so adding one to the union
      // points at each switch that now has to handle it.
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // Components are PascalCase, everything else camelCase.
      'unicorn/filename-case': [
        'error',
        { cases: { camelCase: true, pascalCase: true } },
      ],
    },
  },

  // Tools that load their config through a default export.
  {
    files: ['vite.config.ts'],
    rules: { 'import-x/no-default-export': 'off' },
  },

  // Tests: catch assertions that silently pass — a missing `await` on findBy*,
  // an `expect` with no matcher, a `.only` left behind in a commit.
  {
    files: ['**/*.test.{ts,tsx}', 'vitest.setup.ts'],
    extends: [testingLibrary.configs['flat/react'], vitest.configs.recommended],
    rules: {
      'vitest/no-focused-tests': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      'vitest/expect-expect': 'error',
    },
  },

  // Vitest runs with `globals: false`, so React Testing Library cannot register its
  // automatic cleanup (it only does so when `afterEach` exists as a global). The
  // manual cleanup in the setup file is load-bearing: without it, a render leaks
  // into the next test.
  {
    files: ['vitest.setup.ts'],
    rules: { 'testing-library/no-manual-cleanup': 'off' },
  },

  // Turns off rules that conflict with Prettier. Always last...
  prettier,

  // ...except for `curly`, which eslint-config-prettier disables wholesale. Only the
  // `multi-line` and `multi-or-nest` options fight Prettier; `all` is safe, and it is
  // the one worth having: every block gets braces.
  {
    rules: { curly: ['error', 'all'] },
  },
]);
