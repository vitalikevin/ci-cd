import {
  calculateAge,
  isAdult,
  validateEmail,
  validateCodePostal,
  validateName,
  getFieldError,
} from "./module";

/**
 * @function calculateAge
 */
describe("calculateAge Unit Test Suites", () => {
  it("should return a correct age", () => {
    const loise = {
      birth: new Date("11/07/1991"),
    };

    expect(calculateAge(loise)).toEqual(34);
  });

  it('should throw a "missing param p" error', () => {
    expect(() => calculateAge()).toThrow("missing param p");
  });

  it('should throw a "p is not an object" error', () => {
    const loise = 34;
    expect(() => calculateAge(loise)).toThrow("p is not an object");
  });
});

/**
 * @function isAdult
 */
describe("isAdult Unit Test Suites", () => {
  it("should allow an user older than 18yo to register", () => {
    // Age > 18
    const userBirthDate = { birth: new Date("01/01/2001") };
    expect(isAdult(userBirthDate)).toBe(true);
  });

  it("should allow an user aged 18yo to register", () => {
    // Age = 18
    const today = new Date();
    const userBirthDate = {
      birth: new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      ),
    };
    expect(isAdult(userBirthDate)).toBe(true);
  });

  it("should block a minor from registering", () => {
    // Age < 18
    const userBirthDate = { birth: new Date("01/01/2016") };
    expect(isAdult(userBirthDate)).toBe(false);
  });
});

/**
 * @function validateEmail
 */
describe("validateEmail Unit Test Suites", () => {
  it("should accept a valid email address", () => {
    expect(validateEmail("jean.dupont@example.com")).toBe(true);
  });

  it("should accept an email with subdomains", () => {
    expect(validateEmail("user@mail.company.fr")).toBe(true);
  });

  it("should reject an email without @", () => {
    expect(validateEmail("jeandupont.com")).toBe(false);
  });

  it("should reject an email without domain", () => {
    expect(validateEmail("jean@")).toBe(false);
  });

  it("should reject an email without TLD", () => {
    expect(validateEmail("jean@example")).toBe(false);
  });

  it("should reject an email with spaces", () => {
    expect(validateEmail("jean dupont@example.com")).toBe(false);
  });

  it("should reject an empty string", () => {
    expect(validateEmail("")).toBe(false);
  });
});

/**
 * @function validateCodePostal
 */
describe("validateCodePostal Unit Test Suites", () => {
  it("should accept a valid 5-digit French postal code", () => {
    expect(validateCodePostal("75001")).toBe(true);
  });

  it("should accept postal code starting with 0", () => {
    expect(validateCodePostal("01000")).toBe(true);
  });

  it("should reject a code with only 4 digits", () => {
    expect(validateCodePostal("7500")).toBe(false);
  });

  it("should reject a code with 6 digits", () => {
    expect(validateCodePostal("750011")).toBe(false);
  });

  it("should reject a code containing letters", () => {
    expect(validateCodePostal("7500A")).toBe(false);
  });

  it("should reject an empty string", () => {
    expect(validateCodePostal("")).toBe(false);
  });

  it("should reject a code with spaces", () => {
    expect(validateCodePostal("75 001")).toBe(false);
  });
});

/**
 * @function validateName
 */
describe("validateName Unit Test Suites", () => {
  it("should accept a simple name", () => {
    expect(validateName("Dupont")).toBe(true);
  });

  it("should accept a name with a hyphen", () => {
    expect(validateName("Marie-Claire")).toBe(true);
  });

  it("should accept a name with accents", () => {
    expect(validateName("Héloïse")).toBe(true);
  });

  it("should accept a name with a cedilla", () => {
    expect(validateName("François")).toBe(true);
  });

  it("should accept a name with a tréma", () => {
    expect(validateName("Noël")).toBe(true);
  });

  it("should accept a name with an apostrophe", () => {
    expect(validateName("D'Alembert")).toBe(true);
  });

  it("should accept a city name with space and accents", () => {
    expect(validateName("Saint-Étienne")).toBe(true);
  });

  it("should reject a name containing digits", () => {
    expect(validateName("Jean2")).toBe(false);
  });

  it("should reject a name containing @", () => {
    expect(validateName("Jean@")).toBe(false);
  });

  it("should reject a name containing underscore", () => {
    expect(validateName("Jean_Dupont")).toBe(false);
  });

  it("should reject an empty string", () => {
    expect(validateName("")).toBe(false);
  });
});

/**
 * @function getFieldError
 */
describe("getFieldError Unit Test Suites", () => {
  it("should return an error when value is empty", () => {
    expect(getFieldError("nom", "")).toBe("Ce champ est requis");
  });

  it("should return empty string for valid nom", () => {
    expect(getFieldError("nom", "Dupont")).toBe("");
  });

  it("should return an error for invalid nom", () => {
    expect(getFieldError("nom", "Dupont123")).toBe(
      "Champ invalide (pas de chiffres ni caractères spéciaux)"
    );
  });

  it("should return empty string for valid prenom", () => {
    expect(getFieldError("prenom", "Jean")).toBe("");
  });

  it("should return an error for invalid prenom", () => {
    expect(getFieldError("prenom", "Jean@")).toBe(
      "Champ invalide (pas de chiffres ni caractères spéciaux)"
    );
  });

  it("should return empty string for valid ville", () => {
    expect(getFieldError("ville", "Paris")).toBe("");
  });

  it("should return an error for invalid ville", () => {
    expect(getFieldError("ville", "Paris2")).toBe(
      "Champ invalide (pas de chiffres ni caractères spéciaux)"
    );
  });

  it("should return empty string for valid email", () => {
    expect(getFieldError("mail", "jean@example.com")).toBe("");
  });

  it("should return an error for invalid email", () => {
    expect(getFieldError("mail", "notanemail")).toBe("Email invalide");
  });

  it("should return empty string for an adult date of birth", () => {
    expect(getFieldError("dateNaissance", "1990-06-15")).toBe("");
  });

  it("should return an error for a minor date of birth", () => {
    expect(getFieldError("dateNaissance", "2015-01-01")).toBe(
      "Vous devez avoir au moins 18 ans"
    );
  });

  it("should return empty string for a valid postal code", () => {
    expect(getFieldError("codePostal", "75001")).toBe("");
  });

  it("should return an error for an invalid postal code", () => {
    expect(getFieldError("codePostal", "7500")).toBe(
      "Code postal invalide (5 chiffres)"
    );
  });
});
