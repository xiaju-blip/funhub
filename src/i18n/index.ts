import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

// Import language files directly for faster development
import common_en from './locales/en/common.json'
import common_zh from './locales/zh/common.json'
import home_en from './locales/en/home.json'
import home_zh from './locales/zh/home.json'
import trade_en from './locales/en/trade.json'
import trade_zh from './locales/zh/trade.json'
import drama_en from './locales/en/drama.json'
import drama_zh from './locales/zh/drama.json'
import profile_en from './locales/en/profile.json'
import profile_zh from './locales/zh/profile.json'
import auth_en from './locales/en/auth.json'
import auth_zh from './locales/zh/auth.json'
import stake_en from './locales/en/stake.json'
import stake_zh from './locales/zh/stake.json'

const resources = {
  en: {
    common: common_en,
    home: home_en,
    trade: trade_en,
    drama: drama_en,
    profile: profile_en,
    auth: auth_en,
    stake: stake_en,
  },
  zh: {
    common: common_zh,
    home: home_zh,
    trade: trade_zh,
    drama: drama_zh,
    profile: profile_zh,
    auth: auth_zh,
    stake: stake_zh,
  },
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
