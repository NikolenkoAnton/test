export enum USER_LOG_ACTIONS {
  SIGN_IN = 'Sign in',
  FORGOT_PASS = 'Forgot password',
  UPDATE_PASS = 'Update password',
  UPDATE_PROFILE = 'Update profile',
  USER_CREATE = 'User creation',
  USER_UPDATE = 'User updating',
  ROLE_CREATE = 'Role creation',
  ROLE_UPDATE = 'Role updating',
  ROLE_DELETE = 'Role deletion',
  TEMPLATE_VIEW_MARKET_CREATE = 'Template view market creation',
  TEMPLATE_VIEW_MARKET_UPDATE = 'Template view market updating',
  TEMPLATE_VIEW_MARKET_DELETE = 'Template view market deletion',
  TRANSLATE_LANGUAGE_CREATE = 'Translate language creation',
  TRANSLATE_LANGUAGE_UPDATE = 'Translate language updating',
  TRANSLATE_LANGUAGE_DELETE = 'Translate language deleting',
  TRANSLATE_KEY_CREATE = 'Translate key creation',
  TRANSLATE_KEY_UPDATE = 'Translate key updating',
  TRANSLATE_KEY_DELETE = 'Translate key deletion',
  COMPETITION_TOP_CREATE = 'Competition top creation',
  COMPETITION_TOP_UPDATE = 'Competition top updating',
  COMPETITION_TOP_DELETE = 'Competition top deletion',
  CMS_CHOOSE_IMG = 'CMS choose img',
  CMS_DELETE_IMG = 'CMS delete img',
  CMS_SAVE_PAGE = 'Seo management page creation',
  CMS_UPDATE_PAGE = 'Seo management page updating',
  CMS_DELETE_PAGE = 'CMS delete page',
  CMS_PAGE_DEFAULT = 'CMS edit general settings',
  TEASER_CREATE = 'Teaser creation',
  TEASER_UPDATE = 'Teaser updating',
  TEASER_DELETE = 'Teaser deletion',
  MAIN_BANNER_SLIDE_CREATE = 'Main banner slide creation',
  MAIN_BANNER_SLIDE_UPDATE = 'Main banner slide updating',
  MAIN_BANNER_SLIDE_DELETE = 'Main banner slide deletion',
  STATIC_PAGE_CREATE = 'Static page creation',
  STATIC_PAGE_UPDATE = 'Static page updating',
  STATIC_PAGE_DELETE = 'Static page delete',

  CMS_FOOTER_BLOCK_CREATE = 'Cms footer block creation',
  CMS_FOOTER_BLOCK_UPDATE = 'Cms footer block updating',
  CMS_FOOTER_BLOCK_DELETE = 'Cms footer block delete',

  CMS_FOOTER_GROUP_CREATE = 'Cms footer group creation',
  CMS_FOOTER_GROUP_DELETE = 'Cms footer group delete',

  CMS_FOOTER_ELEMENT_CREATE = 'Cms footer element creation',
  CMS_FOOTER_ELEMENT_DELETE = 'Cms footer element delete',

  CMS_FOOTER_TEXT_CREATE = 'Cms footer text creation',
  CMS_FOOTER_TEXT_UPDATE = 'Cms footer text updating',
  CMS_FOOTER_TEXT_DELETE = 'Cms footer text deletion',

  CMS_FOOTER_LOGO_CREATE = 'Cms footer logo creation',
  CMS_FOOTER_LOGO_UPDATE = 'Cms footer logo updating',
  CMS_FOOTER_LOGO_DELETE = 'Cms footer logo deletion',

  CMS_FOOTER_CHAT_CREATE = 'Cms footer chat creation',
  CMS_FOOTER_CHAT_UPDATE = 'Cms footer chat updating',
  CMS_FOOTER_CHAT_DELETE = 'Cms footer chat deletion',

  CMS_FOOTER_VALIDATOR_CREATE = 'Cms footer validator creation',
  CMS_FOOTER_VALIDATOR_UPDATE = 'Cms footer validator updating',
  CMS_FOOTER_VALIDATOR_DELETE = 'Cms footer validator deletion',

  CMS_HEADER_BLOCK_UPDATE = 'Cms header block updating',

  CMS_PUBLIC_FILE_CREATE = 'Cms public file creation',
  CMS_PUBLIC_FILE_DELETE = 'Cms public file deletion',

  TRANSLATE_LANGUAGES_BULK_UPDATE = 'Translate Languages bulk update',

  BURGER_BLOCK_UPDATE = 'Burger block updating',
  BURGER_BLOCK_ITEM_UPDATE = 'Burger block item update',
  BURGER_BLOCK_ITEM_DELETE = 'Burger block item deletion',

  FORM_BANNER_SLIDE_CREATE = 'Form banner slide creation',
  FORM_BANNER_SLIDE_UPDATE = 'Form banner slide updating',
  FORM_BANNER_SLIDE_DELETE = 'Form banner slide deletion',

  EXTERNAL_BANNER_SLIDE_CREATE = 'External banner slide creation',
  EXTERNAL_BANNER_SLIDE_UPDATE = 'External banner slide updating',
  EXTERNAL_BANNER_SLIDE_DELETE = 'External banner slide deletion',

  BET_HISTORY_FILTER_PRESET_CREATE = 'Bet history filter preset creation',
  BET_HISTORY_FILTER_PRESET_DELETE = 'Bet history filter preset deletion',
  GENERATE_BET_HISTORY_XML_FILE = 'Generate bet history xml file',

  SITE_DOMAIN_CREATE = 'Site domain creation',
  SITE_DOMAIN_UPDATE = 'Site domain updating',
  SITE_DOMAIN_DELETE = 'Site domain deletion',

  SAVE_RMT_BASE_SETTINGS = 'Save rmt base settings',
  SAVE_RMT_MARKET = 'Save rmt market',
  SAVE_RMT_PLAYER = 'Save rmt player',
  SAVE_RMT_SPORT = 'Save rmt sport',
  SAVE_RMT_TEAM = 'Save rmt team',

  SAVE_NOTE = 'Save note',
}
export const OPEN_ROUTES = new Set<string>();

