import React, { useEffect, useState } from "react";

const ContuctUs = () =>{
    return(
        <div className = "contuctus">
            <div className="find-div">
                <h1> Де нас знайти</h1>
                <div className="map-div">
                    <div className="map-img-div">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1286.6660571398445!2d24.0272165!3d49.8362169!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473adde82024090b%3A0x9f3e7075dbb71590!2z0KLRg9GA0LjRgdGC0LjRh9C90LAg0LDQs9C10L3RhtGW0Y8gVmlrbyBUcmF2ZWwgTHZpdiAo0YLRg9GA0LDQs9C10L3RgtGB0YLQstC-LCDRgtGD0YDQvtC_0LXRgNCw0YLQvtGALCDQs9Cw0YDRj9GH0ZYg0YLRg9GA0Lgp!5e0!3m2!1suk!2sua!4v1741779317307!5m2!1suk!2sua" className="map" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className="adress-div">
                        <h2 className="adress">Офіс Viko Travel, вулиця Джохара Дудаєва, 22/2, Львів, Львівська область, 79005</h2>
                    </div>
                </div>
            </div>
            <div className="contact-div">
                <h1>Напишіть нам повідомлення:</h1>
                <input type="text" className="contact-input"/>
                <button className="contact-submit">
                    <h2>Відправити</h2>
                </button>
            </div>
        </div>
    );
};

export default ContuctUs;