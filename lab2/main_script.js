let toursData = [];

// Функція завантаження XML-файлу
function loadXML() {
    fetch('tours.xml')
        .then(response => response.text()) // Отримуємо текстовий XML
        .then(str => new window.DOMParser().parseFromString(str, "text/xml")) // Парсимо XML
        .then(xmlDoc => {
            const tours = xmlDoc.getElementsByTagName("tour");
            const container = document.getElementById("tours-container");

            for (let i = 0; i < tours.length; i++) {
                const title = tours[i].getElementsByTagName("title")[0].textContent;
                const imgSrc = tours[i].getElementsByTagName("img")[0].textContent;
                const description = tours[i].getElementsByTagName("description")[0].textContent;
                const duration = tours[i].getElementsByTagName("duration")[0].textContent;
                const price = tours[i].getElementsByTagName("price")[0].textContent;
                const places = tours[i].getElementsByTagName("place");

                // Зберігаємо дані туру
                toursData.push({ title, imgSrc, description, duration, price, places });

                // Створюємо HTML-картку
                const tourDiv = document.createElement("div");
                tourDiv.classList.add("tourDiv");
                tourDiv.id = `tour-${i + 1}`;

                tourDiv.innerHTML = `
                    <div class="tourName">
                        <h1>${title}</h1>
                    </div>
                    <div class="tourDescription">
                        <div class="tourDescriptionImage">
                            <img src="${imgSrc}" alt="${title}" class="tourImage">
                        </div>
                        <div class="tourDescriptionText">
                            <h2>${description}</h2>
                        </div>
                    </div>
                    <div id="map-${i}" class="map-container"></div>
                    <div class="tourDivFooter">
                        <div class="DurationDiv">
                            <div class="DurationDivHead">
                                <h1>Тривалість</h1>
                            </div>
                            <div class="DurationDivText">
                                <h2>${duration}</h2>
                            </div>
                        </div>
                        <div class="PriceDiv">
                            <div class="PriceDivHead">
                                <h1>Ціна</h1>
                            </div>
                            <div class="PriceDivText">
                                <h2>${price}</h2>
                            </div>
                        </div>
                        <div class="tourOrder">
                            <button class="tourOrderButton" onclick="showTour(${i})">
                                <h2>Замовити</h2>
                            </button>
                        </div>
                    </div>
                `;

                container.appendChild(tourDiv);

                // Якщо є цікаві місця, створюємо карту
                if (places.length > 0) {
                    const mapId = `map-${i}`;
                    const map = L.map(mapId).setView([places[0].getAttribute("lat"), places[0].getAttribute("lon")], 10);

                    // Додаємо карту OpenStreetMap
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);

                    // Додаємо маркери для цікавих місць
                    for (let j = 0; j < places.length; j++) {
                        const placeName = places[j].getAttribute("name");
                        const lat = places[j].getAttribute("lat");
                        const lon = places[j].getAttribute("lon");

                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<b>${placeName}</b>`);
                    }
                }
            }
        })
        .catch(error => console.error("Помилка завантаження XML:", error));
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
        <button class="closeButton" onclick="closeTour()">Закрити</button>
        <h1>${selectedTour.title}</h1>
        <div id="map" class="map-container"></div>
        <h2>${selectedTour.description}</h2>
        <p><strong>Тривалість:</strong> ${selectedTour.duration}</p>
        <p><strong>Ціна:</strong> ${selectedTour.price}</p>
    `;

    backgroundDiv.appendChild(tourPopup);
    backgroundDiv.style.display = "flex";

    // Створюємо карту
    setTimeout(() => {
        const map = L.map('map').setView([selectedTour.places[0].getAttribute("lat"), selectedTour.places[0].getAttribute("lon")], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Додаємо маркери
        for (let j = 0; j < selectedTour.places.length; j++) {
            const placeName = selectedTour.places[j].getAttribute("name");
            const lat = selectedTour.places[j].getAttribute("lat");
            const lon = selectedTour.places[j].getAttribute("lon");

            L.marker([lat, lon]).addTo(map).bindPopup(`<b>${placeName}</b>`);
        }
    }, 100);
}

// Функція для закриття вікна
function closeTour() {
    const backgroundDiv = document.getElementById("selectBackground");
    backgroundDiv.style.display = "none";
    while(backgroundDiv.firstChild){
        div.removeChild(backgroundDiv.firstChild);
    }
}

// Викликаємо функцію при завантаженні сторінки
window.onload = loadXML;