export enum CMS_HEADER_BLOCK_TYPES_ENUM {
  LOGO = 'LOGO',
  SPORTS = 'SPORTS',
  LIVE = 'LIVE',
  OUTRIGTHS = 'OUTRIGTHS',
  BONUSES = 'BONUSES',
  CASINO = 'CASINO',
  RESULTS = 'RESULTS',
}

export enum USER_LOG_SEARCH_BY_ENUM {
  USER = 'user',
  ACTION = 'action',
}

export enum PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM {
  REPLACE = 'replace',
  EXTEND = 'extend',
}

export enum MAIN_BANNER_SLIDE_SCHEDULE_ENUM {
  now = 'now',
  scheduled = 'scheduled',
}

export enum MAIN_BANNER_SLIDE_TYPE_ENUM {
  HALF_IMAGE_WITH_BUTTON = 'half_image_with_button',
  HALF_IMAGE_NO_BUTTON = 'half_image_no_button',
  FULL_IMAGE_WITH_BUTTON = 'full_image_with_button',
  FULL_IMAGE_NO_BUTTON = 'full_image_no_button',
}

export enum FORM_BANNER_SLIDE_TYPE_ENUM {
  REGISTER = 'register',
  LOGIN = 'login',
  RECOVER_PASSWORD = 'recover_password',
}

export enum TEASER_EVENT_STATUS_ENUM {
  ALL = 'all',
  PREMATCH = 'prematch',
  LIVE = 'live',
}

export enum IMAGE_DESTINATION_ENUM {
  TOP_COMPETITION = 'top_competition',
  TEASER = 'teaser',
  MAIN_BANNER_SLIDE = 'main_banner_slide',
  CMS_FOOTER_LOGO = 'cms_footer_logo',
  LANGUAGE_ICON = 'language_icon',
  FORM_BANNER_SLIDE = 'form_banner_slide',
  SITE_DOMAIN_LOGO = 'site_alias_logo',
  CMS = 'cms',
}

export enum SS_EVENT_STATUSES {
  PREMATCH = 0,
  LIVE = 1,
  STOPPED = 2,
  CLOSED = 3,
  FINISHED = 4,
  NOT_COVER = 5,
}

export enum ENTITY_TYPES {
  TEASER = 'teaser',
}

export enum TEASER_TYPE {
  teamsLogo = 'teams_logo',
  backgroundImage = 'background_image',
}

export const MAX_CMS_FOOTER_GROUP_COUNT = 4;

export enum CMS_FOOTER_LOGO_TYPE {
  COLORED = 'colored',
  UNCOLORED = 'uncolored',
}
export const MAX_LANGUAGE_ICON_FILE_SIZE = 100 * 1000; //100kb

export const MAX_LOGO_FILE_SIZE = 500 * 1000; //500kb

export const MAX_IMAGE_FILE_SIZE = 1000 * 1000; //1mb

export const MAX_PUBLIC_FILE_SIZE = 32 * 1000 * 1000; //32mb

export const ALLOWED_LOGO_IMAGE_MIMETYPES = ['image/png', 'image/svg+xml', 'image/jpeg'];

export const MAX_TEASER_UPLOAD_FILES = 10;

export enum BET_HISTORY_TABLE_COLUMNS_ENUM {
  ID = 'id',
  USER_ID = 'user_id',
  PLATFORM_ID = 'platform_id',
  USER_IP = 'user_ip',

  CASHOUT_AMOUNT = 'cashout_amount',
  TYPE = 'type',
  CLOSED = 'closed',
  STAKE = 'stake',
  CURRENCY_CODE = 'currency_code',
  CURRENCY_VALUE = 'currency_value',

  MAIN_RESULT = 'main_result',
  MAIN_ODDS = 'main_odds',
  ODDS = 'odds',
  WIN = 'win',
  POSSIBLE_WIN = 'possible_win',
  CURRENT_POSSIBLE_WIN = 'current_possible_win',

