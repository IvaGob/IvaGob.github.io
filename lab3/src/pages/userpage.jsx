import React, { useEffect, useState } from "react";
import tourData from "../tourData";
import CardWithMap from "../components/CardWithMap";

const UserPage = () =>{
    const [orderedTours, setOrderedTours] = useState([]);
    useEffect(() => {
        loadOrderedTours();
    }, []);
    
    const loadOrderedTours = () => {
        const orderedIDs = JSON.parse(localStorage.getItem("orderedIDs") || "[]");
        console.log(localStorage.getItem("orderedIDs"));
        const filtered = tourData.filter((tour) => orderedIDs.includes(tour.id));
        setOrderedTours(filtered);
    };
    
    const handleRemoveTour = (idToRemove) => {
        const orderedIDs = JSON.parse(localStorage.getItem("orderedIDs") || "[]");
        const updatedIDs = orderedIDs.filter((id) => id !== idToRemove);
        localStorage.setItem("orderedIDs", JSON.stringify(updatedIDs));
        loadOrderedTours(); // оновлюємо список
    };
    
    return (
        <div className="user-page">
            <h1>Мої замовлені тури</h1>
            {orderedTours.length > 0 ? (
            orderedTours.map((tour, index) => (
                <CardWithMap key={index} tour={tour} index={index} onRemove={handleRemoveTour}/>
            ))
            ) : (
            <div className="own-tour-div">
                <img src="img/noTours.png" alt="немає нічого" className="no-tour-img"/>
                <h2>Ви ще не додали жодного туру!</h2>
            </div>
            )}
        </div>
        );
    };
    
    export default UserPage;