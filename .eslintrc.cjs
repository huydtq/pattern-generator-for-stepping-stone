module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: './'
  },
  plugins: ['react', 'react-refresh', 'import', 'prettier'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { "varsIgnorePattern": "^_" }],
    '@typescript-eslint/no-use-before-define': 'off',
    'class-methods-use-this': ['error', { enforceForClassFields: false }],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', json: 'never' }],
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/order': ['error', { groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'], pathGroups: [{ pattern: '@(react|react-native)', group: 'external', position: 'before' }, { pattern: '@src/**', group: 'internal' }], pathGroupsExcludedImportTypes: ['internal', 'react'], 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],
    'linebreak-style': 'off',
    'no-empty-function': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto', arrowParens: 'always', bracketSpacing: true, jsxBracketSameLine: false, jsxSingleQuote: true, quoteProps: 'as-needed', singleQuote: true, semi: false, printWidth: 120, useTabs: false, tabWidth: 2, trailingComma: 'none' }, { usePrettierrc: false, fileInfoOptions: { withNodeModules: false } }],
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true },],
    'react/display-name': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': [2, { callbacksLast: true, shorthandFirst: false, shorthandLast: true, multiline: 'last', ignoreCase: true, noSortAlphabetically: false }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    'import/resolver': {
      alias: true,
      typescript: {},
      project: './tsconfig.json',
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    },
    react: {
      version: 'detect'
    },
    'import/ignore': ['node_modules']
  }
}
