import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ReCaptchaContext = createContext(null);

export function ReCaptchaProvider({ siteKey, children }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!siteKey || scriptLoaded.current) return;
    scriptLoaded.current = true;

    const existing = document.querySelector('script[data-recaptcha]');
    if (existing) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    script.onload = () => setReady(true);
    script.onerror = () => {
      setError('No se pudo cargar la verificación de seguridad');
    };
    document.head.appendChild(script);
  }, [siteKey]);

  async function execute(action = 'submit') {
    if (!ready || !window.grecaptcha) return null;
    try {
      return await new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            resolve(token);
          } catch {
            resolve(null);
          }
        });
      });
    } catch {
      return null;
    }
  }

  return (
    <ReCaptchaContext.Provider value={{ ready, error, execute }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useReCaptcha() {
  return useContext(ReCaptchaContext);
}
