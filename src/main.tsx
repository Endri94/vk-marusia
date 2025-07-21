import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import './index.css';
import { LoadingFallback } from './components/LoadingFallback/LoadingFallback';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode >
);
