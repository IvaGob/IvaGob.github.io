import React, { useEffect, useState } from "react";
import '../index.css';
import TourDetails from './TourDetails.jsx';
const TourCard = ({ tour, index }) => {
  const [isOrdered, setIsOrdered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);


  useEffect(() => {
    const orderedIDs = JSON.parse(localStorage.getItem("orderedIDs") || "[]");
    setIsOrdered(orderedIDs.includes(tour.id));
  }, [tour.id]);
  const handleOrder = () => {
    const orderedIDs = JSON.parse(localStorage.getItem("orderedIDs") || "[]");

    if (!orderedIDs.includes(tour.id)) {
      orderedIDs.push(tour.id);
      localStorage.setItem("orderedIDs", JSON.stringify(orderedIDs));
      setIsOrdered(true);
      console.log(localStorage.getItem("orderedIDs"));
    }
    closeDetails();
  }
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
              <img src={tour.imgSrc} alt={tour.title} className="tourImage" />
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
              {!isOrdered && (
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