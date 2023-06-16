import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en_language_data } from "./en-language";
import { guj_language_data } from "./guj-language";

i18n.use(initReactI18next).init({
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  resources: {
    en: {
      translation: en_language_data,
    },
    guj: {
      translation: guj_language_data,
    },
  },
});

export default i18n;
