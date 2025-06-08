import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
    authDomain: "hot-tours-39775.firebaseapp.com",
    projectId: "hot-tours-39775",
    storageBucket: "hot-tours-39775.firebasestorage.app",
    messagingSenderId: "299242912883",
    appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
    measurementId: "G-TKWTBWYCZZ"
};

const SignUp = () =>{
    const navigate = useNavigate();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    async function signUp(){
        const email = document.getElementById("email-input").value;
        const password = document.getElementById("password-input").value;
        const name = document.getElementById("name-input").value;
        try{
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;
            console.log("User created: "+userCredential.user.email);
            // Створення документа користувача в Firestore
            await setDoc(doc(db, "users", user.email), {
                name: name,
                createdAt: new Date()
            });
            navigate("/userpage");
        }catch(error){
            alert("Error: "+error.message);
        }
    }

    return(
        <div className="login-Div">
            <div className="input-div">
                <h1>Вітаємо!</h1>
                <input className="name-bar" type="text" id="name-input" placeholder="Введіть ім'я"/>
                <input className="email-bar" type="text" id="email-input" placeholder="Введіть email"/>
                <input className="password-bar" type="password" id="password-input" placeholder="Введіть пароль"/>
                <button onClick={signUp} className="login-button">
                    <h3>Зареєструватись</h3>
                </button>
                <Link to="/signup" className="goto-signup-button">
                    <h3>Немає акаунту? Зареєструйтесь!</h3>
                </Link>
            </div>
        </div>
    );
};

export default SignUp;