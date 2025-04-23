
import React from "react";

interface SiteTitleProps {
  children: React.ReactNode;
}

const SiteTitle: React.FC<SiteTitleProps> = ({ children }) => {
  return (
    <div className="w-full flex justify-center">
      <span
        className="
          text-4xl md:text-5xl
          font-extrabold
          mb-2
          uppercase
          tracking-widest
          select-none
          transition-colors
          text-cy-darkBlue
          dark:text-white
          text-center
          drop-shadow
          "
        style={{ letterSpacing: "0.13em" }}
      >
        {children}
      </span>
    </div>
  );
};

export default SiteTitle;

