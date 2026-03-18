const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingPercentage = document.getElementById("loadingPercentage");
const mainContent = document.getElementById("main-content");

let progress = 0;
let animationFrameId = null;
let isCompleting = false;

function preloadImages() {
  return new Promise((resolve) => {
    const imagesToPreload = [
      "/images/wallpaper-fundo-hero-logo.png",
      "/images/minecraft-java-edition.png",
      "/images/minecraft-bedrock-edition.png",
    ];

    let loadedCount = 0;
    const total = imagesToPreload.length;

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === total) resolve();
      };
      img.src = src;
    });
  });
}

function setProgress(value) {
  const rounded = Math.floor(value);
  loadingProgress.style.width = rounded + "%";
  loadingPercentage.textContent = rounded + "%";

  const bar = loadingProgress.closest("[role='progressbar']");
  if (bar) bar.setAttribute("aria-valuenow", rounded);
}

function updateLoading() {
  if (progress < 95) {
    const increment = Math.random() * 5 + 2;
    progress = Math.min(progress + increment, 95);
    setProgress(progress);
    animationFrameId = requestAnimationFrame(updateLoading);
  } else {
    completeLoading();
  }
}

async function completeLoading() {
  if (isCompleting) return;
  isCompleting = true;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  await preloadImages();

  progress = 100;
  setProgress(100);

  mainContent.classList.add("show");

  await new Promise((resolve) => setTimeout(resolve, 300));

  loadingScreen.classList.add("hide");

  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(updateLoading);
  });
} else {
  requestAnimationFrame(updateLoading);
}

window.addEventListener("beforeunload", () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.querySelector(".menu-toggle");
  const isActive = navLinks.classList.toggle("active");

  menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
  menuToggle.setAttribute(
    "aria-label",
    isActive ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
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
    menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navLinks = document.getElementById("navLinks");
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");

      const menuToggle = document.querySelector(".menu-toggle");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
      menuToggle.focus();
    }
  }
});
