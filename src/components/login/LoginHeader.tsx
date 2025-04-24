
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
    </header>
  );
};

export default LoginHeader;
