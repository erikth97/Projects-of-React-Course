import React from 'react';
import ReactDOM from 'react-dom/client';
import {CounterApp} from './CounterApp';

import {FirstApp} from './FirstApp'
// import {HellowWorld} from './HelloWorldApp'
import './styles.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* <CounterApp value={10}></CounterApp> */}
        <FirstApp title="hola, soy Erik"></FirstApp>
    </React.StrictMode>
);