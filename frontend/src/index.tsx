// ** external packages **
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LicenseManager } from 'ag-grid-enterprise';
import { registerLicense } from '@syncfusion/ej2-base';

// ** css **
import './index.css';
import 'assets/css/theme.css';
import 'reactflow/dist/style.css';

// ** components **
import App from './App';

import Toast from 'components/Toast';
import * as Sentry from '@sentry/react';

// ** redux **
// ** redux **
import store, { persistor } from 'redux/store';
import { PersistGate } from 'redux-persist/integration/react';
// ** others **
import reportWebVitals from './reportWebVitals';
import { setupAxios } from 'axios/axios';
import {
  REACT_APP_AG_GRID_LICENSE_KEY,
  REACT_APP_GOOGLE_CLIENT_ID,
  REACT_APP_SENTRY_DSN,
  REACT_APP_SYNCFUSION_LICENCE_KEY,
  REACT_APP_API_URL,
} from 'config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const googleClientId = REACT_APP_GOOGLE_CLIENT_ID || '';
const syncfusionLicenceKey = REACT_APP_SYNCFUSION_LICENCE_KEY || '';

/* AG Grid Enterprise */
const agGridLicenseKey = REACT_APP_AG_GRID_LICENSE_KEY || '';
LicenseManager.setLicenseKey(agGridLicenseKey);

// ** syncfusion ** //
registerLicense(syncfusionLicenceKey);

setupAxios(store);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: REACT_APP_SENTRY_DSN,
    autoSessionTracking: true,
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', REACT_APP_API_URL],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.05, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

root.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Toast />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
