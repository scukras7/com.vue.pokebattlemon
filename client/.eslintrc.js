module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'comma-dangle': 'off',
    'consistent-return': 'off',
    'eol-last': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    indent: 'off',
    'max-len': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-lonely-if': 'off',
    'no-plusplus': 'off',
    "no-underscore-dangle": "off",
    "no-unused-expressions": "off",
    'padded-blocks': 'off',
    'prefer-destructuring': 'off',
    'space-before-function-paren': 'off',
    semi: 'off',
  },
};
