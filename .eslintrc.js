module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'airbnb-base',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect', // React 버전 자동 감지
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules/', 'build/'],
  rules: {
    'no-console': 'warn',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'vars-on-top': 'off',
    'no-underscore-dangle': 'off',
    'comma-dangle': 'off',
    'func-names': 'off',
    'prefer-template': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'prefer-arrow-callback': 'error',
    'require-await': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
        allowShortCircuit: true,
        allowTaggedTemplates: true,
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/jsx-uses-react': 'off', // React를 JSX 범위에서 인식하도록 설정
    'react/jsx-uses-vars': 'error', // JSX에서 사용된 변수를 사용하지 않는 것으로 인식하지 않도록 설정
  },
  globals: {
    React: 'writable', // React를 전역 변수로 설정
  },
}
