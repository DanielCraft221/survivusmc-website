const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingPercentage = document.getElementById("loadingPercentage");
const mainContent = document.getElementById("main-content");

let progress = 0;
let animationFrameId = null;

function preloadImages() {
  return new Promise((resolve) => {
    const imagesToPreload = [
      "/images/wallpaper-fundo-hero-logo.png",
      "/images/minecraft-java-edition.png",
      "/images/minecraft-bedrock-edition.png",
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };
      img.src = src;
    });
  });
}

function updateLoading() {
  if (progress < 100) {
    const increment = Math.random() * 5 + 2;
    progress += increment;

    if (progress > 100) progress = 100;

    const roundedProgress = Math.floor(progress);

    requestAnimationFrame(() => {
      loadingProgress.style.width = roundedProgress + "%";
      loadingPercentage.textContent = roundedProgress + "%";
    });

    animationFrameId = requestAnimationFrame(updateLoading);
  } else {
    completeLoading();
  }
}

async function completeLoading() {
  loadingProgress.style.width = "100%";
  loadingPercentage.textContent = "100%";

  await preloadImages();

  mainContent.classList.add("show");

  await new Promise((resolve) => setTimeout(resolve, 100));

  setTimeout(() => {
    loadingScreen.classList.add("hide");

    setTimeout(() => {
      loadingScreen.style.display = "none";

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }, 500);
  }, 200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(updateLoading);
  });
} else {
  requestAnimationFrame(updateLoading);
}

let menuToggleTimeout;
function toggleMenu() {
  clearTimeout(menuToggleTimeout);
  menuToggleTimeout = setTimeout(() => {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
  }, 50);
}

document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.querySelector(".menu-toggle");

  if (
    navLinks.classList.contains("active") &&
    !navLinks.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    navLinks.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navLinks = document.getElementById("navLinks");
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
    }
  }
});

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
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

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
});

window.addEventListener("beforeunload", () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (menuToggleTimeout) {
    clearTimeout(menuToggleTimeout);
  }
});
