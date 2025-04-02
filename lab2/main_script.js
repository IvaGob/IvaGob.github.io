let toursData = [];

async function loadXML() {
    return fetch('tours.xml')
        .then(response => response.text()) 
        .then(str => new window.DOMParser().parseFromString(str, "text/xml")) 
        .then(xmlDoc => {
            const tours = xmlDoc.getElementsByTagName("tour");

            for (let i = 0; i < tours.length; i++) {
                const title = tours[i].getElementsByTagName("title")[0].textContent;
                const imgSrc = tours[i].getElementsByTagName("img")[0].textContent;
                const description = tours[i].getElementsByTagName("description")[0].textContent;
                const duration = tours[i].getElementsByTagName("duration")[0].textContent;
                const price = tours[i].getElementsByTagName("price")[0].textContent;
                const places = Array.from(tours[i].getElementsByTagName("place"));

                const placeData = places.map(place => ({
                    name: place.getAttribute("name"),
                    lat: parseFloat(place.getAttribute("lat")),
                    lon: parseFloat(place.getAttribute("lon")),
                    desc: place.getAttribute("desc") || "Немає опису"
                }));

                toursData.push({ title, imgSrc, description, duration, price, places: placeData });
            }
        });
}

// Функція для відображення великого div з картою
function showTour(index) {
    const selectedTour = toursData[index];
    const backgroundDiv = document.getElementById("tourDivBackground");

    // Очищуємо контейнер перед додаванням нового вікна
    backgroundDiv.innerHTML = "";

    // Створюємо великий div
    const tourPopup = document.createElement("div");
    tourPopup.classList.add("tourPopup");

    tourPopup.innerHTML = `
        <button class="closeButton" onclick="closeTour()"><img src="img/back-button.png" class="back-button"></img></button>
        <h1>${selectedTour.title}</h1>
        <div id="map" class="map-container"></div>
        <img src="${selectedTour.imgSrc}" class = "popup-image"></img>
        <h2>${selectedTour.description}</h2>
        <div class  = "tourDivFooter"><p><strong>Тривалість:</strong> ${selectedTour.duration}</p>
        <p><strong>Ціна:</strong> ${selectedTour.price}</p>
        <button class="popup-order-button" onclick="orderTour(${index})"><h3>Замовити</h3></button>
        </div>
    `;

    backgroundDiv.appendChild(tourPopup);
    backgroundDiv.style.display = "flex";
}

// Функція для закриття вікна
function closeTour() {
    const backgroundDiv = document.getElementById("tourDivBackground");
    backgroundDiv.style.display = "none";
    while(backgroundDiv.firstChild){
        backgroundDiv.removeChild(backgroundDiv.firstChild);
    }
    /*localStorage.clear();
    let arr = JSON.parse(localStorage.getItem("orderedTours")) || [];
    console.log(arr);*/
}
function SetDivs(){
    for(let i =0;i<count;i++){
        createTourDiv()
    }
}

// Функція для створення HTML-структури для всіх турів
function createTourDiv() {
    const container = document.getElementById("tours-container");
    container.innerHTML = ""; // Очистка перед створенням нових елементів

    toursData.forEach((tour, index) => {
        const tourDiv = document.createElement("div");
        tourDiv.classList.add("tourDiv");
        tourDiv.id = `tour-${index + 1}`;

        tourDiv.innerHTML = `
            <div class="tourName">
                <h1>${tour.title}</h1>
            </div>
            <div class="tourDescription">
                <div class="tourDescriptionImage">
                    <img src="${tour.imgSrc}" alt="${tour.title}" class="tourImage">
                </div>
                <div class="tourDescriptionText">
                    <h2>${tour.description}</h2>
                </div>
            </div>
            <div id="map-${index}" class="map-container"></div>
            <div class="tourDivFooter">
                <div class="DurationDiv">
                    <div class="DurationDivHead">
                        <h1>Тривалість</h1>
                    </div>
                    <div class="DurationDivText">
                        <h2>${tour.duration}</h2>
                    </div>
                </div>
                <div class="PriceDiv">
                    <div class="PriceDivHead">
                        <h1>Ціна</h1>
                    </div>
                    <div class="PriceDivText">
                        <h2>${tour.price}</h2>
                    </div>
                </div>
                <div class="tourOrder">
                    <button class="tourOrderButton" onclick="showTour(${index})">
                        <h2>Замовити</h2>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(tourDiv);
    });
}

function orderTour(index){
    let arr = JSON.parse(localStorage.getItem("orderedTours")) || [];
    arr.push(index);
    localStorage.setItem("orderedTours", JSON.stringify(arr));
    console.log("Оновлений масив:", arr);
    closeTour();
}

// Функція для відображення заброньованих турів
function displayBookedTours() {
    const bookedTourIndexes = JSON.parse(localStorage.getItem("orderedTours")) || [];
    const container = document.getElementById("booked-tours-container");

    if (bookedTourIndexes.length === 0) {
        container.innerHTML = `
        <div class = "own-tour-div">
            <img src="img/noTours.png" alt="немає нічого" class = "no-tour-img">
            <h2>Ви ще не додали жодного туру!</h2>
        </div>`;
        return;
    }

    bookedTourIndexes.forEach(index => {
        const tour = toursData[index];
        if (!tour) return;

        // Створюємо div для туру
        const tourDiv = document.createElement("div");
        tourDiv.classList.add("orderedTourDiv");
        tourDiv.innerHTML = `
            <h1>${tour.title}</h1>
            <h2>${tour.description}</h2>
            <div id="map-${index}" class="map-container"></div>
        `;

        container.appendChild(tourDiv);
        
        // Ініціалізуємо карту
        initMap(index, tour.places);
    });
}
// Функція ініціалізації карти
function initMap(index, places) {
    const map = L.map(`map-${index}`).setView([places[0].lat, places[0].lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    places.forEach(place => {
        L.marker([place.lat, place.lon]).addTo(map)
            .bindPopup(`<b>${place.name}</b><br>${place.desc}`);
    });
}

// Викликаємо функцію при завантаженні сторінки
window.onload = function () {
    loadXML().then(() => {
        if(document.title==="Гарячі тури"){
            createTourDiv();
        } else if(document.title==="Особиста сторінка"){
            displayBookedTours();
            console.log(document.title);
        }
    });
};
