const tourData = [
    {
        id: 0,
        title: "Сонячна Італія",
        imgSrc: "./img/italy.webp",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        duration: "13 днів",
        price: 40000,
        places: [
            { name: "Колізей", lat: 41.8902, lon: 12.4922, desc: "Стародавня споруда часів стародавнього риму" },
            { name: "Фонтан Треві", lat: 41.9009, lon: 12.4833, desc: "Ого фонтан" },
            { name: "Ватикан", lat: 41.9029, lon: 12.4534, desc: "ну тут Папа  сидить короче" }
        ]
    },
    {
        id: 1,
        title: "Хмарна Британія",
        imgSrc: "img/britain.webp",
        description: "Donec sodales viverra mi, porttitor efficitur nisi...",
        duration: "23 днів",
        price: 64000,
        places: [
            { name: "Біг-Бен", lat: 51.5007, lon: -0.1246, desc: "великий годинник" },
            { name: "Тауерський міст", lat: 51.5055, lon: -0.0754, desc: "міст лол" },
            { name: "Букінгемський палац", lat: 51.5014, lon: -0.1419, desc: "там короче королева чи хтось хз" }
        ]
    },
    {
        id: 2,
        title: "Таємнича Японія",
        imgSrc: "img/Japan.jpg",
        description: "Etiam sed magna sed nunc porta placerat in ac ex...",
        duration: "10 днів",
        price: 57000,
        places: [
            { name: "Гора Фудзі", lat: 35.3606, lon: 138.7274, desc: "Відома гора" },
            { name: "Храм Сенсодзі", lat: 35.7148, lon: 139.7967, desc: "храм мамам" },
            { name: "Парк Уено", lat: 35.7129, lon: 139.7745, desc: "дуже відомий парк" }
        ]
    }
];
export default tourData;