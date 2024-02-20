import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import english from "../../translations/en.json";
import french from "../../translations/fr.json";
import spanish from "../../translations/es.json";

const resources = {
    en: {
        translation: english,
    },
    fr: {
        translation: french,
    },
    es: {
        translation: spanish
    }
};

export const languageVariants = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES'
};


const initTranslation = () => { 
    i18next.use(initReactI18next)
        .init({
            resources,
            lng: "en",
            interpolation: {
                escapeValue: false,
            },
            fallbackLng: "en"
        });
}

export default initTranslation;