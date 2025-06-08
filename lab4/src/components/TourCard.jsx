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

  // Встановлення користувача
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.email);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const orderedTours = userSnap.data().orderedTours || [];
          setIsOrdered(orderedTours.includes(tour.id));
        }
      }
    });
    return () => unsubscribe();
  }, [tour.id]);

  const [isOrdered, setIsOrdered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleOrder = async () => {
  if (!user) {
    alert("Спочатку увійдіть у систему");
    return;
  }

  const db = getFirestore(app);
  const userDocRef = doc(db, "users", user.email);

  try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Документ існує → оновити масив
        await updateDoc(userDocRef, {
          orderedTours: arrayUnion(tour.id)
        });
      } else {
        // Документ НЕ існує → створити з першим замовленням
        await setDoc(userDocRef, {
          orderedTours: [tour.id]
        });
      }

      setIsOrdered(true);
      console.log(`Тур з id=${tour.id} додано до замовлень користувача ${user.email}`);
      closeDetails();
    } catch (error) {
      console.error("Помилка при додаванні замовлення:", error);
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
              <img src={tour.img} alt={tour.title} className="tourImage" />
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