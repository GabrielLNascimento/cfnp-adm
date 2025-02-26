// index.js ou main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importe o Router
import App from './App'; // Importe o componente App

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            {' '}
            {/* Envolva o App com o Router */}
            <App />
        </Router>
    </React.StrictMode>
);
