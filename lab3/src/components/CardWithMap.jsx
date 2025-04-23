import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CardWithMap = ({ tour, index, onRemove }) => {
  useEffect(() => {
    const mapId = `map-${index}`;

    // Очистка попередньої карти (якщо була)
    const existingMap = document.getElementById(mapId);
    if (existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    const map = L.map(mapId).setView(
      [tour.places[0]?.lat || 48.3, tour.places[0]?.lon || 24.5],
      8
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    tour.places.forEach((place) => {
      L.marker([place.lat, place.lon])
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${place.desc}`);
    });
  }, [tour.places, index]);

  return (
    <div className="orderedTourDiv">
        <button className="closeButton" onClick={() => onRemove(tour.id)}>
            <img src="img/back-button.png" className="back-button"/>
        </button>
        <h1>{tour.title}</h1>
      <h2>{tour.description}</h2>
      <div
        id={`map-${index}`}
        className="map-container"
        style={{ height: "300px", width: "100%", marginTop: "1rem" }}
      ></div>
    </div>
  );
};

export default CardWithMap;