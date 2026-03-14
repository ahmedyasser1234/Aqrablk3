import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';
import './index.css';
import App from './App.jsx';

console.log('🚀 Main.jsx Starting...');

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Router>
        <LanguageProvider>
          <ThemeProvider>
            <ModalProvider>
              <GlobalModal />
              <App />
            </ModalProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Router>
    </StrictMode>
  );
  console.log('✅ Render Attempted');
} catch (error) {
  console.error('❌ CRITICAL RENDER ERROR:', error);
}