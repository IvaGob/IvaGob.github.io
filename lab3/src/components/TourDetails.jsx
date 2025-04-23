import React from "react";
import ReactDOM from "react-dom";

const DetailsDiv = ({ tour, onClose,onOrder }) => {
    return ReactDOM.createPortal(
        <div className="details-div">
            <button className="closeButton" onClick={onClose}>
                <img src="img/back-button.png" className="back-button"/>
            </button>
            <h1>{tour.title}</h1>
            <img src={tour.imgSrc} alt={tour.title} className="popup-image" />
            <h2>{tour.description}</h2>
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