import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import App from './App.jsx';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('🗑️  إزالة Service Worker قديم:', registration.scope);
      registration.unregister();
    });
  });
}

try {
  localStorage.setItem('test-storage', 'test');
  localStorage.removeItem('test-storage');
} catch (error) {
  console.error(' localStorage غير متاح:', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);