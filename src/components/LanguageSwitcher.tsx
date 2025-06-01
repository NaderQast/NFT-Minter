"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    document.documentElement.dir = e.target.value === "ar" ? "rtl" : "ltr";
  };

  return (
    <select
      className="select select-sm select-bordered max-w-xs"
      value={i18n.language}
      onChange={handleLanguageChange}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
