import React, { useEffect, useState } from "react";
import CardWithMap from "../components/CardWithMap";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, arrayRemove ,doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const UserPage = () => {
    const [orderedTours, setOrderedTours] = useState([]);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(""); // <-- новий стан для імені
  
    // Відстеження входу користувача
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                loadUserName(firebaseUser.email);
                loadOrderedTours(firebaseUser.email);
            } else {
                setUser(null);
                setUserName("");
                setOrderedTours([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Завантажити ім’я користувача з Firestore
    const loadUserName = async (userEmail) => {
        try {
            const userDocRef = doc(db, "users", userEmail);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
            if (userData.name) {
                setUserName(userData.name);
            }
            }
        } catch (error) {
            console.error("Помилка завантаження імені користувача:", error);
        }
    };

    // Завантажити замовлені тури
    const loadOrderedTours = async (userEmail) => {
        try {
          const userDocRef = doc(db, "users", userEmail);
          const userDocSnap = await getDoc(userDocRef);
      
          if (!userDocSnap.exists()) {
            console.error("Користувача не знайдено");
            return;
          }
      
          const userData = userDocSnap.data();
          const orderedIDs = userData.orderedTours || [];
      
          // Отримати всі замовлені тури
          const toursWithPlaces = await Promise.all(
            orderedIDs.map(async (tourId) => {
              const tourDocRef = doc(db, "tours", tourId);
              const tourSnap = await getDoc(tourDocRef);
      
              if (!tourSnap.exists()) return null;
      
              const tourData = { id: tourSnap.id, ...tourSnap.data() };
      
              // Завантаження підколекції places
              const placesSnap = await getDocs(collection(db, "tours", tourId, "places"));
              tourData.places = placesSnap.docs.map((doc) => doc.data());
      
              return tourData;
            })
          );
      
          // Фільтруємо null (якщо якийсь тур не існує)
          const filtered = toursWithPlaces.filter((t) => t !== null);
          setOrderedTours(filtered);
        } catch (error) {
          console.error("Помилка завантаження замовлених турів:", error);
        }
      };

    // Видалення туру з замовлень
    const handleRemoveTour = async (idToRemove) => {
        if (!user) return;
    
        try {
            const userRef = doc(db, "users", user.email);
    
            // Видалити tourId з масиву orderedTours
            await updateDoc(userRef, {
                orderedTours: arrayRemove(idToRemove)
            });
    
            // Повторно завантажити оновлені тури
            loadOrderedTours(user.email);
            console.log("Натиснуто на видалення туру з id:", idToRemove);
        } catch (error) {
            console.error("Помилка видалення туру:", error);
        }
    };

    return (
        <div className="user-page">
            <h1>{userName ? `${userName}, ось ваші тури` : "Ваші тури"}</h1>
    
            {orderedTours.length > 0 ? (
            orderedTours.map((tour, index) => (
                <CardWithMap key={index} tour={tour} index={index} onRemove={handleRemoveTour} user={user}/>
            ))
            ) : (
            <div className="own-tour-div">
                <img src="img/noTours.png" alt="немає нічого" className="no-tour-img" />
                <h2>Ви ще не додали жодного туру!</h2>
            </div>
            )}
        </div>
    );
};

export default UserPage;