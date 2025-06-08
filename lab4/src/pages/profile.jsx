import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB1JR1fYBr3xUDCEJSE67FF8D2gRlSdPcY",
  authDomain: "hot-tours-39775.firebaseapp.com",
  projectId: "hot-tours-39775",
  storageBucket: "hot-tours-39775.firebasestorage.app",
  messagingSenderId: "299242912883",
  appId: "1:299242912883:web:e2f4207f55e72b165f7e06",
  measurementId: "G-TKWTBWYCZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  // Отримання користувача і його даних
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, "users", firebaseUser.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            firstName: data.name || "",
            lastName: data.surname || "",
            phone: data.phone || "",
          });
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
    const userDocRef = doc(db, "users", user.email);
    try {
      await updateDoc(userDocRef, {
        name: formData.firstName,
        surname: formData.lastName,
        phone: formData.phone,
      });
      alert("Дані успішно оновлено!");
    } catch (error) {
      console.error("Помилка при оновленні даних:", error);
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