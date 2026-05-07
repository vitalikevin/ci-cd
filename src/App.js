import React, { useState } from "react";
import "./App.css";
import { getFieldError } from "./utils/module";

const STORAGE_KEY = "inscrits";

const EMPTY_FORM = {
  nom: "",
  prenom: "",
  mail: "",
  dateNaissance: "",
  ville: "",
  codePostal: "",
};

const FIELDS = Object.keys(EMPTY_FORM);

function loadInscrits() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function App() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toaster, setToaster] = useState(false);
  const [inscrits, setInscrits] = useState(loadInscrits);

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
    const newList = [...inscrits, formData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setInscrits(newList);
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
            background: "#4caf50",
            color: "white",
            padding: "12px 20px",
            marginBottom: "16px",
            borderRadius: "4px",
          }}
        >
          Inscription réussie
        </div>
      )}

      <h2>Inscription</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && (
            <span data-testid="error-nom" style={{ color: "red" }}>
              {errors.nom}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="prenom">Prénom :</label>
          <input
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && (
            <span data-testid="error-prenom" style={{ color: "red" }}>
              {errors.prenom}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="mail">Mail :</label>
          <input
            id="mail"
            type="text"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
          />
          {errors.mail && (
            <span data-testid="error-mail" style={{ color: "red" }}>
              {errors.mail}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="dateNaissance">Date de naissance :</label>
          <input
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
          />
          {errors.dateNaissance && (
            <span data-testid="error-dateNaissance" style={{ color: "red" }}>
              {errors.dateNaissance}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="ville">Ville :</label>
          <input
            id="ville"
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
          {errors.ville && (
            <span data-testid="error-ville" style={{ color: "red" }}>
              {errors.ville}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="codePostal">Code postal :</label>
          <input
            id="codePostal"
            type="text"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
          />
          {errors.codePostal && (
            <span data-testid="error-codePostal" style={{ color: "red" }}>
              {errors.codePostal}
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
      <ul data-testid="inscrits-list">
        {inscrits.map((u, i) => (
          <li key={i} data-testid={`inscrit-${i}`}>
            {u.prenom} {u.nom} — {u.mail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
