module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'space-before-function-paren': 0,
    'vue/no-v-html': 0,
    'vue/html-self-closing': 0,
    'comma-dangle': [2, 'always-multiline'],
    semi: [2, 'always'],
  },
};
