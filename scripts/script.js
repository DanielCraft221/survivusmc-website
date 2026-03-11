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
    progress = Math.min(progress + increment, 100);

    const roundedProgress = Math.floor(progress);
    loadingProgress.style.width = roundedProgress + "%";
    loadingPercentage.textContent = roundedProgress + "%";

    animationFrameId = requestAnimationFrame(updateLoading);
  } else {
    completeLoading();
  }
}

let isCompleting = false;

async function completeLoading() {
  if (isCompleting) return;
  isCompleting = true;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  loadingProgress.style.width = "100%";
  loadingPercentage.textContent = "100%";

  await preloadImages();

  mainContent.classList.add("show");

  await new Promise((resolve) => setTimeout(resolve, 100));

  setTimeout(() => {
    loadingScreen.classList.add("hide");

    setTimeout(() => {
      loadingScreen.style.display = "none";
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

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.querySelector(".menu-toggle");
  const isActive = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
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
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navLinks = document.getElementById("navLinks");
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");

      const menuToggle = document.querySelector(".menu-toggle");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
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
    },
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
      const formData = new FormData(form);
      const formPayload = Object.fromEntries(formData.entries());

      await fetch(form.action || "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });

      alert("Formulário enviado com sucesso!");
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
});
