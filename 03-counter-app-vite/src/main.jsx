import React from 'react';
import ReactDOM from 'react-dom/client';
import {FirstApp} from './FirstApp'
// import {HellowWorld} from './HelloWorldApp'
import './styles.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <FirstApp title="hola, soy Erik" subTitle={123}></FirstApp>
        {/* <HellowWorld></HellowWorld> */}
    </React.StrictMode>
);