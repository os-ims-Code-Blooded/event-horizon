import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './components/App.tsx'
import './style.css';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('app') as HTMLElement;

const root = createRoot(rootElement);
console.log("hello")
if(root) {
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
} else {
  <div> Container not found</div>
}