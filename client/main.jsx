import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter }  from 'react-router'
import './index.css'
import './custom.css'
import App from './App.jsx'

const rootEl = document.getElementById('root');

const appTree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Hydrate pre-rendered HTML if present (home page), otherwise plain mount
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, appTree);
} else {
  createRoot(rootEl).render(appTree);
}
