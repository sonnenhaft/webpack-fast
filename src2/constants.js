const BASE_AUTH_URL = 'https://login.starhubgee.com.sg/sso';

export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
  TV: '/tv',
  MOVIE: '/movie/:id',
  EPG: '/epg',
  GUIDE: '/guide',
  STORE: '/store',
  MOVIE_DETAILS: '/movie-details/:id',
  LINEAR_DETAILS: '/linear-details/:id',
  SEARCH: '/search',
  VOUCHER: '/voucher',
  R21_PIN: '/r21-pin',
  SERIES_DETAILS: '/series-details/:id',
  PACK_DETAILS: '/pack-details/:id',
  CATEGORY: '/category/:id',
  LOGIN: '/login',
  SETTINGS: '/settings',
  SETTINGS_LANG: '/settings/lang',
  ASSET_LISTING: '/listing',
  DETAILS_LISTING: '/details-listing',
  PACKS_LISTING: '/packs-listing',
  MULTI_PACKS: '/multipacks',
  DEVICE_MANAGEMENT: '/device-management',
  PARENTAL_CONTROLS: '/parental-control',
  TRANSACTIONS: '/transactions',
  RESTRICT_BY_RATINGS: '/restrict-by-ratings',
  RESTRICT_BY_CHANNELS: '/restrict-by-channels',
  PURCHASE_COMPLETE: '/purchase-completed',
  CONFIG: '/health/config',
  ID: '/:id',
  NO_MATCH: '*'
};

export const EXT_ROUTES = {
  FORGOT_ID: `${BASE_AUTH_URL}/HubidForgot`,
  FORGOT_PASSWORD: `${BASE_AUTH_URL}/ForgetPassword`,
  SIGN_UP: `${BASE_AUTH_URL}/HubidRegisterSelected`
};

export const LOGIN_SIGN_UP = 'Login / Sign up';
export const LOGOUT = 'Logout';

export const LOGIN_PLACEHOLDER = {
  USERNAME: 'Enter Hub iD',
  PASSWORD: 'Enter password'
};

export const FORGOT = {
  SEPERATOR: '/'
};

export const DEFAULT_MAX_RAIL_ITEMS = 20;
export const DEFAULT_COPY_RIGHT = '© STARHUB';
export const REMEMBER_ME = 'Remember me';
export const EMPTY_USERNAME = 'enter a valid username';
export const EMPTY_PASSWORD = 'enter a password corresponding to this account';
export const INVALID_INPUT = 'invalid username or password';

export const AUTH_ACTIONS = {
  AUTO_LOGIN: 'auto_login',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_ENTITLEMENTS: 'set_entitlements'
};

export const MENU = {
  CHANGE_R21_PIN: 'Change R21 PIN',
  DEVICES_MANAGEMENT: 'Devices management',
  MY_TRANSACTIONS: 'My transactions',
  REDEEM_VOUCHER: 'Redeem voucher',
  PARENTAL_CONTROLS: 'Parental controls',
  HELP_FAQ: 'Help & FAQ',
  LOGOUT,
  LOGIN_SIGN_UP
};

export const PIN_LENGTH = 6;

// videojs components
export const VJS_CUSTOM_COMPONENTS = {
  AUDIO_OR_SUBTITLE_SELECTION: 'AudioOrSubtitleComponent',
  AUDIO_SUBTITLE_SELECTION_OVERLAY:
    'CustomAudioSubtitleSelectionOverlayComponent',
  BACK_BUTTON: 'CustomBackButton',
  BACKGROUND_OVERLAY: 'CustomBackgroundOverlay',
  CLICKABLE_OPTION: 'CustomClickableComponent',
  CONTROL_BAR: 'CustomControlBar',
  CONTROL_BAR_CLICKABLE_COMPONENT: 'CustomControlClickableComponent',
  CURRENT_TIME_DISPLAY: 'CurrentTimeDisplay',
  DURATION_DISPLAY: 'DurationDisplay',
  FULL_SCREEN: 'CustomFullscreenToggle',
  ERROR_PROMPT: 'ErrorPrompt',
  ERROR_PROMPT_BUTTON: 'ErrorPromptButton',
  REACT_VJS_COMPONENT: 'ReactVjsComponent',
  RECOMMENDATION_RAILS_OVERLAY: 'CustomRecommendationRailsOverlay',
  SEEK_BAR: 'CustomSeekBar',
  TEXT_LABEL: 'CustomLabelComponent',
  VOLUME_CONTROL: 'CustomVolumeControl'
};

