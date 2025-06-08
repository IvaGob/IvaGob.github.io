import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SERVER_URL from "./ServerUrl";

const CardWithMap = ({ tour, index, onRemove, user }) => {
  const [value, setValue] = useState(5);
  const [text, setText] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const mapRef = useRef(null);

  // Завантаження відгуків + перевірка чи залишав відгук поточний користувач
  const loadFeedbacks = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/tour/${tour.id}/feedbacks`);
      if (!response.ok) throw new Error('Помилка отримання відгуків');
      const data = await response.json();
      setFeedbacks(data.feedbacks);

      if (user && data.feedbacks.some(fb => fb.userEmail === user.email)) {
        setAlreadyReviewed(true);
      }
    } catch (error) {
      console.error("Помилка завантаження відгуків:", error);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [tour.id, user]);

  const handleAddFeedback = async () => {
    if (!user) {
      alert("Увійдіть, щоб залишити відгук.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/tour/${tour.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
          text,
          userEmail: user.email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Сталася помилка');
        return;
      }

      alert("Відгук успішно додано!");
      setAlreadyReviewed(true);
      setText("");
      loadFeedbacks(); // Оновити список відгуків після додавання
    } catch (error) {
      console.error("Помилка додавання відгуку:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  };

  useEffect(() => {
    const mapId = `map-${index}`;

    mapRef.current = L.map(mapId).setView(
      [tour.places[0]?.lat || 48.3, tour.places[0]?.lon || 24.5],
      8
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    tour.places.forEach((place) => {
      L.marker([place.lat, place.lon])
        .addTo(mapRef.current)
        .bindPopup(`<b>${place.name}</b><br>${place.desc}`);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [tour.places, index]);

  return (
    <div className="orderedTourDiv">
      <button className="closeButton" onClick={() => onRemove(tour.id)}>
        <img src={`${SERVER_URL}/img/back-button.png`} className="back-button" />
      </button>
      <h1>{tour.title}</h1>
      <h2>{tour.description}</h2>
      <div
        id={`map-${index}`}
        className="map-container"
        style={{ height: "300px", width: "100%", marginTop: "1rem" }}
      ></div>

      <div className="feedback-section">
        <h2>Відгуки:</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-item">
              <strong>{fb.userName}</strong>
              <p>Оцінка: {fb.value}/5</p>
              <p>{fb.text}</p>
            </div>
          ))
        ) : (
          <p>Ще немає відгуків.</p>
        )}
      </div>

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
        <h3>Ви вже залишили відгук для цього туру.</h3>
      )}
    </div>
  );
};

export default CardWithMap;
