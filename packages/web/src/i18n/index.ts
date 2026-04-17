import { createI18n } from 'vue-i18n';
import zh from '../locales/zh.js';
import en from '../locales/en.js';

export type Locale = 'zh' | 'en';

const savedLocale = (localStorage.getItem('wec-locale') as Locale) || 'zh';

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh',
  messages: { zh, en },
});
