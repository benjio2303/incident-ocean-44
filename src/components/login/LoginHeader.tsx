
import React from "react";
import { loginStrings } from "@/i18n/loginStrings";
import SiteTitle from "./SiteTitle";

const LoginHeader: React.FC = () => {
  const strings = loginStrings.en;
  return (
    <header className="w-full flex flex-col items-center mb-8">
      <SiteTitle>
        {strings.title}
      </SiteTitle>
      <div className="w-14 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-cy-darkBlue via-cy-blue to-cy-lightBlue opacity-50" aria-hidden />
      <p className="text-lg font-semibold text-gray-600 dark:text-cy-gray/80 pt-1 text-center">
        {strings.subtitle}
      </p>
    </header>
  );
};

export default LoginHeader;
