
import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "@/i18n/translations";

export type Language = "en";

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  availableLanguages: Array<{ code: Language; name: string }>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  const availableLanguages = [
    { code: "en" as Language, name: "English" }
  ];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const translatedText = translations[language]?.[key];
    return translatedText || translations.en[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      availableLanguages
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
