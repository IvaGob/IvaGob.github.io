import React from "react";

const TourCard = ({ tour, index }) => {
    return (
        <div className="tour-card">
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
                <h2>{tour.price}</h2>
            </div>
            </div>
          </div>
        </div>
      );
};

export default TourCard;