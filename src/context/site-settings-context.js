"use client";
import { useState, createContext, useContext } from "react";

const SiteSettingsContext = createContext(null);

const useSiteSettings = () => {
  const { settings, setSettings } = useContext(SiteSettingsContext);
  return { settings, setSettings };
};

const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState();

  return (
    <SiteSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export { useSiteSettings, SiteSettingsProvider };
