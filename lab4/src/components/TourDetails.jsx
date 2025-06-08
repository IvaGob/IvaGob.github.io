import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getFirestore, collection, getDocs,doc, getDoc } from "firebase/firestore";


const DetailsDiv = ({ tour, onClose,onOrder }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const loadFeedbacks = async () => {
          try {
            const feedbacksRef = collection(db, "tours", tour.id, "feedbacks");
            const snapshot = await getDocs(feedbacksRef);
            const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
            // Завантажити імена користувачів по email
            const withNames = await Promise.all(
              loaded.map(async (fb) => {
                try {
                  const userRef = doc(db, "users", fb.userEmail);
                  const userSnap = await getDoc(userRef);
                  const userData = userSnap.exists() ? userSnap.data() : {};
                  return {
                    ...fb,
                    userName: `${userData.name || ""} ${userData.surname || ""}`.trim() || fb.userEmail,
                  };
                } catch (err) {
                  console.warn(`Не вдалося завантажити дані користувача для ${fb.userEmail}`);
                  return { ...fb, userName: fb.userEmail }; // fallback
                }
              })
            );
      
            setFeedbacks(withNames);
          } catch (error) {
            console.error("Помилка при завантаженні відгуків:", error);
          }
        };
      
        loadFeedbacks();
      }, [tour.id]);


    return ReactDOM.createPortal(
        <div className="details-div">
            <button className="closeButton" onClick={onClose}>
                <img src="img/back-button.png" className="back-button"/>
            </button>
            <div className="desc-div">
                <div className="title-img-div">
                    <h1>{tour.title}</h1>
                    <img src={tour.img} alt={tour.title} className="popup-image" />
                    <h2>{tour.description}</h2>
                </div>
                

                {/* ВІДГУКИ */}
                <div className="feedback-section">
                    <h2>Відгуки:</h2>
                    <div className="feedback-scroll">
                        {feedbacks.length > 0 ? (
                            feedbacks.map(fb => (
                                <div key={fb.id} className="feedback-item">
                                    <strong>{fb.userName || "Анонім"}</strong>
                                    <p>Оцінка: {fb.value}/5</p>
                                    <p>{fb.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>Ще немає відгуків.</p>
                        )}
                    </div>
                </div>
            </div>
            
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
                <button className="tourOrderButton" onClick={onOrder}>
                    <h2>Замовити</h2>
                </button>
            </div>
            </div>
        </div>,
        document.getElementById("tourDivBackground")
    );
};

export default DetailsDiv;