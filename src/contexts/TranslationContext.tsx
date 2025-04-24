
import React, { createContext, useContext, ReactNode } from "react";
import { translations } from "@/i18n/translations";

export type Language = "en";

interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  t: (key: string) => translations.en[key] || key,
});

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    language: "en" as Language,
    t: (key: string) => translations.en[key] || key,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(TranslationContext);
};
