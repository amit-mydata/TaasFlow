import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Toast notifications container */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000, // auto dismiss after 4s
        style: {
          background: '#333',
          color: '#fff',
          fontWeight: '500',
        },
      }}
    />

  </StrictMode>
);
