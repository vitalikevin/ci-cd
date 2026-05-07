import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

const STORAGE_KEY = "registeredUsers";

const VALID_FORM = {
  lastName: "Dupont",
  firstName: "Jean",
  email: "jean.dupont@example.com",
  birthDate: "1990-06-15",
  city: "Paris",
  postalCode: "75001",
};

function fillForm(data) {
  fireEvent.change(screen.getByLabelText(/^Nom/i), {
    target: { value: data.lastName },
  });
  fireEvent.change(screen.getByLabelText(/Prénom/i), {
    target: { value: data.firstName },
  });
  fireEvent.change(screen.getByLabelText(/Mail/i), {
    target: { value: data.email },
  });
  fireEvent.change(screen.getByLabelText(/Date de naissance/i), {
    target: { value: data.birthDate },
  });
  fireEvent.change(screen.getByLabelText(/Ville/i), {
    target: { value: data.city },
  });
  fireEvent.change(screen.getByLabelText(/Code postal/i), {
    target: { value: data.postalCode },
  });
}

beforeEach(() => {
  localStorage.clear();
});

describe("App - Initial render", () => {
  it("should display all form fields", () => {
    render(<App />);
    expect(screen.getByLabelText(/^Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
  });

  it("should display the save button", () => {
    render(<App />);
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("should display an empty registered users list", () => {
    render(<App />);
    expect(screen.getByTestId("registeredUsers-list")).toBeInTheDocument();
    expect(screen.getByTestId("registeredUsers-list").children).toHaveLength(0);
  });
});

describe("App - Button disabled state", () => {
  it("should be disabled when the form is empty", () => {
    render(<App />);
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });

  it("should be enabled when all fields are valid", () => {
    render(<App />);
    fillForm(VALID_FORM);
    expect(screen.getByTestId("submit-btn")).not.toBeDisabled();
  });
});

describe("App - Red error messages", () => {
  it("should display an error for an invalid last name (digits)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "Dupont123" },
    });
    const error = screen.getByTestId("error-lastName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid first name (special character)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: "Jean@" },
    });
    const error = screen.getByTestId("error-firstName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid email", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Mail/i), {
      target: { value: "pasunemail" },
    });
    const error = screen.getByTestId("error-email");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for a minor (date of birth)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), {
      target: { value: "2015-01-01" },
    });
    const error = screen.getByTestId("error-birthDate");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid city", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Ville/i), {
      target: { value: "Paris2" },
    });
    const error = screen.getByTestId("error-city");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid postal code (4 digits)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Code postal/i), {
      target: { value: "7500" },
    });
    const error = screen.getByTestId("error-postalCode");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should not display an error when the field is valid", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "Dupont" },
    });
    expect(screen.queryByTestId("error-lastName")).not.toBeInTheDocument();
  });
});

describe("App - Success toaster", () => {
  it("should display the toaster after a valid submission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toHaveTextContent(
      "Inscription réussie !"
    );
  });

  it("should clear fields after a valid submission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByLabelText(/^Nom/i).value).toBe("");
    expect(screen.getByLabelText(/Prénom/i).value).toBe("");
    expect(screen.getByLabelText(/Mail/i).value).toBe("");
    expect(screen.getByLabelText(/Date de naissance/i).value).toBe("");
    expect(screen.getByLabelText(/Ville/i).value).toBe("");
    expect(screen.getByLabelText(/Code postal/i).value).toBe("");
  });

  it("should hide the toaster after 3 seconds", () => {
    jest.useFakeTimers();
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByTestId("toaster")).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});

describe("App - localStorage", () => {
  it("should save data to localStorage after submission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].lastName).toBe("Dupont");
    expect(saved[0].firstName).toBe("Jean");
    expect(saved[0].email).toBe("jean.dupont@example.com");
  });

  it("should load existing users from localStorage on mount", () => {
    const existing = [
      {
        lastName: "Martin",
        firstName: "Luc",
        email: "luc@test.com",
        birthDate: "1990-01-01",
        city: "Lyon",
        postalCode: "69000",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    render(<App />);
    expect(screen.getByTestId("registeredUser-0")).toHaveTextContent("Luc Martin");
  });

  it("should handle corrupted localStorage without crashing", () => {
    localStorage.setItem(STORAGE_KEY, "données-invalides");
    render(<App />);
    expect(screen.getByTestId("registeredUsers-list").children).toHaveLength(0);
  });
});

describe("App - Registered users list", () => {
  it("should display a registered user in the list after submission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("registeredUser-0")).toHaveTextContent("Jean Dupont");
    expect(screen.getByTestId("registeredUser-0")).toHaveTextContent(
      "jean.dupont@example.com"
    );
  });
});
