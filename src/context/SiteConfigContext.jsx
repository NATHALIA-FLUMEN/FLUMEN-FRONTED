import { createContext, useContext } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig.js';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const { config, loading } = useSiteConfig();

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfigContext() {
  return useContext(SiteConfigContext);
}
