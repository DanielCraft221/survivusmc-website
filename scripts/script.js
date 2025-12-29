const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingPercentage = document.getElementById("loadingPercentage");
const mainContent = document.getElementById("main-content");

let progress = 0;

function updateLoading() {
  if (progress < 100) {
    const increment = Math.random() * 3 + 0.5;
    progress += increment;

    if (progress > 100) progress = 100;

    const roundedProgress = Math.floor(progress);
    loadingProgress.style.width = roundedProgress + "%";
    loadingPercentage.textContent = roundedProgress + "%";

    let delay = 50;
    if (progress < 20 || progress > 80) {
      delay = 100;
    }

    setTimeout(updateLoading, delay);
  } else {
    loadingProgress.style.width = "100%";
    loadingPercentage.textContent = "100%";

    setTimeout(() => {
      loadingScreen.classList.add("hide");
      mainContent.classList.add("show");
    }, 500);
  }
}

window.addEventListener("load", () => {
  setTimeout(updateLoading, 300);
});

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const token = form.querySelector('[name="cf-turnstile-response"]')?.value;

  if (!token) {
    alert("Por favor, complete a verificação de segurança");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = "Verificando...";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Verificação concluída! Enviando formulário...");

      const formData = new FormData(form);

      form.reset();
    } else {
      alert("Verificação de segurança falhou. Tente novamente.");
      console.error("Erros:", result.errors);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao verificar. Tente novamente mais tarde.");
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}
