import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
    authDomain: "hot-tours-39775.firebaseapp.com",
    projectId: "hot-tours-39775",
    storageBucket: "hot-tours-39775.firebasestorage.app",
    messagingSenderId: "299242912883",
    appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
    measurementId: "G-TKWTBWYCZZ"
};



const LogIn = () =>{

    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    async function logIn(){
        const email = document.getElementById("email-input").value;
                const password = document.getElementById("password-input").value;
                try{
                    const userCredential = await signInWithEmailAndPassword(auth,email,password);
                    console.log("User signed: "+userCredential.user.email);
                    navigate("/userpage");
                }catch(error){
                    alert("Error: "+error.message);
                }
    }

    return(
        <div className="login-Div">
            <div className="input-div">
                <h1>Вітаємо!</h1>
                <div className="email-div">
                    <input className="email-bar" type="text" id="email-input" placeholder="Введіть email"/>
                </div>
                <div className="password-div">
                    <input className="password-bar" type="password" id="password-input" placeholder="Введіть пароль"/>
                </div>
                <button onClick={logIn} className="login-button">
                    <h3>Увійти</h3>
                </button>
                <Link to="/signup" className="goto-signup-button">
                    <h3>Немає акаунту? Зареєструйтесь!</h3>
                </Link>
            </div>
        </div>
    );
};

export default LogIn;