export const VJS_CUSTOM_CLASSNAMES = {
  audioOrSubtitleSelectionOverlay: 'vjs-subtitle-audio-selection-overlay',
  audioOrSubtitleSelectionSection: 'vjs-audio-or-subtitle-selection',
  backButton: 'vjs-back-button',
  backgroundOverlay: 'vjs-custom-background-overlay',
  customLabel: 'vjs-custom-label',
  disabledButtonClass: 'vjs-disabled-btn',
  durationLabel: 'vjs-duration-label',
  episodesOrRecommendations: 'vjs-custom-episodes',
  errorPrompt: 'vjs-custom-error-prompt',
  errorPromptButton: 'vjs-custom-error-prompt-button',
  errorPromptMessage: 'vjs-custom-error-prompt-message',
  errorPromptTitle: 'vjs-custom-error-prompt-title',
  favourite: 'vjs-custom-favourite',
  fullscreen: 'vjs-custom-fullscreen',
  goToLiveClass: 'vjs-custom-go-to-live',
  hiddenClass: 'vjs-hidden',
  linearControls: 'vjs-linear-btn',
  nextEpisode: 'vjs-custom-next-ep',
  playPause: 'vjs-custom-playpause',
  prevEpisode: 'vjs-custom-prev-ep',
  secondaryActiveIcon: 'vjs-secondary-active',
  subtitleAndAudio: 'vjs-custom-subtitle-audio',
  startOverClass: 'vjs-custom-startover',
  titleLabel: 'vjs-title-label',
  visibleIcon: 'vjs-visible',
  volume: 'vjs-custom-volume'
};

export const PLAYER_INACTIVITY_TIMEOUT = 5000;
export const PLAYER_SEND_PLAY_ACTIVITY_TIMEOUT = 10000;
// media element -> readyState = HAVE_ENOUGH_DATA ref:https://html.spec.whatwg.org/multipage/media.html#dom-media-readystate
export const PLAYER_READY_STATE = 4;

const TV_SERIES = 'tvSeries';
const MOVIES = 'movies';
const PROGRAMS = 'programs';

export const searchContainer = {
  [PROGRAMS]: {
    cardType: '16x9',
    displayText: 'TV Channels'
  },
  [TV_SERIES]: {
    cardType: '2x3',
    displayText: 'Now on TV'
  },
  [MOVIES]: {
    cardType: '2x3',
    displayText: 'Movies'
  }
};

export const EPG_PLAYER_ACTION = {
  loadPlayer: 'loadPlayer',
  unloadPlayer: 'unloadPlayer',
  makePlayerVisible: 'makePlayerVisible',
  playerStartReplay: 'playerStartReplay',
  replayPlayer: 'replayPlayer'
};

export const PLAYER_ACTION = {
  bingeWatch: 'bingeWatch',
  nextEpisode: 'nextEpisode',
  prevEpisode: 'prevEpisode',
  resetState: 'resetState',
  setInitialEpisodeIndex: 'setInitialEpisodeIndex'
};

