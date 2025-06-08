const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = 5000;
const { getFirestore, doc, updateDoc, arrayRemove } = require("firebase-admin/firestore");
app.use(express.json());
// Ініціалізація Firebase Admin SDK (через ключ доступу сервера)
const serviceAccount = require('./hot-tours-39775-firebase-adminsdk-fbsvc-937ce73cad.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Дозволити CORS для localhost:3000 (React)
app.use(cors({
    origin: 'https://hot-tours.netlify.app',
    credentials: true,
}));

app.get("/api/message",(req,res)=>{
    res.json({message: "FUCK"});
});


// --- GET маршрут для отримання користувача та його замовлених турів ---
app.get('/api/user/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const userDoc = await db.collection('users').doc(email).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Користувач не знайдений' });
        }

        const userData = userDoc.data();

            res.json({
                email: email,
                name: userData.name || '',
                surname: userData.surname || '',
                phone: userData.phone || '',
                orderedTours: userData.orderedTours || [],
            });
        } catch (error) {
            console.error('Помилка отримання користувача:', error);
            res.status(500).json({ error: 'Внутрішня помилка сервера' });
        }
});

// --- Проста відповідь для перевірки ---
app.get('/api/message', (req, res) => {
    res.json({ message: 'Сервер працює' });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});

// --- GET маршрут для отримання поточного користувача через ID Token ---
app.get('/api/currentUser', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Не передано токен авторизації' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        res.json({
            uid,
            email,
            message: 'Користувач авторизований',
        });
    } catch (error) {
        console.error('Помилка верифікації токена:', error);
        res.status(401).json({ error: 'Невірний або прострочений токен' });
    }
});
/*
// --- POST маршрут для додавання туру користувачу ---
app.post('/api/user/order', async (req, res) => {
    const { email, tourId } = req.body;

    if (!email || !tourId) {
        return res.status(400).json({ error: 'Потрібно передати email і tourId' });
    }

    try {
        const userDocRef = db.collection('users').doc(email);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            // Якщо користувач існує, оновлюємо масив orderedTours
            await userDocRef.update({
                orderedTours: admin.firestore.FieldValue.arrayUnion(tourId),
            });
        } else {
            // Якщо не існує — створюємо нового користувача з першим туром
            await userDocRef.set({
                orderedTours: [tourId],
        });
        }

        res.json({ message: `Тур ${tourId} додано користувачу ${email}` });
    } catch (error) {
        console.error('Помилка при додаванні туру:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
*/
// --- POST маршрут для замовлення туру ---
app.post('/api/order', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Не передано токен авторизації' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email } = decodedToken;
        const { tourId } = req.body;

        if (!tourId) {
        return res.status(400).json({ error: 'Не передано ID туру' });
        }

        const userDocRef = db.collection('users').doc(email);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
        await userDocRef.update({
            orderedTours: admin.firestore.FieldValue.arrayUnion(tourId),
        });
        } else {
        await userDocRef.set({
            orderedTours: [tourId],
        });
        }

        res.json({ message: 'Тур додано до замовлень' });
    } catch (error) {
        console.error('Помилка при замовленні туру:', error);
        res.status(401).json({ error: 'Невірний токен або помилка обробки замовлення' });
    }
});


// --- POST маршрут для видалення туру з замовлень ---
app.post('/api/order/removeTour', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Не передано токен авторизації' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email } = decodedToken;
        const { tourId } = req.body;

        if (!tourId) {
            return res.status(400).json({ error: 'Не передано ID туру' });
        }

        const userDocRef = db.collection('users').doc(email);
        const userDocSnap = await userDocRef.get();

        if (!userDocSnap.exists) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        const userData = userDocSnap.data();
        const currentTours = userData.orderedTours || [];

        const updatedTours = currentTours.filter(id => id !== tourId);

        await userDocRef.update({
            orderedTours: updatedTours
        });

        res.json({ message: `Тур ${tourId} видалено з замовлень користувача ${email}` });
    } catch (error) {
        console.error('Помилка видалення туру:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});


// POST маршрут для оновлення даних користувача
app.post('/api/user/updateProfile', async (req, res) => {
    const { email, name, surname, phone } = req.body;

    if (!email || !name || !surname || !phone) {
        return res.status(400).json({ error: 'Всі поля повинні бути заповнені' });
    }

    try {
        const userDocRef = db.collection('users').doc(email);
        await userDocRef.update({
        name,
        surname,
        phone,
        });

        res.json({ message: 'Дані успішно оновлені' });
    } catch (error) {
        console.error('Помилка при оновленні даних:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
// GET /api/tour/:tourId/feedbacks
app.get('/api/tour/:tourId/feedbacks', async (req, res) => {
    const { tourId } = req.params;

    try {
        const feedbacksRef = db.collection('tours').doc(tourId).collection('feedbacks');
        const snapshot = await feedbacksRef.get();

        if (snapshot.empty) {
            return res.json({ feedbacks: [], averageRating: null });
        }

        let totalRating = 0;
        let count = 0;
        let feedbacks = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            totalRating += data.value || 0;
            count++;

            // Завантажити дані користувача
            let userName = data.userEmail;
            try {
                const userSnap = await db.collection('users').doc(data.userEmail).get();
                if (userSnap.exists) {
                    const userData = userSnap.data();
                    userName = `${userData.name || ""} ${userData.surname || ""}`.trim() || data.userEmail;
                }
            } catch (e) {
                console.warn(`Не вдалося отримати користувача ${data.userEmail}`);
            }

            feedbacks.push({
                id: doc.id,
                ...data,
                userName,
            });
        }

        // Сортувати відгуки за рейтингом від вищого до нижчого
        feedbacks.sort((a, b) => (b.value || 0) - (a.value || 0));

        const averageRating = +(totalRating / count).toFixed(2);

        return res.json({ feedbacks, averageRating });
    } catch (error) {
        console.error('Помилка при отриманні відгуків:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});
// POST /api/tour/:tourId/feedback
app.post('/api/tour/:tourId/feedback', async (req, res) => {
    const { tourId } = req.params;
    const { value, text, userEmail } = req.body;

    if (!value || !text || !userEmail) {
        return res.status(400).json({ error: 'Не всі обовʼязкові поля заповнені' });
    }

    // Чорний список слів
    const blackList = ['поганий', 'дурний', 'сміття','гівно','жопа'];

    const containsForbidden = blackList.some(word => text.toLowerCase().includes(word));

    if (containsForbidden) {
        return res.status(400).json({ error: 'Ваш відгук містить заборонені слова. Перевірте текст.' });
    }

    try {
        // Перевірити чи користувач вже залишав відгук
        const feedbacksRef = db.collection('tours').doc(tourId).collection('feedbacks');
        const snapshot = await feedbacksRef.where('userEmail', '==', userEmail).get();

        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Ви вже залишили відгук для цього туру.' });
        }

        // Додаємо відгук
        await feedbacksRef.add({
            value,
            text,
            userEmail,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ message: 'Відгук успішно додано' });
    } catch (error) {
        console.error('Помилка додавання відгуку:', error);
        return res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
// --- Хостинг статичних файлів ---
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))

