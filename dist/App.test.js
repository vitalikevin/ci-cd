"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var STORAGE_KEY = "registeredUsers";
var VALID_FORM = {
  lastName: "Dupont",
  firstName: "Jean",
  email: "jean.dupont@example.com",
  birthDate: "1990-06-15",
  city: "Paris",
  postalCode: "75001"
};
function fillForm(data) {
  _react.fireEvent.change(_react.screen.getByLabelText(/^Nom/i), {
    target: {
      value: data.lastName
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText(/Prénom/i), {
    target: {
      value: data.firstName
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText(/Mail/i), {
    target: {
      value: data.email
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText(/Date de naissance/i), {
    target: {
      value: data.birthDate
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText(/Ville/i), {
    target: {
      value: data.city
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText(/Code postal/i), {
    target: {
      value: data.postalCode
    }
  });
}
beforeEach(function () {
  localStorage.clear();
});
describe("App - Initial render", function () {
  it("should display all form fields", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByLabelText(/^Nom/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Mail/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
  });
  it("should display the save button", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByTestId("submit-btn")).toBeInTheDocument();
  });
  it("should display an empty registered users list", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByTestId("registeredUsers-list")).toBeInTheDocument();
    expect(_react.screen.getByTestId("registeredUsers-list").children).toHaveLength(0);
  });
});
describe("App - Button disabled state", function () {
  it("should be disabled when the form is empty", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByTestId("submit-btn")).toBeDisabled();
  });
  it("should be enabled when all fields are valid", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    expect(_react.screen.getByTestId("submit-btn")).not.toBeDisabled();
  });
});
describe("App - Red error messages", function () {
  it("should display an error for an invalid last name (digits)", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/^Nom/i), {
      target: {
        value: "Dupont123"
      }
    });
    var error = _react.screen.getByTestId("error-lastName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should display an error for an invalid first name (special character)", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/Prénom/i), {
      target: {
        value: "Jean@"
      }
    });
    var error = _react.screen.getByTestId("error-firstName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should display an error for an invalid email", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/Mail/i), {
      target: {
        value: "pasunemail"
      }
    });
    var error = _react.screen.getByTestId("error-email");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should display an error for a minor (date of birth)", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/Date de naissance/i), {
      target: {
        value: "2015-01-01"
      }
    });
    var error = _react.screen.getByTestId("error-birthDate");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should display an error for an invalid city", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/Ville/i), {
      target: {
        value: "Paris2"
      }
    });
    var error = _react.screen.getByTestId("error-city");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should display an error for an invalid postal code (4 digits)", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/Code postal/i), {
      target: {
        value: "7500"
      }
    });
    var error = _react.screen.getByTestId("error-postalCode");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({
      color: "red"
    });
  });
  it("should not display an error when the field is valid", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    _react.fireEvent.change(_react.screen.getByLabelText(/^Nom/i), {
      target: {
        value: "Dupont"
      }
    });
    expect(_react.screen.queryByTestId("error-lastName")).not.toBeInTheDocument();
  });
});
describe("App - Success toaster", function () {
  it("should display the toaster after a valid submission", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    _react.fireEvent.click(_react.screen.getByTestId("submit-btn"));
    expect(_react.screen.getByTestId("toaster")).toBeInTheDocument();
    expect(_react.screen.getByTestId("toaster")).toHaveTextContent("Inscription réussie !");
  });
  it("should clear fields after a valid submission", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    _react.fireEvent.click(_react.screen.getByTestId("submit-btn"));
    expect(_react.screen.getByLabelText(/^Nom/i).value).toBe("");
    expect(_react.screen.getByLabelText(/Prénom/i).value).toBe("");
    expect(_react.screen.getByLabelText(/Mail/i).value).toBe("");
    expect(_react.screen.getByLabelText(/Date de naissance/i).value).toBe("");
    expect(_react.screen.getByLabelText(/Ville/i).value).toBe("");
    expect(_react.screen.getByLabelText(/Code postal/i).value).toBe("");
  });
  it("should hide the toaster after 3 seconds", function () {
    jest.useFakeTimers();
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    _react.fireEvent.click(_react.screen.getByTestId("submit-btn"));
    expect(_react.screen.getByTestId("toaster")).toBeInTheDocument();
    (0, _react.act)(function () {
      jest.advanceTimersByTime(3000);
    });
    expect(_react.screen.queryByTestId("toaster")).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});
describe("App - localStorage", function () {
  it("should save data to localStorage after submission", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    _react.fireEvent.click(_react.screen.getByTestId("submit-btn"));
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].lastName).toBe("Dupont");
    expect(saved[0].firstName).toBe("Jean");
    expect(saved[0].email).toBe("jean.dupont@example.com");
  });
  it("should load existing users from localStorage on mount", function () {
    var existing = [{
      lastName: "Martin",
      firstName: "Luc",
      email: "luc@test.com",
      birthDate: "1990-01-01",
      city: "Lyon",
      postalCode: "69000"
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByTestId("registeredUser-0")).toHaveTextContent("Luc Martin");
  });
  it("should handle corrupted localStorage without crashing", function () {
    localStorage.setItem(STORAGE_KEY, "données-invalides");
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    expect(_react.screen.getByTestId("registeredUsers-list").children).toHaveLength(0);
  });
});
describe("App - Registered users list", function () {
  it("should display a registered user in the list after submission", function () {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App["default"], {}));
    fillForm(VALID_FORM);
    _react.fireEvent.click(_react.screen.getByTestId("submit-btn"));
    expect(_react.screen.getByTestId("registeredUser-0")).toHaveTextContent("Jean Dupont");
    expect(_react.screen.getByTestId("registeredUser-0")).toHaveTextContent("jean.dupont@example.com");
  });
});