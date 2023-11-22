import React from 'react';
import ReactDOM from 'react-dom/client';
import {FirstApp} from './FirstApp'
// import {HellowWorld} from './HelloWorldApp'
import {CounterApp} from './CounterApp';
import './styles.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* <FirstApp title="hola, soy Erik" subTitle={123}></FirstApp> */}
        {/* <HellowWorld></HellowWorld> */}
        <CounterApp value={10}></CounterApp>
    </React.StrictMode>
);