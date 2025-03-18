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

                // Створюємо HTML-картку
                const tourDiv = document.createElement("div");
                tourDiv.classList.add("tour-card");
                tourDiv.innerHTML = `
                    <img src="${imgSrc}" alt="${title}">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <p><strong>Тривалість:</strong> ${duration}</p>
                    <p class="price">${price}</p>
                `;

                // Додаємо в контейнер
                container.appendChild(tourDiv);
            }
        })
        .catch(error => console.error("Помилка завантаження XML:", error));
}

// Викликаємо функцію при завантаженні сторінки
window.onload = loadXML;