import React, { useEffect,useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const CardWithMap = ({ tour, index, onRemove, user }) => {
  const [value, setValue] = useState(5);
  const [text, setText] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const checkFeedback = async () => {
      if (!user) return;

      // Перевірка відгуків
      const feedbackRef = collection(db, "tours", tour.id, "feedbacks");
      const feedbackSnap = await getDocs(feedbackRef);
      feedbackSnap.forEach(doc => {
        const data = doc.data();
        if (data.userEmail === user.email) {
          setAlreadyReviewed(true);
        }
      });
    };

    checkFeedback();
  }, [user, tour.id]);

  const handleAddFeedback = async () => {
    if (!user) {
      alert("Увійдіть, щоб залишити відгук.");
      return;
    }

    try {
      const feedbackRef = collection(db, "tours", tour.id, "feedbacks");
      await addDoc(feedbackRef, {
        value,
        text,
        userEmail: user.email,
        createdAt: serverTimestamp()
      });

      setAlreadyReviewed(true);
      alert("Відгук успішно додано!");
      setText("");
    } catch (error) {
      console.error("Помилка додавання відгуку:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  };

  useEffect(() => {
    const mapId = `map-${index}`;

    // Ініціалізація карти
    mapRef.current = L.map(mapId).setView(
      [tour.places[0]?.lat || 48.3, tour.places[0]?.lon || 24.5],
      8
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Додавання маркерів
    tour.places.forEach((place) => {
      L.marker([place.lat, place.lon])
        .addTo(mapRef.current)
        .bindPopup(`<b>${place.name}</b><br>${place.desc}`);
    });

    // Очищення карти при анмаунті компонента
    return () => {
      mapRef.current?.remove();
    };
  }, [tour.places, index]);

  const addFeedback = async (tourId, value, text, user) => {
    if (!user) {
      alert("Щоб залишити відгук, увійдіть у систему.");
      return;
    }
  
    try {
      const feedbackRef = collection(db, "tours", tourId, "feedbacks");
  
      await addDoc(feedbackRef, {
        value,
        text,
        userEmail: user.email,
        createdAt: serverTimestamp()
      });
  
      alert("Відгук успішно додано!");
    } catch (error) {
      console.error("Помилка додавання відгуку:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  };



  return (
    <div className="orderedTourDiv">
      <button className="closeButton" onClick={() => onRemove(tour.id)}>
        <img src="img/back-button.png" className="back-button" />
      </button>
      <h1>{tour.title}</h1>
      <h2>{tour.description}</h2>
      <div
        id={`map-${index}`}
        className="map-container"
        style={{ height: "300px", width: "100%", marginTop: "1rem" }}
      ></div>
      {!alreadyReviewed ? (
        <div className="feedback-div">
          <h1>Залишіть відгук:</h1>
          <label>
            Оцінка:
            <select value={value} onChange={(e) => setValue(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Ваш коментар..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", minHeight: "100px", marginTop: "10px" }}
          />
          <button onClick={handleAddFeedback}>Надіслати відгук</button>
        </div>
      ) : (
        <h1>
          Ви вже залишили відгук
        </h1>
      )}
    </div>
  );
};

export default CardWithMap;
