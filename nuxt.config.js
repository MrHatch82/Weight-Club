export default {
  ssr: false,
  publicRuntimeConfig: {
    appId: process.env.APP_ID,
    jsKey: process.env.JS_KEY,
    // masterKey: process.env.MASTER_KEY,
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'FAT FRIENDS',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#444444' },
      { name: 'theme-color', content: '#444444' },
      { name: 'robots', content: 'noindex' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        ref: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        ref: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        ref: '/favicon/favicon-16x16.png',
      },
      { rel: 'manifest', ref: '/favicon/site.webmanifest' },
      {
        rel: 'mask-icon',
        ref: '/favicon/safari-pinned-tab.svg',
        color: '#666666',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/app.scss'],

  styleResources: {
    scss: ['~/assets/css/resources.scss'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/parse.js', mode: 'client' },
    '~/plugins/moment.js', // REPLACE WITH LUXON!!!
    '~/plugins/utilityFunctions.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/svg',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'nuxt-mq',
  ],

  mq: {
    defaultBreakpoint: 'sm',
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400,
      xxl: Infinity,
    },
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
    components: [
      'BForm',
      'BFormGroup',
      'BFormTextarea',
      'BFormInput',
      'BFormCheckbox',
      'BFormSelect',
      'BButton',
      'BButtonGroup',
    ],
    directives: [],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { babel: { compact: true }, analyze: false },

  router: {
    middleware: 'authCheck',
  },
};
