import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { getFieldError } from "./utils/module";

const API = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}`,
});

const EMPTY_FORM = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

const FIELDS = Object.keys(EMPTY_FORM);

/**
 * Main application component.
 *
 * Renders a registration form that validates user input (last name, first name,
 * email, birth date, city, postal code) before saving to the database via the API.
 * Displays a success toaster on valid submission and the list of registered users.
 * Includes an admin login to manage users (view private info, delete).
 *
 * @component
 * @returns {React.JSX.Element} The full registration page with form and user list.
 */
function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toaster, setToaster] = useState(null);

  // Admin state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Selected user details (admin only)
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    API.get("/users")
      .then((res) => setUsers(res.data.utilisateurs))
      .catch((err) => console.error(err));
  }

  function showToaster(message, success = true) {
    setToaster({ message, success });
    setTimeout(() => setToaster(null), 3000);
  }

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
    API.post("/users", formData)
      .then(() => {
        setFormData(EMPTY_FORM);
        setErrors({});
        showToaster("Inscription réussie !");
        fetchUsers();
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          showToaster("Cet email est déjà utilisé.", false);
        } else {
          showToaster("Erreur lors de l'inscription.", false);
        }
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    API.post("/login", { email: adminEmail, password: adminPassword })
      .then((res) => {
        if (res.data.success && res.data.is_admin) {
          setIsAdmin(true);
          setLoginError("");
        } else {
          setLoginError("Identifiants incorrects ou compte non admin.");
        }
      })
      .catch(() => {
        setLoginError("Identifiants incorrects ou compte non admin.");
      });
  };

  const handleDelete = (userId) => {
    API.delete(`/users/${userId}`, {
      params: { admin_email: adminEmail, admin_password: adminPassword },
    })
      .then(() => {
        showToaster("Utilisateur supprimé.");
        setSelectedUser(null);
        fetchUsers();
      })
      .catch(() => showToaster("Erreur lors de la suppression.", false));
  };

  const handleViewDetails = (userId) => {
    API.get(`/users/${userId}`, {
      params: { admin_email: adminEmail, admin_password: adminPassword },
    })
      .then((res) => setSelectedUser(res.data))
      .catch(() => showToaster("Impossible de charger les détails.", false));
  };

  return (
    <div className="App">

      {toaster && (
        <div
          role="alert"
          data-testid="toaster"
          style={{
            background: toaster.success ? "green" : "red",
            color: "white",
            padding: "12px 20px",
            marginBottom: "16px",
            borderRadius: "4px",
          }}
        >
          {toaster.message}
        </div>
      )}

      {/* Formulaire d'inscription */}
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lastName">Nom :</label>
          <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span data-testid="error-lastName" style={{ color: "red" }}>{errors.lastName}</span>}
        </div>
        <div>
          <label htmlFor="firstName">Prénom :</label>
          <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span data-testid="error-firstName" style={{ color: "red" }}>{errors.firstName}</span>}
        </div>
        <div>
          <label htmlFor="email">Mail :</label>
          <input id="email" type="text" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span data-testid="error-email" style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="birthDate">Date de naissance :</label>
          <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          {errors.birthDate && <span data-testid="error-birthDate" style={{ color: "red" }}>{errors.birthDate}</span>}
        </div>
        <div>
          <label htmlFor="city">Ville :</label>
          <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} />
          {errors.city && <span data-testid="error-city" style={{ color: "red" }}>{errors.city}</span>}
        </div>
        <div>
          <label htmlFor="postalCode">Code postal :</label>
          <input id="postalCode" type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
          {errors.postalCode && <span data-testid="error-postalCode" style={{ color: "red" }}>{errors.postalCode}</span>}
        </div>
        <br />
        <button type="submit" data-testid="submit-btn" disabled={!isFormValid}>
          Sauvegarder
        </button>
      </form>

      {/* Liste des inscrits */}
      <h2>Liste des inscrits</h2>
      <ul data-testid="registeredUsers-list">
        {users.map((u, i) => (
          <li key={u.id} data-testid={`registeredUser-${i}`}>
            {u.firstName} {u.lastName} — {u.email}
            {isAdmin && (
              <>
                <button data-testid={`btn-details-${i}`} onClick={() => handleViewDetails(u.id)} style={{ marginLeft: "10px" }}>
                  Détails
                </button>
                <button data-testid={`btn-delete-${i}`} onClick={() => handleDelete(u.id)} style={{ marginLeft: "5px", color: "red" }}>
                  Supprimer
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Détails d'un utilisateur (admin) */}
      {selectedUser && (
        <div data-testid="user-details">
          <h3>Détails de l'utilisateur</h3>
          <p>Nom : {selectedUser.lastName}</p>
          <p>Prénom : {selectedUser.firstName}</p>
          <p>Email : {selectedUser.email}</p>
          <p>Date de naissance : {selectedUser.birthDate}</p>
          <p>Ville : {selectedUser.city}</p>
          <p>Code postal : {selectedUser.postalCode}</p>
          <button onClick={() => setSelectedUser(null)}>Fermer</button>
        </div>
      )}

      {/* Connexion admin */}
      <h2>Espace admin</h2>
      {isAdmin ? (
        <p data-testid="admin-logged">Connecté en tant qu'administrateur.</p>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="adminEmail">Email admin :</label>
            <input
              id="adminEmail"
              type="text"
              data-testid="admin-email-input"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="adminPassword">Mot de passe :</label>
            <input
              id="adminPassword"
              type="password"
              data-testid="admin-password-input"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          {loginError && <p data-testid="login-error" style={{ color: "red" }}>{loginError}</p>}
          <button type="submit" data-testid="login-btn">Se connecter</button>
        </form>
      )}

    </div>
  );
}

export default App;
