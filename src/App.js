import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { getFieldError } from "./utils/module";

const STORAGE_KEY = "registeredUsers";

const EMPTY_FORM = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

const FIELDS = Object.keys(EMPTY_FORM);

function loadRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  const [usersCount, setUsersCount] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toaster, setToaster] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(loadRegisteredUsers);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`,
        });
        const response = await api.get(`/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
  };

  const isFormValid = FIELDS.every(
    (f) => formData[f] && !getFieldError(f, formData[f])
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newList = [...registeredUsers, formData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setRegisteredUsers(newList);
    setFormData(EMPTY_FORM);
    setErrors({});
    setToaster(true);
    setTimeout(() => setToaster(false), 3000);
  };

  return (
    <div className="App">
      {toaster && (
        <div
          role="alert"
          data-testid="toaster"
          style={{
            background: "green",
            color: "white",
            padding: "12px 20px",
            marginBottom: "16px",
            borderRadius: "4px",
          }}
        >
          Inscription réussie !
        </div>
      )}

      <h2>Inscription</h2>
      <p data-testid="users-count">{usersCount} user(s) already registered</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lastName">Nom :</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span data-testid="error-lastName" style={{ color: "red" }}>
              {errors.lastName}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="firstName">Prénom :</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span data-testid="error-firstName" style={{ color: "red" }}>
              {errors.firstName}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="email">Mail :</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span data-testid="error-email" style={{ color: "red" }}>
              {errors.email}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="birthDate">Date de naissance :</label>
          <input
            id="birthDate"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
          {errors.birthDate && (
            <span data-testid="error-birthDate" style={{ color: "red" }}>
              {errors.birthDate}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="city">Ville :</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && (
            <span data-testid="error-city" style={{ color: "red" }}>
              {errors.city}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="postalCode">Code postal :</label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
          {errors.postalCode && (
            <span data-testid="error-postalCode" style={{ color: "red" }}>
              {errors.postalCode}
            </span>
          )}
        </div>

        <br />
        <button
          type="submit"
          data-testid="submit-btn"
          disabled={!isFormValid}
        >
          Sauvegarder
        </button>
      </form>

      <h2>Liste des inscrits</h2>
      <ul data-testid="registeredUsers-list">
        {registeredUsers.map((u, i) => (
          <li key={i} data-testid={`registeredUser-${i}`}>
            {u.firstName} {u.lastName} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
