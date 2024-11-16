import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './components/App'
import './style.css';
const rootElement = document.getElementById('app') as HTMLElement;

const root = createRoot(rootElement);

if(root) {
  root.render(<App />)
} else {
  <div> Container not found</div>
}