module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'semi': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
          delimiter: 'none',
          requireLast: true,
      },
    }],
    'react/jsx-wrap-multilines': ['error', { declaration: 'parens-new-line' }],
    'react/prop-types': 'off',
  },
}
