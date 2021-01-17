module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'max-len': [2, 120, 2],
    radix: [0],
    'import/prefer-default-export': [0],
    'no-plusplus': [0],
    'no-restricted-syntax': [0],
    'no-param-reassign': [0],
    '@typescript-eslint/restrict-plus-operands': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'react/button-has-type': [0],
    'react-hooks/rules-of-hooks': [1],
    'react-hooks/exhaustive-deps': [1],
    'react/jsx-props-no-spreading': [0, {
      html: 'ignore',
      custom: 'ignore',
      explicitSpread: 'ignore',
    }],
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
    include: ['src/**/*.ts', 'src/**/*.tsx'],
  },
};
