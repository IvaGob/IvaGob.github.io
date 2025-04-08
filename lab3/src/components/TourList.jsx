import React, { useEffect, useState } from "react";
import TourCard from "./TourCard";

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    fetch("/tours.xml")
      .then(response => response.text())
      .then(str => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, "application/xml");
        const tourNodes = xml.getElementsByTagName("tour");

        const loadedTours = Array.from(tourNodes).map((tour) => {
          const priceText = tour.getElementsByTagName("price")[0]?.textContent || "0";
          const price = parseInt(priceText.replace(/\s|грн/g, ''), 10);

          const placeNodes = tour.getElementsByTagName("place");
          const places = Array.from(placeNodes).map(place => ({
            name: place.getAttribute("name"),
            lat: parseFloat(place.getAttribute("lat")),
            lon: parseFloat(place.getAttribute("lon")),
            desc: place.getAttribute("desc") || "",
          }));

          return {
            title: tour.getElementsByTagName("title")[0]?.textContent || "",
            imgSrc: tour.getElementsByTagName("img")[0]?.textContent || "",
            description: tour.getElementsByTagName("description")[0]?.textContent || "",
            duration: tour.getElementsByTagName("duration")[0]?.textContent || "",
            price,
            places,
          };
        });

        setTours(loadedTours);
      })
      .catch(error => console.error("Помилка завантаження XML:", error));
  }, []);

  const handleSort = () => {
    const sortedTours = [...tours].sort((a, b) => a.price - b.price);
    setTours(sortedTours);
    setSorted(true);
  };

  return (
    <div className="tour-list">
      <button onClick={handleSort} className="sort-button">
        Сортувати за ціною (від дешевших)
      </button>

      <div className="tours">
        {tours.map((tour, index) => (
          <TourCard key={index} tour={tour} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TourList;
