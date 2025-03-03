import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '../src/locales/en/transaction.json';
import viTranslation from '../src/locales/vn/transaction.json';

// Cấu hình i18next
i18n
    .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt
    .use(initReactI18next) // Tích hợp với React
    .init({
        resources: {
            en: { translation: enTranslation },
            vi: { translation: viTranslation }
        },
        fallbackLng: 'en', // Ngôn ngữ dự phòng
        interpolation: {
            escapeValue: false // Không escape HTML
        }
    });

export default i18n;