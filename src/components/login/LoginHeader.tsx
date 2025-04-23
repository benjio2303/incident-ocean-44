
import React from "react";
import { loginStrings } from "@/i18n/loginStrings";

interface LoginHeaderProps {
  lang: "en" | "he" | "el";
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ lang }) => {
  const strings = loginStrings[lang];
  return (
    <header className="w-full flex flex-col items-center mb-8">
      <h1
        className="
          text-center
          text-4xl md:text-5xl
          font-extrabold
          mb-2
          uppercase
          tracking-widest
          bg-gradient-to-r from-cy-darkBlue via-cy-blue to-cy-lightBlue
          bg-clip-text text-transparent
          drop-shadow-[0_2px_10px_rgba(0,86,179,0.14)]
          relative select-none
        "
        style={{ letterSpacing: "0.13em" }}
      >
        {strings.title}
        <span
          className="block w-14 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-cy-darkBlue via-cy-blue to-cy-lightBlue opacity-50"
          aria-hidden
        ></span>
      </h1>
      <p className="text-lg font-semibold text-gray-600 dark:text-cy-gray/80 pt-1 text-center">
        {strings.subtitle}
      </p>
    </header>
  );
};

export default LoginHeader;
