import React from 'react';
import ReactDOM from 'react-dom/client'; // Note: Import from 'react-dom/client'
import App from './App';
import './index.css'; // Import your CSS (if any)

// Create the root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
