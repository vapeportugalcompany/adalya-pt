const menuButton = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

(function heroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const track = slider.querySelector(".slides");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  const indicators = Array.from(slider.querySelectorAll(".indicator"));
  let current = 0;
  let timer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    indicators.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  function start() {
    timer = window.setInterval(() => goTo(current + 1), 4200);
  }

  function restart() {
    window.clearInterval(timer);
    start();
  }

  prev?.addEventListener("click", () => {
    goTo(current - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    goTo(current + 1);
    restart();
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
      restart();
    });
  });

  goTo(0);
  start();
})();

(function filterProducts() {
  const tabs = Array.from(document.querySelectorAll(".filter-tab"));
  const cards = Array.from(document.querySelectorAll(".product-card"));
  if (!tabs.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach((card) => {
      card.classList.toggle("hidden", card.dataset.category !== filter);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.dataset.filter);
    });
  });

  applyFilter(tabs[0].dataset.filter);
})();

(function toggleDescriptions() {
  const button = document.getElementById("toggle-desc");
  const extras = Array.from(document.querySelectorAll(".description-card.hidden"));
  if (!button || !extras.length) return;

  let open = false;
  button.addEventListener("click", () => {
    open = !open;
    extras.forEach((card) => card.classList.toggle("hidden", !open));
    button.textContent = open ? "Ver menos" : "Ver mais";
  });
})();

(function ageGate() {
  const modal = document.getElementById("ageModal");
  const yes = document.getElementById("yesBtn");
  const no = document.getElementById("noBtn");
  if (!modal || !yes || !no) return;

  const storageKey = "adalya_age_verified";
  const body = document.body;

  function readConfirmation() {
    try {
      if (window.localStorage.getItem(storageKey) === "true") {
        return true;
      }
    } catch (error) {
      // Fall through to the in-memory check if storage is unavailable.
    }

    return modal.dataset.confirmed === "true";
  }

  function writeConfirmation(value) {
    modal.dataset.confirmed = String(value);

    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch (error) {
      // Ignore storage failures and fall back to the in-memory flag.
    }
  }

  function setModalOpen(isOpen) {
    modal.setAttribute("aria-hidden", String(!isOpen));
    body.classList.toggle("age-gate-open", isOpen);

    if (isOpen) {
      yes.focus();
    }
  }

  function initGate() {
    setModalOpen(!readConfirmation());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGate, { once: true });
  } else {
    initGate();
  }

  yes.addEventListener("click", () => {
    writeConfirmation(true);
    setModalOpen(false);
  });

  no.addEventListener("click", () => {
    window.location.href = "https://www.google.es";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      event.preventDefault();
      yes.focus();
    }
  });
})();

(function warningBar() {
  const warning = document.querySelector(".warning-bar");
  const header = document.querySelector(".site-header");
  if (!warning) return;

  window.addEventListener("scroll", () => {
    const isScrolled = window.scrollY > 20;
    warning.style.transform = window.scrollY > 20 ? "translateY(-100%)" : "translateY(0)";
    warning.style.transition = "transform 0.3s ease";
    header?.classList.toggle("scrolled", isScrolled);
  });
})();

(function cityToggle() {
  const toggle = document.getElementById("citiesTogle");
  const body = document.getElementById("citiesBody");
  if (!toggle || !body) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    body.classList.toggle("open", !open);
    body.style.maxHeight = open ? "0px" : `${body.scrollHeight}px`;
  });
})();

(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
    observer.observe(item);
  });
})();

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
