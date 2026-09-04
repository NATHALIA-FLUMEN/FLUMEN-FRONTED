import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { VideoProvider } from './context/VideoContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SiteConfigProvider } from './context/SiteConfigContext.jsx';
import { ReCaptchaProvider } from './components/auth/ReCaptchaProvider.jsx';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

// Solo montar Google/recaptcha si las claves son reales (no placeholders)
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('TU_')
    ? import.meta.env.VITE_GOOGLE_CLIENT_ID
    : '';
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY &&
  !import.meta.env.VITE_RECAPTCHA_SITE_KEY.includes('TU_')
    ? import.meta.env.VITE_RECAPTCHA_SITE_KEY
    : '';

const ENABLE_GOOGLE = Boolean(GOOGLE_CLIENT_ID);

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReCaptchaProvider siteKey={RECAPTCHA_SITE_KEY}>
          <SiteConfigProvider>
            {ENABLE_GOOGLE ? (
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <VideoProvider>
                  <App />
                </VideoProvider>
              </GoogleOAuthProvider>
            ) : (
              <VideoProvider>
                <App />
              </VideoProvider>
            )}
          </SiteConfigProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#151838',
                color: '#fff',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: '12px'
              },
              success: { iconTheme: { primary: '#00e5ff', secondary: '#fff' } },
              error: { iconTheme: { primary: '#7c5cff', secondary: '#fff' } }
            }}
          />
        </ReCaptchaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(app);

