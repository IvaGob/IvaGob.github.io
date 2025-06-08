import React from "react";

import TourList from "../components/TourList";
import SERVER_URL from "../components/ServerUrl";

const Main = () => {
    return (
        <div className="main">
            <div className="introductionDiv">
                <div className="iconDiv">
                    <img src={`${SERVER_URL}/img/icon.png`} alt="" className="icon"/>
                </div>
                
                <div className="introductionTextDiv">
                    <h2 className="introductionText">Мрієте поїхати в мандрівку, але фінанси не дозволяють? На нашому сайті ви зможете знайти гарячі тури для будь-яких фінансових можливостей! Ознайомтесь з актуальними турами нижче!</h2>
                </div>
            </div>
            <TourList />
            <div className="select-background-div" id="tourDivBackground"/>
        </div>
    );
};

export default Main;