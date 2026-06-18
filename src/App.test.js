import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import App from "./App";

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock("axios", () => ({
  create: () => ({
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
    delete: (...args) => mockDelete(...args),
  }),
}));

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockDelete.mockReset();

  mockGet.mockResolvedValue({ data: { utilisateurs: [] } });
  mockPost.mockResolvedValue({ data: { message: "Utilisateur créé" } });
  mockDelete.mockResolvedValue({ data: {} });
});

const VALID_FORM = {
  lastName: "Dupont",
  firstName: "Jean",
  email: "jean.dupont@example.com",
  birthDate: "1990-06-15",
  city: "Paris",
  postalCode: "75001",
};

function fillForm(data) {
  fireEvent.change(screen.getByLabelText(/^Nom/i), { target: { value: data.lastName } });
  fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: data.firstName } });
  fireEvent.change(screen.getByLabelText(/^Mail/i), { target: { value: data.email } });
  fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: data.birthDate } });
  fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: data.city } });
  fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: data.postalCode } });
}

async function loginAsAdmin() {
  mockGet.mockResolvedValueOnce({
    data: { utilisateurs: [{ id: 1, firstName: "Jean", lastName: "Dupont", email: "jean@test.com" }] },
  });
  mockPost.mockResolvedValueOnce({ data: { success: true, is_admin: true } });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId("registeredUser-0")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByTestId("admin-email-input"), { target: { value: "admin@test.com" } });
  fireEvent.change(screen.getByTestId("admin-password-input"), { target: { value: "password" } });
  fireEvent.click(screen.getByTestId("login-btn"));

  await waitFor(() => {
    expect(screen.getByTestId("admin-logged")).toBeInTheDocument();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Initial render", () => {
  it("should display all form fields", () => {
    render(<App />);
    expect(screen.getByLabelText(/^Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mail/i)).toBeInTheDocument();
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

// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Red error messages", () => {
  it("should display an error for an invalid last name (digits)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), { target: { value: "Dupont123" } });
    const error = screen.getByTestId("error-lastName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid first name (special character)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: "Jean@" } });
    const error = screen.getByTestId("error-firstName");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid email", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Mail/i), { target: { value: "pasunemail" } });
    const error = screen.getByTestId("error-email");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for a minor (date of birth)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: "2015-01-01" } });
    const error = screen.getByTestId("error-birthDate");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid city", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: "Paris2" } });
    const error = screen.getByTestId("error-city");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should display an error for an invalid postal code (4 digits)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: "7500" } });
    const error = screen.getByTestId("error-postalCode");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("should not display an error when the field is valid", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), { target: { value: "Dupont" } });
    expect(screen.queryByTestId("error-lastName")).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Success toaster", () => {
  it("should display the toaster after a valid submission", async () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toBeInTheDocument();
      expect(screen.getByTestId("toaster")).toHaveTextContent("Inscription réussie !");
    });
  });

  it("should clear fields after a valid submission", async () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByLabelText(/^Nom/i).value).toBe("");
      expect(screen.getByLabelText(/Prénom/i).value).toBe("");
      expect(screen.getByLabelText(/^Mail/i).value).toBe("");
      expect(screen.getByLabelText(/Date de naissance/i).value).toBe("");
      expect(screen.getByLabelText(/Ville/i).value).toBe("");
      expect(screen.getByLabelText(/Code postal/i).value).toBe("");
    });
  });

  it("should hide the toaster after 3 seconds", async () => {
    jest.useFakeTimers();
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toBeInTheDocument();
    });
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByTestId("toaster")).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Error toaster", () => {
  it("should show an error toaster when email is already used (409)", async () => {
    mockPost.mockRejectedValueOnce({ response: { status: 409 } });
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toHaveTextContent("Cet email est déjà utilisé.");
      expect(screen.getByTestId("toaster")).toHaveStyle({ background: "red" });
    });
  });

  it("should show a generic error toaster on network error during submit", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network error"));
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toHaveTextContent("Erreur lors de l'inscription.");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Admin login", () => {
  it("should show admin confirmation when credentials are correct", async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true, is_admin: true } });
    render(<App />);
    fireEvent.change(screen.getByTestId("admin-email-input"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByTestId("admin-password-input"), { target: { value: "password" } });
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("admin-logged")).toBeInTheDocument();
    });
  });

  it("should show an error when the account is not admin", async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true, is_admin: false } });
    render(<App />);
    fireEvent.change(screen.getByTestId("admin-email-input"), { target: { value: "user@test.com" } });
    fireEvent.change(screen.getByTestId("admin-password-input"), { target: { value: "password" } });
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toBeInTheDocument();
    });
  });

  it("should show an error when login fails (network error)", async () => {
    mockPost.mockRejectedValueOnce(new Error("Unauthorized"));
    render(<App />);
    fireEvent.change(screen.getByTestId("admin-email-input"), { target: { value: "wrong@test.com" } });
    fireEvent.change(screen.getByTestId("admin-password-input"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Admin actions", () => {
  it("should show action buttons next to users when logged in as admin", async () => {
    await loginAsAdmin();
    expect(screen.getByTestId("btn-details-0")).toBeInTheDocument();
    expect(screen.getByTestId("btn-delete-0")).toBeInTheDocument();
  });

  it("should display user details when clicking Détails", async () => {
    await loginAsAdmin();
    mockGet.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@test.com",
        birthDate: "1990-06-15",
        city: "Paris",
        postalCode: "75001",
      },
    });
    fireEvent.click(screen.getByTestId("btn-details-0"));
    await waitFor(() => {
      expect(screen.getByTestId("user-details")).toBeInTheDocument();
    });
  });

  it("should show an error toaster when viewing details fails", async () => {
    await loginAsAdmin();
    mockGet.mockRejectedValueOnce(new Error("Forbidden"));
    fireEvent.click(screen.getByTestId("btn-details-0"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toHaveTextContent("Impossible de charger les détails.");
    });
  });

  it("should close the user details panel when clicking Fermer", async () => {
    await loginAsAdmin();
    mockGet.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@test.com",
        birthDate: "1990-06-15",
        city: "Paris",
        postalCode: "75001",
      },
    });
    fireEvent.click(screen.getByTestId("btn-details-0"));
    await waitFor(() => {
      expect(screen.getByTestId("user-details")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Fermer"));
    expect(screen.queryByTestId("user-details")).not.toBeInTheDocument();
  });

  it("should delete a user and show a success toaster", async () => {
    await loginAsAdmin();
    fireEvent.click(screen.getByTestId("btn-delete-0"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toHaveTextContent("Utilisateur supprimé.");
    });
  });

  it("should show an error toaster when deletion fails", async () => {
    await loginAsAdmin();
    mockDelete.mockRejectedValueOnce(new Error("Forbidden"));
    fireEvent.click(screen.getByTestId("btn-delete-0"));
    await waitFor(() => {
      expect(screen.getByTestId("toaster")).toHaveTextContent("Erreur lors de la suppression.");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("App - Fetch error", () => {
  it("should handle a failed user fetch on mount without crashing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGet.mockRejectedValueOnce(new Error("Network error"));
    render(<App />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
