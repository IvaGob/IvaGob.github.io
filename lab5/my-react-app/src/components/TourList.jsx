import React, { useEffect, useState } from "react";
import TourCard from "./TourCard";
import '../index.css';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

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




const TourList = () => {
  const [initialTours, setInitialTours] = useState([]); // <-- ми зберігаємо тут оригінальні дані
  const [tours, setTours] = useState([]);               // <-- це вже поточні (відфільтровані або відсортовані)
  const [searchTerm, setSearchTerm] = useState("");
  const [sorted, setSorted] = useState(false);

  // Завантаження з Firestore при першому запуску
  useEffect(() => {
    const fetchTours = async () => {
      const querySnapshot = await getDocs(collection(db, "tours"));
      const toursArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInitialTours(toursArray);
      setTours(toursArray);
    };

    fetchTours();
  }, []);

  const handleSort = () => {
    const sortedTours = [...tours].sort((a, b) => a.price - b.price);
    setTours(sortedTours);
    setSorted(true);
  };

  const handleSearch = () => {
    const filteredTours = initialTours.filter(tour =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTours(filteredTours);
  };

  return (
    
    <div className="tour-list">
      <div className="control-div">
        <button onClick={handleSort} className="sort-button">
          <h3>Сортувати за ціною (від дешевших)</h3>
        </button>
        <div className="search-div">
          <input className="search-bar" type="text" placeholder="Введіть назву країни..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button onClick={handleSearch} className="search-button">
              <h3>Пошук</h3>
            </button>
        </div>
      </div>

      <div className="tourListDiv">
        {tours.map((tour, index) => (
          <TourCard key={index} tour={tour} index={index} />
        ))}
      </div>
      
      
    </div>
  );
};

export default TourList;
