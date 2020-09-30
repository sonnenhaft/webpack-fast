// Retrieving the NPM configuration to be able to expose
// it to the client. Can be useful for displaying the
// application version number.
//
// NOTE: be careful to only expose what you need the
// client to see.

const { title, description } = __FILTERED_PACKAGE_JSON__;

/*
 *** CLIENT APP CONFIGURATIONS ***
 *
 *  Configurations for the client application.
 */
export default {
  // Application title, typically to be displayed in a HTML title and
  // in an application header
  title,

  // Application description
  description,

  // Copyright info (displayed in the footer)
  copyright: '© 2016 - present, Accedo',

  // HTML head information
  head: {
    title,
    titleTemplate: `${title} | %s`,
    meta: [
      { name: 'description', content: description },
      { charset: 'utf-8' },
      { property: 'og:site_name', content: title },
      { property: 'og:image', content: 'vdkweblogo.png' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:card', content: 'summary' },
      { property: 'og:image:width', content: '200' },
      { property: 'og:image:height', content: '200 ' }
    ]
  },

  // Static menu (currently displayed in the application footer)
  staticMenu: [{ displayText: 'About', to: '/about' }],

  // TV Static menu (displayed in the application footer for TV)
  tvStaticMenu: [
    { displayText: 'TV Carousel', to: '/tv-carousel' },
    { displayText: 'TV Grid', to: '/tv-grid' },
    { displayText: 'TV Hero Banner', to: '/tv-hero-banner' },
    { displayText: 'TV Keyboard', to: '/tv-keyboard' },
    { displayText: 'TV Menu - Clickable', to: '/tv-menu-clickable' },
    { displayText: 'TV Menu - Focus Only', to: '/tv-menu-focus' },
    { displayText: 'TV Page Test', to: '/tv-page' },
    { displayText: 'TV Popup', to: '/tv-popup' },
    { displayText: 'TV Web Player', to: '/tv-web-player' }
  ],

  // Settings for the client side logger
  // These will be passed to the client side @accedo/vdkweb-winston
  // logger in src/utils/logger.js
  logger: {
    // The default log level.
    // This can be overridden by the transports.
    logLevel: 'debug',

    // Defines the logging targets that we want to log
    // to whenever we're using the logger.
    transports: [
      // Logging to the browser console
      {
        name: 'BrowserConsole',
        enabled: true
      }
    ]
  },

  // Vikimap init settings
  vikimap: {
    debugMode: false
  },

  // Default language setting
  defaultLanguageSetting: {
    name: 'English',
    value: 'en_GB'
  },

  // Default audio / subtitle setting
  defaultAudioCCSetting: {
    name: 'English'
  }
};
