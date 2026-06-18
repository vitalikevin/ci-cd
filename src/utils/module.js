/**
 * Calculate a person's age in years
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter
 * return {number} The age in years of p.
 */
export function calculateAge(p) {
  if (!p) {
    throw new Error("missing param p");
  }
  if (!(typeof p === "object")) {
    throw new Error("p is not an object");
  }
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}

/**
 * Verify if the user is an adult based on their birth date
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter
 * @returns {boolean} Adult = true, minor = false
 */
export function isAdult(p) {
  const age = calculateAge(p);
  return age >= 18;
}

/**
 * Validate an email address
 *
 * @param {string} email The email address to validate
 * @returns {boolean} true if valid, false otherwise
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate a French postal code (5 digits)
 *
 * @param {string} cp The postal code to validate
 * @returns {boolean} true if valid, false otherwise
 */
export function validateCodePostal(cp) {
  return /^\d{5}$/.test(cp);
}

/**
 * Validate a name, first name or city (letters, accents, hyphens and apostrophes only)
 *
 * @param {string} name The value to validate
 * @returns {boolean} true if valid, false otherwise
 */
export function validateName(name) {
  return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-']+$/.test(name);
}

/**
 * Return an error message for a given form field and value.
 * Returns an empty string if the value is valid.
 *
 * @param {string} fieldName The field identifier: "nom", "prenom", "ville", "mail", "dateNaissance" or "codePostal"
 * @param {string} value The current value of the field
 * @returns {string} Error message, or "" if valid
 */
export function getFieldError(fieldName, value) {
  if (!value) return "Ce champ est requis";
  if (fieldName === "lastName" || fieldName === "firstName" || fieldName === "city") {
    return validateName(value) ? "" : "Champ invalide (pas de chiffres ni caractères spéciaux)";
  }
  if (fieldName === "email") {
    return validateEmail(value) ? "" : "Email invalide";
  }
  if (fieldName === "birthDate") {
    const date = new Date(value);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return "Date de naissance invalide";
    }
    return isAdult({ birth: date }) ? "" : "Vous devez avoir au moins 18 ans";
  }
  return validateCodePostal(value) ? "" : "Code postal invalide (5 chiffres)";
}
