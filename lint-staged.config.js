/** @type {import('lint-staged').Configuration} */
export default {
  '*.{ts,tsx,js,mjs,cjs}': [
    'eslint --fix --max-warnings=0 --no-warn-ignored',
    'prettier --write',
  ],
  '*.css': ['stylelint --fix', 'prettier --write'],
  // The typings are generated from every CSS Module at once, so the check ignores
  // the list of staged files.
  '*.module.css': () => 'npm run css:types:check',
  '*.{json,md,html,yml}': ['prettier --write'],
};
