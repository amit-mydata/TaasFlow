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
    // Default options for all toasts
    duration: 4000,
    style: {
      background: 'red', // red background
      color: 'white',    // white text
      fontWeight: '500',
    },
    // You can also specify different options for different types
    error: {
      style: {
        background: 'red',
        color: 'white',
      },
    },
    success: {
      style: {
        background: 'green',
        color: 'white',
      },
    },
  }}
/>


  </StrictMode>
);
