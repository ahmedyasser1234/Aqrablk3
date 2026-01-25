import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import App from './App.jsx';

console.log('🚀 Main.jsx Starting...');

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
  console.log('✅ Render Attempted');
} catch (error) {
  console.error('❌ CRITICAL RENDER ERROR:', error);
}