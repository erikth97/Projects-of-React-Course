import React from 'react';
import ReactDOM from 'react-dom/client';
import {FirstApp} from './FirstApp'
import {HellowWorld} from './HelloWorldApp'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <FirstApp></FirstApp>
        {/* <HellowWorld></HellowWorld> */}
    </React.StrictMode>
)