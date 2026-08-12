import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../i18n/en';
import bn from '../i18n/bn';

const dictionaries = { en, bn };

const LanguageContext = createContext();

const get = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('bloodbridge-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('bloodbridge-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, params = {}) => {
      let str =
        get(dictionaries[lang], key) ?? get(dictionaries.en, key) ?? key;
      Object.keys(params).forEach((k) => {
        str = str.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), params[k]);
      });
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
