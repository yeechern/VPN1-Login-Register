import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import translate_en from "./translation/en/translate.json"
import translate_zh from "./translation/zh/translate.json"
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next';


i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  fallbackLng:'en',
  resources: {
    en:{
      translation: translate_en
    },
    zh:{
      translation: translate_zh
    }

  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