export const FALLBACK_MESSAGES = {
  browserDeviceNotSupported:
    'Playback on this browser / device is not supported',
  comingSoonDescription: 'This feature is not available yet.',
  comingSoonTitle: 'Coming Soon',
  confirmText: 'Confirm',
  defaultSubtitleTrack: 'None',
  detailAddToFav: 'Add to favourite',
  detailAddToWatchList: 'Add to watchList',
  detailBuyButtonText: 'Buy - S$#price#/#period#',
  detailEpisodeNumRegex: '#eps-num#',
  detailLoginToWatch: 'LOGIN TO START WATCHING',
  detailMoreEps: 'More episodes',
  detailPeriodRegex: '#period#',
  detailPriceRegex: '#price#',
  detailRentButtonText: 'Rent - S$#price#/#period#',
  detailRentOnlyText: 'Rent',
  detailResume: 'Resume',
  detailResumeEpisode: 'Resume E#eps-num#',
  detailResumeSeason: 'Resume S#season-num#:E#eps-num#',
  detailSeasonNumRegex: '#season-num#',
  detailShareCopyLink: 'Copy link',
  detailShareTitle: 'Share',
  detailStartOver: 'Start-over the show',
  detailViewSubsPackBtn: 'View subscription pack',
  detailWatchNowButtonTitle: 'WATCH NOW',
  detailWatchTrailer: 'WATCH TRAILER',
  deviceMgtTitle: 'Device Management',
  deviceMgtRemove: 'REMOVE',
  epgGoToNowButtoTitle: 'Go to NOW',
  epgNoProgramInfo: 'No Program Info',
  epgViewDetails: 'View details',
  filterShowing: 'Showing all categories',
  footerHelp: 'Help',
  footerPrivacyPolicy: 'Privacy Policy',
  footerTC: 'Terms and Conditions',
  footerWhereToWatch: 'Where to watch',
  hd: 'HD',
  languageChangeDone_web: 'Done',
  languageChangeMessage_web: 'Show info language - #language#',
  languageChangeMessageRegex: '#language#',
  languageChangeMesageTitle_web:
    'Change preferred show info language successful!',
  listingCat_web: 'Content categories',
  loginForgotHubId_web: 'Forgot Hub iD',
  loginForgotPassword_web: 'password?',
  loginScreenTitle: 'login',
  MaintenanceDialogTitle: 'System maintenance',
  MaintenanceDialogMessage:
    'System is under maintenance, please try again later',
  mins: 'mins',
  mobileAppBanner: 'Access StarHub TV+ on app store',
  mobilePageMessage: 'Please visit the app store to download StarHub TV+',
  mobilePageTitle: 'Unavailable on web browser',
  monthText: 'month',
  moreLikeThisText: 'More like this',
  multipleSubscriptionTitle: 'You have multiple subscriptions',
  nowText: 'Now',
  ok: 'Ok',
  okIGotIt: 'OK, I got it',
  packDetailAssetRegex: '#asset-name#',
  playerAddToFav: 'Add to favourite',
  playerAudioSub: 'Audio & Subtitles',
  playerBackToLive: 'Back to live',
  playerErrorCodeRegex: '#error-code#',
  playerErrorGenericMessage:
    'Oops, something went wrong while trying to play the video. Please try again later.\nIf problem persists, please ,contact us (#error-message# - #error-code#)',
  playerErrorMessageRegex: '#error-message#',
  playerErrorTitle: 'Player Error',
  playerNextEps: 'Next episode',
  playerPause: 'Pause',
  playerPlay: 'Play',
  playerPreviousEps: 'Previous episode',
  playerStartOver: 'Start-over',
  preferencesAudio: 'Preferred audio',
  preferencesShowInfo: 'Show info language',
  preferencesSubtitles: 'Preferred subtitles',
  playerVolume: 'Volume',
  purchaseFailurePopupTitleATV: 'Unsuccessful',
  purchaseSuccessfulPopupDescription: ' has been purchased successfully.',
  purchaseSuccessfulPopupTitle: 'Successful!',
  saveChangesText: 'Save changes',
  sd: 'SD',
  searchNoResultsDescriptionText:
    'Explore other content by searching for another show, movie, actor, director or genre.',
  searchNoResultsText:
    'Sorry, unable to find exactly what you are looking for.',
  searchPlaceholderText_web: 'Enter title, actors...',
  searchRecommendationText: 'Explore these related titles below:',
  selectLanguageText: 'Select your preferred language',
  showLanguageInfoText_web: 'Show info: ',
  subscriptionIdPrefix: 'Subscription ID: ',
  subscriptionSelectionContinueText: 'CONTINUE',
  subscriptionSelectionTitle: 'Please select one subscription to continue.',
  signupNowQuestion: "Don't have an account?",
  signupNowText: 'Sign up now!',
  termsAndConditionDescriptionText: 'By proceeding, you agree to our',
  termsAndConditionText: 'Terms & Conditions',
  termsAndConditionLoginDescriptionText:
    "By clicking on LOGIN, you agree to StarHub TV+'s",
  tomorrowText: 'Tomorrow',
  todayText: 'Today',
  trackSelectionHeaderAudio: 'Audio',
  trackSelectionHeaderSubtitle: 'Subtitles',
  tryAgainText: 'Try Again',
  viewMoreText: 'view more',
  vodPlayButtonTitle: 'Play',
  whatsInsideText: "What's inside?",
  yesterday: 'Yesterday',
  transactionsPageTitle: 'My transactions',
  r21CreateNewPinTitle: 'Create New R21 PIN',
  parentalCreateNewPinTitle: 'Create New Parental Control PIN',
  errorText: 'Error',
  parentalNewPinDescriptionText_web:
    '(Your default Parental Control PIN is 000000)',
  parentalRestrictChannelLockAll_web: 'LOCK ALL',
  parentalRestrictChannelUnlockAll_web: 'UNLOCK ALL',
  enterNewParentalPinText: 'Enter new Parental PIN',
  confirmNewParentalPinText: 'Confirm new Parental PIN ',
  parentalPinChangeErrorText:
    'Your Parental Control PIN could not be changed. Please try again later.',
  parentalPinContinueSetupTitle: 'Continue to set Parental PIN',
  parentalUpdateHubIdHeadingText_web: 'Step 1/2: Update Hub iD email',
  resetParentalPin: 'Set Parental Control PIN',
  setNewParentalPin_web: 'Step 2/2: Set Parental PIN'
};

