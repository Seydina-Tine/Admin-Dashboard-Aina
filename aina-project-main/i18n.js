import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './langues/ar.json'
import ru from './langues/ru.json'
import zh from './langues/zh.json'
import el from './langues/el.json'
import en from './langues/en.json'
import fr from './langues/fr.json'
import de from './langues/de.json'
import es from './langues/es.json'


const resources = {
  en: {
    translation: en  // anglais
  },
  fr: {
    translation: fr // francais
  },
  es: {
    translation: es // espagnol 
  },
  ar: {
    translation: ar // 'العربية'
  },
  zh: {
    translation: zh // 普通话
  },
  el: {
    translation: el // Ελληνικά
    }
  ,
 
  de: {
    translation: de // Deutsch
  },
  
  ru: {
    translation: ru // Русский
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'fr', // Langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
