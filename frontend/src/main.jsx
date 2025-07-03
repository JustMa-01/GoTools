import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { TributeProvider } from './contexts/TributeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TributeProvider> {/* <-- Add Provider Here */}
          <App />
        </TributeProvider> {/* <-- And Here */}
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)