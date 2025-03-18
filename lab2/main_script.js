// Функція завантаження XML-файлу
function loadXML() {
    fetch('tours.xml')
        .then(response => response.text()) // Отримуємо текстовий XML
        .then(str => new window.DOMParser().parseFromString(str, "text/xml")) // Парсимо XML
        .then(xmlDoc => {
            const tours = xmlDoc.getElementsByTagName("tour");
            const container = document.getElementById("tours-container");
            
            let i = 0;

            while (i < tours.length) {
                const title = tours[i].getElementsByTagName("title")[0].textContent;
                const imgSrc = tours[i].getElementsByTagName("img")[0].textContent;
                const description = tours[i].getElementsByTagName("description")[0].textContent;
                const duration = tours[i].getElementsByTagName("duration")[0].textContent;
                const price = tours[i].getElementsByTagName("price")[0].textContent;

                // Створюємо HTML-картку
                const tourDiv = document.createElement("div");
                tourDiv.classList.add("tourDiv");
                tourDiv.setAttribute("id", `tour-${i}`);
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
                // Додаємо в контейнер
                container.appendChild(tourDiv);
                i = i+1;
            }
        })
        .catch(error => console.error("Помилка завантаження XML:", error));
}

// Функція для відображення обраного туру
function showTour(index) {
    const tours = document.querySelectorAll('.tourDiv');
    const tourDivBackground = document.getElementById('tourDivBackground');

    // Встановлюємо всі тури назад
    tours.forEach(tour => {
        tour.classList.remove('active');
    });

    // Активуємо обраний тур
    const selectedTour = document.getElementById(`tour-${index + 1}`);
    selectedTour.classList.add('active');

    // Відображаємо задній фон для розмивання
    tourDivBackground.style.display = 'block';
}


// Викликаємо функцію при завантаженні сторінки
window.onload = loadXML;