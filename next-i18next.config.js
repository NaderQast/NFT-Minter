// next-i18next.config.js
/** @type {import('next-i18next').UserConfig} */
const i18nConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    localeDetection: true,
  },
  react: { useSuspense: false },
};

module.exports = i18nConfig;
