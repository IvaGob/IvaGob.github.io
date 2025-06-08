import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SERVER_URL from "./ServerUrl";

const DetailsDiv = ({ tour, onClose, onOrder }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        const loadFeedbacks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tour/${tour.id}/feedbacks`);
                if (!response.ok) throw new Error("Не вдалося завантажити відгуки");

                const data = await response.json();
                setFeedbacks(data.feedbacks);
                setAverageRating(data.averageRating);
            } catch (error) {
                console.error("Помилка при завантаженні відгуків:", error);
            }
        };

        loadFeedbacks();
    }, [tour.id]);

    return ReactDOM.createPortal(
        <div className="details-div">
            <button className="closeButton" onClick={onClose}>
                <img src={`${SERVER_URL}/img/back-button.png`} className="back-button" />
            </button>
            <div className="desc-div">
                <div className="title-img-div">
                    <h1>{tour.title}</h1>
                    <img src={SERVER_URL+`/`+tour.img} alt={tour.title} className="popup-image" />
                    <h2>{tour.description}</h2>
                    {averageRating !== null && <h3>Середній рейтинг: {averageRating}/5</h3>}
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
