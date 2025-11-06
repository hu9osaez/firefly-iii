// Vue i18n configuration for Firefly III v3
import { createI18n } from 'vue-i18n';
import enCommon from '@/locales/en/common.json';

// Import other locales as needed
// import esCommon from '@/locales/es/common.json';
// import frCommon from '@/locales/fr/common.json';
// import deCommon from '@/locales/de/common.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      ...enCommon,
    },
    // Add other locales here
    // es: { ...esCommon },
    // fr: { ...frCommon },
    // de: { ...deCommon },
  },
});

export default i18n;
