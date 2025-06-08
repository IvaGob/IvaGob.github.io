import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"

const firebaseConfig = {
    apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
    authDomain: "hot-tours-39775.firebaseapp.com",
    projectId: "hot-tours-39775",
    storageBucket: "hot-tours-39775.firebasestorage.app",
    messagingSenderId: "299242912883",
    appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
    measurementId: "G-TKWTBWYCZZ"
};

const Navbar = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
    
        return () => unsubscribe();
    }, [auth]);

    return (
        <header className="header">
            <Link to="/main" className="header-button" id="Hbutton1">
                <h2>Гарячі тури</h2>
            </Link>
            {user && (
                <Link to="/userpage" className="header-button" id="Hbutton2">
                <h2>Мої бронювання</h2>
                </Link>
            )}
            {!user && (
                <Link to="/login" className="header-button" id="Hbutton4">
                <h2>Вхід</h2>
                </Link>
            )}
            <Link to="/contactus" className="header-button" id="Hbutton3">
                <h2>Контакти</h2>
            </Link>
            {user && (
                <Link to="/profile" className="header-button" id="Hbutton4">
                <h2>Профіль</h2>
                </Link>
            )}
        </header>
    );
};

export default Navbar;