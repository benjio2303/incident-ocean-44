
import React from "react";
import { Globe } from "lucide-react";
import { loginStrings } from "@/i18n/loginStrings";

interface LanguageSelectorProps {
  lang: "en";
  setLang: (l: "en") => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ lang, setLang }) => {
  const strings = loginStrings[lang];
  return (
    <div className="absolute top-7 right-7 z-20">
      <div className="flex gap-2 items-center px-1 py-0.5 bg-white/70 dark:bg-cy-darkGray/70 rounded shadow">
        <Globe />
        <select
          value={lang}
          onChange={e => setLang(e.target.value as "en")}
          className="px-2 py-0.5 rounded border text-sm bg-transparent"
          aria-label={strings.language}
        >
          {LANGUAGES.map(l => (
            <option value={l.code} key={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
