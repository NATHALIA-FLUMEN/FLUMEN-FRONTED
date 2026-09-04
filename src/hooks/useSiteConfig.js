import { useCallback, useEffect, useState } from 'react';
import { configService } from '../services/api.js';

export function useSiteConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    configService
      .getConfig()
      .then((res) => {
        if (active) setConfig(res.data || {});
      })
      .catch(() => {
        if (active) setConfig({});
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
}

export function useReCaptcha() {
  const [siteKey, setSiteKey] = useState(null);

  useEffect(() => {
    configService
      .getConfig()
      .then((res) => setSiteKey(res.data?.recaptchaSiteKey || null))
      .catch(() => {});
  }, []);

  const execute = useCallback(
    (action) =>
      new Promise((resolve) => {
        if (!window.grecaptcha || !siteKey) {
          resolve(null);
          return;
        }
        try {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(siteKey, { action: action || 'submit' })
              .then(resolve)
              .catch(() => resolve(null));
          });
        } catch {
          resolve(null);
        }
      }),
    [siteKey]
  );

  return { siteKey, execute };
}