export const NUM_REGEX = /^\d*\.?\d*$/;
export const IMAGE_RESIZER_REGEX = /\?w=\d+/;

export const BACKSPACE = 'Backspace';
export const BACKSPACE_KEYCODE = 8;
export const ASTERISK = '*';

export const TRANSLATE_COOKIE_NAME = 'shh-translate-language';

export const SETTINGS_LANGUAGE_CHANGE_DONE = 'languageChangeDone_web';
export const SETTINGS_LANGUAGE_SUCCESS_ICON = 'success';
export const SETTINGS_LANGUAGE_TITLE = 'languageChangeMesageTitle_web';

export const STREAM_TYPE = {
  btv: 'BTV',
  vod: 'VOD'
};

export const PRODUCT_TYPE = {
  SVOD: 'subscription',
  TVOD: 'transactional'
};

export const RAIL_SORT = {
  A_Z: 'Title',
  DATE_SORTING: 'DateAdded'
};
export const DISPLAY_FOR_UAT = false;

export const PARENTAL_SETTING_TYPE = {
  PIN_ENABLED: 'isPinEnabled',
  RESTRICT_PURCHASE: 'restrictInAppPurchasesByPin',
  RESTRICT_CONTENT: 'restrictContentByPin',
  RESTRICT_CHANNELS: 'restrictChannelsByPin'
};

export const RATINGS = ['r21', 'm18', 'nc16', 'pg13', 'pg', 'g'];
export const R21 = 'R21';
export const PIN_VOD_TIMEOUT_MS = 15 * 60 * 1000;

export const LOGIN_ERROR_CODES = {
  deviceDeletedError: ['N1016', 'N20003', 'N20006'],
  deviceLimitReachedError: ['N1020', 'N20007'],
  accountSuspendedError: ['U1010']
};

// localforage keys
export const AUTH_TOKEN_KEY = 'shh-a-info-web';
export const ESSOID_OR_TVID_MAP = 'shh-essoid-tvid-map';
export const USER_PREFERENCE = 'shh-user-pref';

export const PAYMENT_CODES = {
  paymentOk: 'OK'
};

export const MODAL_ICON_TYPE = {
  success: 'success',
  warning: 'warning'
};

export const PURCHASE_STATUS = {
  cancel: 'cancel',
  error: 'error',
  success: 'success'
};

export const PAYMENT_TYPE = {
  CREDIT_CARD: 'credit card',
  VOUCHER_CODE: 'voucher code',
  POSTPAID_BILL: 'postpaid bill',
  IN_APP_PURCHASE: 'app store'
};

export const ASSET_TYPE = {
  linear: 'LINEAR',
  pack: 'PACK',
  vod: 'VOD'
};

export const ASSET_ITEM_TYPENAME = {
  editorial: 'Editorial',
  nagraProgram: 'NagraProgram'
};

export const PREFERENCES_TYPE = {
  audio: 'audio',
  showInfo: 'showInfo',
  subtitles: 'subtitles'
};

export const EXPIRED_TOKEN_ERROR_CODES = ['N1024', 'N1025', 'N99999:403'];
export const PLAYBACK_UNAUTHORIZED_CODE = 'N403';
export const DEFAULT_RATING_WEIGHT = 18; // M18 when no user rating is specified

export const GET_SHORT_LINK =
  'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';
export const FIREBASE_KEY = 'AIzaSyAdyVoDP-4rUdST637H8KlNhg_K3kZVYDI';
export const PAGELINK = 'https://starhubtvplus.page.link/';
export const APP_ID_IOS = '586220439';
export const APP_ID_ANDROID = 'com.starhub.itv';
export const BUNDLE_ID_IOS = 'com.starhub.nmcm.tvanywhere';
export const IOS_CHROME_BANNER_LINK = `https://apps.apple.com/us/app/starhub-tv/id${APP_ID_IOS}?mt=8`;
export const ANDROID_CHROME_BANNER_LINK = `intent://www.starhubtvplus.com/#Intent;scheme=http;package=${APP_ID_ANDROID};end`;
export const FACEBOOK_APP_ID = '906835879435673';

export const STATIC_PAGE_OPTIONS = {
  maintenance: 'maintenance',
  mobileRedirect: 'mobileRedirect'
};

export const authenticatedListing = [
  'continue-watching',
  'favourite-channels',
  'watchlist-rentals',
  'favourite-aired-programs'
];

export const ON_FAVOURITE_CHANGE = 'onFavouriteChange';

export const LOGOUT_TYPE = {
  refreshTokenError: 'REFRESHTOKEN_ERROR',
  userAction: 'USER_ACTION'
};

export const ON_RECOMMENDATION_CHANGE = 'onRecommendationChange';
