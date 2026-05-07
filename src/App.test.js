import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

const STORAGE_KEY = "inscrits";

const VALID_FORM = {
  nom: "Dupont",
  prenom: "Jean",
  mail: "jean.dupont@example.com",
  dateNaissance: "1990-06-15",
  ville: "Paris",
  codePostal: "75001",
};

function fillForm(data) {
  fireEvent.change(screen.getByLabelText(/^Nom/i), {
    target: { value: data.nom },
  });
  fireEvent.change(screen.getByLabelText(/Prénom/i), {
    target: { value: data.prenom },
  });
  fireEvent.change(screen.getByLabelText(/Mail/i), {
    target: { value: data.mail },
  });
  fireEvent.change(screen.getByLabelText(/Date de naissance/i), {
    target: { value: data.dateNaissance },
  });
  fireEvent.change(screen.getByLabelText(/Ville/i), {
    target: { value: data.ville },
  });
  fireEvent.change(screen.getByLabelText(/Code postal/i), {
    target: { value: data.codePostal },
  });
}

beforeEach(() => {
  localStorage.clear();
});

describe("App - Rendu initial", () => {
  it("affiche tous les champs du formulaire", () => {
    render(<App />);
    expect(screen.getByLabelText(/^Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
  });

  it("affiche le bouton Sauvegarder", () => {
    render(<App />);
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("affiche la liste des inscrits (vide au départ)", () => {
    render(<App />);
    expect(screen.getByTestId("inscrits-list")).toBeInTheDocument();
    expect(screen.getByTestId("inscrits-list").children).toHaveLength(0);
  });
});

describe("App - Désactivation du bouton", () => {
  it("le bouton est désactivé quand le formulaire est vide", () => {
    render(<App />);
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });

  it("le bouton reste désactivé si un seul champ est rempli", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "Dupont" },
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });

  it("le bouton est activé quand tous les champs sont valides", () => {
    render(<App />);
    fillForm(VALID_FORM);
    expect(screen.getByTestId("submit-btn")).not.toBeDisabled();
  });

  it("le bouton est désactivé si un champ valide est ensuite vidé", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "" },
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });
});

describe("App - Messages d'erreur en rouge", () => {
  it("affiche une erreur rouge pour un nom invalide (chiffres)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "Dupont123" },
    });
    const error = screen.getByTestId("error-nom");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("affiche une erreur rouge pour un prénom invalide (caractère spécial)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: "Jean@" },
    });
    const error = screen.getByTestId("error-prenom");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("affiche une erreur rouge pour un email invalide", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Mail/i), {
      target: { value: "pasunemail" },
    });
    const error = screen.getByTestId("error-mail");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("affiche une erreur rouge pour un mineur (date de naissance)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), {
      target: { value: "2015-01-01" },
    });
    const error = screen.getByTestId("error-dateNaissance");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("affiche une erreur rouge pour une ville invalide", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Ville/i), {
      target: { value: "Paris2" },
    });
    const error = screen.getByTestId("error-ville");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("affiche une erreur rouge pour un code postal invalide (4 chiffres)", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Code postal/i), {
      target: { value: "7500" },
    });
    const error = screen.getByTestId("error-codePostal");
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "red" });
  });

  it("n'affiche pas d'erreur quand le champ est valide", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Nom/i), {
      target: { value: "Dupont" },
    });
    expect(screen.queryByTestId("error-nom")).not.toBeInTheDocument();
  });
});

describe("App - Toaster de succès", () => {
  it("affiche le toaster après une soumission valide", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toHaveTextContent(
      "Inscription réussie !"
    );
  });

  it("vide les champs après une soumission valide", () => {
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

  it("le toaster disparaît après 3 secondes", () => {
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

describe("App - Sauvegarde dans le localStorage", () => {
  it("sauvegarde les données dans le localStorage après soumission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].nom).toBe("Dupont");
    expect(saved[0].prenom).toBe("Jean");
    expect(saved[0].mail).toBe("jean.dupont@example.com");
  });

  it("cumule les inscrits dans le localStorage à chaque soumission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    fillForm({ ...VALID_FORM, nom: "Martin", mail: "martin@example.com" });
    fireEvent.click(screen.getByTestId("submit-btn"));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(2);
    expect(saved[1].nom).toBe("Martin");
  });

  it("charge les inscrits existants depuis le localStorage au montage", () => {
    const existing = [
      {
        nom: "Martin",
        prenom: "Luc",
        mail: "luc@test.com",
        dateNaissance: "1990-01-01",
        ville: "Lyon",
        codePostal: "69000",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    render(<App />);
    expect(screen.getByTestId("inscrit-0")).toHaveTextContent("Luc Martin");
  });

  it("gère un localStorage corrompu sans planter", () => {
    localStorage.setItem(STORAGE_KEY, "données-invalides");
    render(<App />);
    expect(screen.getByTestId("inscrits-list").children).toHaveLength(0);
  });
});

describe("App - Liste des inscrits", () => {
  it("affiche un inscrit dans la liste après soumission", () => {
    render(<App />);
    fillForm(VALID_FORM);
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("inscrit-0")).toHaveTextContent("Jean Dupont");
    expect(screen.getByTestId("inscrit-0")).toHaveTextContent(
      "jean.dupont@example.com"
    );
  });
});
