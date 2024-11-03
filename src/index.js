import React from 'react';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import {AxiosProvider} from "./server/AxiosProvider";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AxiosProvider>
            <App/>
        </AxiosProvider>
    </BrowserRouter>);