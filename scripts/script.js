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
