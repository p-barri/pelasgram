import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
    apiKey: "AIzaSyDmvBs4MJojRRlHjZkdvReDZf3nTdBPvYw",
    authDomain: "pelasgram.firebaseapp.com",
    databaseURL: "https://pelasgram.firebaseio.com",
    projectId: "pelasgram",
    storageBucket: "pelasgram.appspot.com",
    messagingSenderId: "866297088593"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
