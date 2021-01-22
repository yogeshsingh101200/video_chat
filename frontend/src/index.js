import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import 'bootswatch/dist/solar/bootstrap.min.css';
import './style.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
