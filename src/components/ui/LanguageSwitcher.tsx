
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useTranslation();

  // Only allow English
  const handleLanguageChange = (lang: "en") => {
    setLanguage(lang);
  };

  const getLanguageLabel = (code: "en"): string => {
    return 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {getLanguageLabel(language as "en")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages
          .filter(lang => lang.code === "en") // Only show English
          .map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as "en")}
              className={language === lang.code ? "bg-muted" : ""}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
