import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="header">
            <Link to="/main" className="header-button" id="Hbutton1">
                <h2>Гарячі тури</h2>
            </Link>
            <Link to="/userpage" className="header-button" id="Hbutton1">
                <h2>Мої бронювання</h2>
            </Link>
            <Link to="/contactus" className="header-button" id="Hbutton1">
                <h2>Контакти</h2>
            </Link>
        </header>
    );
};

export default Navbar;