  SYSTEM = 'system',
  COMMENT = 'comment',

  CREATED_AT = 'created_at',
  RESULTED_AT = 'resulted_at',

  PREMATCH = 'prematch',
  GAME_ID = 'game_id',
  TEAMS = 'teams',
  OUTCOME_ID = 'outcome_id',
  OUTCOME_NAME = 'outcome_name',
  GAME_OUTCOME_VALUE = 'game_outcome_value',
  GAME_MARKET_ID = 'game_market_id',

  RISK_DEFAULT = 'risk_default',
  RISK_CUSTOM = 'risk_custom',

  STAKE_DEFAULT = 'stake_default',
  STAKE_CUSTOM = 'stake_custom',
  RESULT = 'result',

  EVENT_START = 'event_start',
  EVENT_FINISH = 'event_finish',

  SPORT_NAME = 'sport_name',
  CATEGORY_NAME = 'category_name',
  COMPETITION_NAME = 'competition_name',
  GAME_STATUS = 'game_status',
  GAME_NAME = 'game_name',

  MARKET_NAME = 'market_name',
  MARKET_ID = 'market_id',

  BONUS_TYPE = 'bonus_type',
  BONUS_ID = 'bonus_id',
}

const {
  ID,
  USER_ID,
  PLATFORM_ID,
  USER_IP,
  TYPE,
  CLOSED,
  STAKE,
  WIN,
  POSSIBLE_WIN,
  SYSTEM,
  COMMENT,
  CREATED_AT,
  RESULTED_AT,
  PREMATCH,
  GAME_ID,
  TEAMS,
  OUTCOME_ID,
  GAME_OUTCOME_VALUE,
  GAME_MARKET_ID,
  ODDS,
  RISK_DEFAULT: RISK,
  RESULT,
  EVENT_START,
  EVENT_FINISH,
  SPORT_NAME,
  CATEGORY_NAME,
  COMPETITION_NAME,
  GAME_STATUS,
  GAME_NAME,
  MARKET_NAME,
  MARKET_ID,
  CURRENCY_CODE,
  CURRENCY_VALUE,
} = BET_HISTORY_TABLE_COLUMNS_ENUM;

export const BET_COLUMNS = [
  ID,
  USER_ID,
  TYPE,
  CLOSED,
  STAKE,
  WIN,
  POSSIBLE_WIN,
  ODDS,
  SYSTEM,
  COMMENT,
  CREATED_AT,
  RESULTED_AT,
  CURRENCY_VALUE,
  CURRENCY_CODE,
];

export const BET_ATTRIBUTES_COLUMNS = [PLATFORM_ID, USER_IP];

export const BET_OUTCOME_COLUMNS = [
  PREMATCH,
  GAME_ID,
  TEAMS,
  OUTCOME_ID,
  GAME_OUTCOME_VALUE,
  GAME_MARKET_ID,
  ODDS,
  RISK,
  RESULT,
  EVENT_START,
  EVENT_FINISH,
  SPORT_NAME,
  CATEGORY_NAME,
  COMPETITION_NAME,
  GAME_STATUS,
  GAME_NAME,
  MARKET_NAME,
  MARKET_ID,
];

export enum BURGER_BLOCK_TYPES {
  PREMATCH = 'prematch',
  LIVE = 'live',
  OUTRIGHTS = 'outrights',
  FINISHED = 'finished',
}

export enum SITE_DOMAIN_LOGO_TYPES {
  BIG_LOGO = 'big_logo',
  SMALL_LOGO = 'small_logo',
  FAVICON = 'favicon',
}

export const DEFAULT_RMT_PERIOD = 3; //months

export enum REDIRECT_PAGE_TYPES {
  CONSTANT = 301,
  TEMP = 302,
}

export enum SORT_DIR {
  ASC = 'asc',
  DESC = 'desc',
}

const GENERAL_RMT_SORT_FIELDS = [
  'profit',
  'bet_sum',
  'bet_quantity',
  'rtp',
  'max_risk_bet',
  'delay',
  'max_win_player_event',
  'margin',
];

export const RMT_MARKET_SORT = ['sport', 'market', ...GENERAL_RMT_SORT_FIELDS];

export const RMT_SPORT_BY_CATEGORY_SORT = ['sport', 'category', 'competition', ...GENERAL_RMT_SORT_FIELDS];

export const RMT_SPORT_SORT = ['sport', ...GENERAL_RMT_SORT_FIELDS];

export const RMT_TEAM_SORT = ['sport', 'team', ...GENERAL_RMT_SORT_FIELDS];

export const RMT_CATEGORY_SORT = ['category', ...GENERAL_RMT_SORT_FIELDS];

export const RMT_COMPETITION_SORT = ['competition', ...GENERAL_RMT_SORT_FIELDS];

export enum ENTITY_NAME {
  SPORT = 'sport',
  CATEGORY = 'category',
  COMPETITION = 'competition',
  EVENT = 'event',
}
