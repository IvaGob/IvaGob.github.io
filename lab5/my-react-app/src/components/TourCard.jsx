import React, { useEffect, useState } from "react";
import '../index.css';
import TourDetails from './TourDetails.jsx';

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import SERVER_URL from "./ServerUrl.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
  authDomain: "hot-tours-39775.firebaseapp.com",
  projectId: "hot-tours-39775",
  storageBucket: "hot-tours-39775.firebasestorage.app",
  messagingSenderId: "299242912883",
  appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
  measurementId: "G-TKWTBWYCZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const TourCard = ({ tour, index }) => {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Отримання поточного користувача та токена
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // Завантаження замовлених турів через сервер
  useEffect(() => {
    const fetchOrderedTours = async () => {
      if (!token) return;

      try {
        // Отримати поточного користувача через токен
        const currentUserRes = await fetch(`${SERVER_URL}/api/currentUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!currentUserRes.ok) throw new Error("Не вдалося отримати поточного користувача");

        const currentUserData = await currentUserRes.json();
        const email = currentUserData.email;

        // Отримати orderedTours через API
        const userRes = await fetch(`${SERVER_URL}/api/user/${email}`);
        if (!userRes.ok) throw new Error("Не вдалося отримати дані користувача");

        const userData = await userRes.json();
        setIsOrdered(userData.orderedTours.includes(tour.id));
      } catch (error) {
        console.error("Помилка отримання замовлень користувача:", error);
      }
    };

    fetchOrderedTours();
  }, [token, tour.id]);

  const [isOrdered, setIsOrdered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Замовити тур (через сервер)
  const handleOrder = async () => {
    if (!user) {
      alert("Спочатку увійдіть у систему");
      return;
    }

    try {
      // Отримати актуальний ID Token
      const token = await user.getIdToken();

      const response = await fetch(`${SERVER_URL}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tourId: tour.id,
        }),
      });

      if (!response.ok) throw new Error("Не вдалося оформити замовлення");

      setIsOrdered(true);
      console.log(`Тур з id=${tour.id} додано до замовлень`);
      closeDetails();
    } catch (error) {
      console.error("Помилка при замовленні туру:", error);
      alert("Виникла помилка при збереженні замовлення. Спробуйте ще раз.");
    }
  };
  const showTourDetails = () => {
    setShowDetails(true);
    const backgroundDiv = document.getElementById("tourDivBackground");
    backgroundDiv.style.display="flex";
  }

  const closeDetails = () => {
    setShowDetails(false);
    const backgroundDiv = document.getElementById("tourDivBackground");
    backgroundDiv.style.display="none";
  }

    return (
        <div className="tourDiv" id={tour.id}>
          <div className="tourName">
            <h1>{tour.title}</h1>
          </div>
    
          <div className="tourDescription">
            <div className="tourDescriptionImage">
              <img src={SERVER_URL+`/`+tour.img} alt={tour.title} className="tourImage" />
            </div>
            <div className="tourDescriptionText">
              <h2>{tour.description}</h2>
            </div>
          </div>
    
          <div id={`map-${index}`} className="map-container"></div>
    
          <div className="tourDivFooter">
            <div className="DurationDiv">
              <div className="DurationDivHead">
                <h1>Тривалість</h1>
              </div>
              <div className="DurationDivText">
                <h2>{tour.duration}</h2>
              </div>
            </div>
            <div className="PriceDiv">
                <div className="PriceDivHead">
                <h1>Ціна</h1>
                    </div>
                    <div className="PriceDivText">
                <h2>{tour.price} грн</h2>
            </div>
            </div>
            <div className="tourOrder">
              {!isOrdered && user && (
                <button className="tourOrderButton" onClick={showTourDetails}>
                  <h2>Замовити</h2>
                </button>
              )}
            </div>
          </div>
          
          {showDetails && <TourDetails tour={tour} onClose={closeDetails} onOrder={handleOrder}/>}
        </div>
      );
};

export default TourCard;