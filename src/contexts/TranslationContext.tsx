
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations } from "@/i18n/translations";

export type Language = "en" | "he" | "el";

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  availableLanguages: Array<{ code: Language; name: string }>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem("language") as Language) || "en"
  );

  const availableLanguages = [
    { code: "en" as Language, name: "English" },
    { code: "he" as Language, name: "עברית" },
    { code: "el" as Language, name: "Ελληνικά" }
  ];

  // Set language and store in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  // Translate function
  const t = (key: string): string => {
    const translatedText = translations[language]?.[key];
    return translatedText || translations.en[key] || key;
  };

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

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
