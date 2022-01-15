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
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: 'off',
    'comma-dangle': 'off',
    'eol-last': 'off',
    semi: 'off',
    'import/extensions': 'off',
    'space-before-function-paren': 'off',
    'padded-blocks': 'off',
    'import/prefer-default-export': 'off'
  },
};
