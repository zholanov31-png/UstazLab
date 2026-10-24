import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LangProvider } from './i18n/LangContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { isSupabaseConfigured } from './lib/supabase.js';
import SetupNotice from './pages/SetupNotice.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LangProvider>
      {isSupabaseConfigured ? (
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      ) : (
        <SetupNotice />
      )}
      </LangProvider>
    </ThemeProvider>
  </StrictMode>,
);
