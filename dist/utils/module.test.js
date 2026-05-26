"use strict";

var _module = require("./module");
/**
 * @function calculateAge
 */
describe("calculateAge Unit Test Suites", function () {
  it("should return a correct age", function () {
    var loise = {
      birth: new Date("11/07/1991")
    };
    expect((0, _module.calculateAge)(loise)).toEqual(34);
  });
  it('should throw a "missing param p" error', function () {
    expect(function () {
      return (0, _module.calculateAge)();
    }).toThrow("missing param p");
  });
  it('should throw a "p is not an object" error', function () {
    var loise = 34;
    expect(function () {
      return (0, _module.calculateAge)(loise);
    }).toThrow("p is not an object");
  });
});

/**
 * @function isAdult
 */
describe("isAdult Unit Test Suites", function () {
  it("should allow an user older than 18yo to register", function () {
    // Age > 18
    var userBirthDate = {
      birth: new Date("01/01/2001")
    };
    expect((0, _module.isAdult)(userBirthDate)).toBe(true);
  });
  it("should allow an user aged 18yo to register", function () {
    // Age = 18
    var today = new Date();
    var userBirthDate = {
      birth: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    };
    expect((0, _module.isAdult)(userBirthDate)).toBe(true);
  });
  it("should block a minor from registering", function () {
    // Age < 18
    var userBirthDate = {
      birth: new Date("01/01/2016")
    };
    expect((0, _module.isAdult)(userBirthDate)).toBe(false);
  });
});

/**
 * @function validateEmail
 */
describe("validateEmail Unit Test Suites", function () {
  it("should accept a valid email address", function () {
    expect((0, _module.validateEmail)("jean.dupont@example.com")).toBe(true);
  });
  it("should accept an email with subdomains", function () {
    expect((0, _module.validateEmail)("user@mail.company.fr")).toBe(true);
  });
  it("should reject an email without @", function () {
    expect((0, _module.validateEmail)("jeandupont.com")).toBe(false);
  });
  it("should reject an email without domain", function () {
    expect((0, _module.validateEmail)("jean@")).toBe(false);
  });
  it("should reject an email without TLD", function () {
    expect((0, _module.validateEmail)("jean@example")).toBe(false);
  });
  it("should reject an email with spaces", function () {
    expect((0, _module.validateEmail)("jean dupont@example.com")).toBe(false);
  });
  it("should reject an empty string", function () {
    expect((0, _module.validateEmail)("")).toBe(false);
  });
});

/**
 * @function validateCodePostal
 */
describe("validateCodePostal Unit Test Suites", function () {
  it("should accept a valid 5-digit French postal code", function () {
    expect((0, _module.validateCodePostal)("75001")).toBe(true);
  });
  it("should accept postal code starting with 0", function () {
    expect((0, _module.validateCodePostal)("01000")).toBe(true);
  });
  it("should reject a code with only 4 digits", function () {
    expect((0, _module.validateCodePostal)("7500")).toBe(false);
  });
  it("should reject a code with 6 digits", function () {
    expect((0, _module.validateCodePostal)("750011")).toBe(false);
  });
  it("should reject a code containing letters", function () {
    expect((0, _module.validateCodePostal)("7500A")).toBe(false);
  });
  it("should reject an empty string", function () {
    expect((0, _module.validateCodePostal)("")).toBe(false);
  });
  it("should reject a code with spaces", function () {
    expect((0, _module.validateCodePostal)("75 001")).toBe(false);
  });
});

/**
 * @function validateName
 */
describe("validateName Unit Test Suites", function () {
  it("should accept a simple name", function () {
    expect((0, _module.validateName)("Dupont")).toBe(true);
  });
  it("should accept a name with a hyphen", function () {
    expect((0, _module.validateName)("Marie-Claire")).toBe(true);
  });
  it("should accept a name with accents", function () {
    expect((0, _module.validateName)("Héloïse")).toBe(true);
  });
  it("should accept a name with a cedilla", function () {
    expect((0, _module.validateName)("François")).toBe(true);
  });
  it("should accept a name with a tréma", function () {
    expect((0, _module.validateName)("Noël")).toBe(true);
  });
  it("should accept a name with an apostrophe", function () {
    expect((0, _module.validateName)("D'Alembert")).toBe(true);
  });
  it("should accept a city name with space and accents", function () {
    expect((0, _module.validateName)("Saint-Étienne")).toBe(true);
  });
  it("should reject a name containing digits", function () {
    expect((0, _module.validateName)("Jean2")).toBe(false);
  });
  it("should reject a name containing @", function () {
    expect((0, _module.validateName)("Jean@")).toBe(false);
  });
  it("should reject a name containing underscore", function () {
    expect((0, _module.validateName)("Jean_Dupont")).toBe(false);
  });
  it("should reject an empty string", function () {
    expect((0, _module.validateName)("")).toBe(false);
  });
});

/**
 * @function getFieldError
 */
describe("getFieldError Unit Test Suites", function () {
  it("should return an error when value is empty", function () {
    expect((0, _module.getFieldError)("lastName", "")).toBe("Ce champ est requis");
  });
});