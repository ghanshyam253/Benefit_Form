import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import './css/formsthirdparty.css';
import './css/formslive.css';
import './css/default.css';
import './css/media.css';
import './css/defaultMedia.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import Main from "./components/Main";


const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      {/* <App /> */}
      <Main />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
