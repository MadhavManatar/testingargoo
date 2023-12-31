export const {
  REACT_APP_API_VERSION,
  REACT_APP_NEXT_BILLION_API_KEY,
  REACT_APP_GOOGLE_CLIENT_ID,
  REACT_APP_AG_GRID_LICENSE_KEY,
  REACT_APP_APPLE_CLIENT_ID,
  REACT_APP_APPLE_REDIRECT_URI,
  REACT_APP_SYNCFUSION_LICENCE_KEY,
  REACT_APP_FRONT_URL,
  REACT_APP_ZOOM_REDIRECT_URI,
  REACT_APP_API_BASE_URL,
  REACT_APP_PUBLIC_VAPID_KEY,
  REACT_APP_SIP_URI,
  REACT_APP_DEEPGRAM_KEY,
  REACT_APP_SENTRY_DSN,
  REACT_APP_GOOGLE_MAP_API_KEY,
} = process.env;
export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}${REACT_APP_API_VERSION}`;
export const REACT_APP_API_URL_WITHOUT_VERSION = process.env.REACT_APP_API_URL;
