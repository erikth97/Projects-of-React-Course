import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    // docuemnte.createElement...
    return (<h1>Hola Mundo</h1>);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
)