(() => {
  "use strict";

  // Configure the real WhatsApp number here later, using digits only.
  const WHATSAPP_NUMBER = "";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const backTop = document.querySelector(".back-to-top");
  const toast = document.querySelector("#toast");
  const projectButton = document.querySelector("[data-disabled-projects]");
  const form = document.querySelector("#contact-form");

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  };

  const setupHeader = () => {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
      backTop.classList.toggle("visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  const closeMenu = () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  document.querySelectorAll('.main-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#" || targetId === "#topo") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  projectButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("A página de projetos ainda está em preparação.");
  });

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (!WHATSAPP_NUMBER) {
        showToast("WhatsApp ainda não configurado. Insira o número no script.js.");
        return;
      }

      const message = encodeURIComponent(
        "Olá, WEBSIL! Gostaria de conversar sobre um projeto."
      );

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const open = item.classList.toggle("open");
      question.setAttribute("aria-expanded", String(open));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

  const validateField = (field) => {
    const error = field.parentElement.querySelector(".field-error");
    let message = "";

    if (!field.value.trim()) {
      message = "Preencha este campo.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      message = "Digite um e-mail válido.";
    } else if (field.name === "whatsapp" && field.value.replace(/\D/g, "").length < 10) {
      message = "Informe um WhatsApp válido.";
    }

    field.classList.toggle("invalid", Boolean(message));
    if (error) error.textContent = message;
    return !message;
  };

  form?.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("input, select, textarea")];
    const valid = fields.every(validateField);
    const feedback = document.querySelector("#form-feedback");

    if (!valid) {
      feedback.textContent = "Revise os campos destacados antes de continuar.";
      feedback.classList.add("error");
      return;
    }

    feedback.classList.remove("error");
    feedback.textContent = "Validação concluída. O formulário está pronto para receber uma integração de envio.";
    form.reset();
    fields.forEach((field) => field.classList.remove("invalid"));
    form.querySelectorAll(".field-error").forEach((error) => error.textContent = "");
  });

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  setupHeader();
})();
