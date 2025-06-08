import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
  authDomain: "hot-tours-39775.firebaseapp.com",
  projectId: "hot-tours-39775",
  storageBucket: "hot-tours-39775.appspot.com",
  messagingSenderId: "299242912883",
  appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
  measurementId: "G-TKWTBWYCZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const idToken = await firebaseUser.getIdToken();

          // Отримати поточного користувача через бекенд
          const response = await fetch(`http://localhost:5000/api/currentUser`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          if (!response.ok) throw new Error("Помилка отримання даних користувача");

          const data = await response.json();

          // Завантажити профіль користувача через email через захищений маршрут
          const profileResponse = await fetch(`http://localhost:5000/api/user/${data.email}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          if (!profileResponse.ok) throw new Error("Помилка отримання профілю");

          const profileData = await profileResponse.json();

          setFormData({
            firstName: profileData.name || "",
            lastName: profileData.surname || "",
            phone: profileData.phone || "",
          });
        } catch (error) {
          console.error("Помилка завантаження даних:", error);
          alert("Не вдалося завантажити дані користувача");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/user/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          name: formData.firstName,
          surname: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (!response.ok) throw new Error("Помилка збереження");

      alert("Дані успішно оновлені!");
    } catch (error) {
      console.error("Помилка при збереженні даних:", error);
      alert("Помилка збереження даних.");
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (!user) return <div>Будь ласка, увійдіть у систему.</div>;

  return (
    <div className="profile-container">
      <h1>Профіль користувача</h1>
      <label>
        Ім’я:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Телефон:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleSave}>Зберегти</button>
    </div>
  );
};

export default UserProfile;
