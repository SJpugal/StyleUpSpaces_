import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            header: {
                searchPlaceholder: "Search for properties, interior design, services...",
                login: "Login",
                signup: "Sign Up",
                bangalore: "Bangalore"
            },
            hero: {
                title: "Elevate Your Living, Every Step of the Way.",
                tabBuy: "Buy",
                tabRent: "Rent",
                tabCommercial: "Commercial",
                searchLoc: "Search up to 3 localities for",
                addMore: "Add more...",
                searchBtn: "Search"
            }
        }
    },
    hi: {
        translation: {
            header: {
                searchPlaceholder: "संपत्ति, इंटीरियर डिज़ाइन, सेवाओं की खोज करें...",
                login: "लॉग इन",
                signup: "साइन अप",
                bangalore: "बेंगलुरु"
            },
            hero: {
                title: "अपने रहन-सहन को ऊँचा उठाएं, हर कदम पर।",
                tabBuy: "खरीदें",
                tabRent: "किराया",
                tabCommercial: "वाणिज्यिक",
                searchLoc: "3 इलाकों तक खोजें",
                addMore: "और जोड़ें...",
                searchBtn: "खोजें"
            }
        }
    },
    ta: {
        translation: {
            header: {
                searchPlaceholder: "சொத்துக்கள், உள்துறை வடிவமைப்பு, சேவைகளைத் தேடுங்கள்...",
                login: "உள்நுழைக",
                signup: "பதிவு செய்க",
                bangalore: "பெங்களூர்"
            },
            hero: {
                title: "உங்கள் வாழ்க்கையை உயர்த்துங்கள், ஒவ்வொரு அடியிலும்.",
                tabBuy: "வாங்கு",
                tabRent: "வாடகை",
                tabCommercial: "வணிகம்",
                searchLoc: "3 இடங்கள் வரை தேடுங்கள்",
                addMore: "மேலும் சேர்...",
                searchBtn: "தேடு"
            }
        }
    },
    kn: {
        translation: {
            header: {
                searchPlaceholder: "ಆಸ್ತಿ, ಒಳಾಂಗಣ ವಿನ್ಯಾಸ, ಸೇವೆಗಳಿಗಾಗಿ ಹುಡುಕಿ...",
                login: "ಲಾಗಿನ್",
                signup: "ಸೈನ್ ಅಪ್",
                bangalore: "ಬೆಂಗಳೂರು"
            },
            hero: {
                title: "ನಿಮ್ಮ ಜೀವನ ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸಿ, ಪ್ರತಿ ಹಂತದಲ್ಲೂ.",
                tabBuy: "ಖರೀದಿಸಿ",
                tabRent: "ಬಾಡಿಗೆ",
                tabCommercial: "ವಾಣಿಜ್ಯ",
                searchLoc: "3 ಸ್ಥಳಗಳವರೆಗೆ ಹುಡುಕಿ",
                addMore: "ಇನ್ನಷ್ಟು ಸೇರಿಸಿ...",
                searchBtn: "ಹುಡುಕಿ"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
