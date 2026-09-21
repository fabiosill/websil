(() => {
  "use strict";

  // Número do WhatsApp, somente dígitos (com DDI + DDD).
  const WHATSAPP_NUMBER = "5511984701353";
  const WHATSAPP_MESSAGE = "Olá, WEBSIL! Gostaria de conversar sobre um projeto.";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const backTop = document.querySelector(".back-to-top");
  const toast = document.querySelector("#toast");
  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");
  const briefingTrigger = document.querySelector(".briefing-mobile-trigger");
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll("main > section[id]")];
  const heroVideo = document.querySelector(".hero-video");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopNav = window.matchMedia("(min-width: 1025px)");
  const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");

  /* ---------- Toast ---------- */
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  };

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  const closeMenu = () => setMenu(false);

  menuToggle?.addEventListener("click", () => {
    setMenu(!mainNav.classList.contains("open"));
  });

  // Fecha com Esc, clique fora ou ao voltar para o layout de desktop
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav?.classList.contains("open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!mainNav?.classList.contains("open")) return;
    if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMenu();
  });

  desktopNav.addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });

  /* ---------- Briefing (formulário recolhido no celular) ---------- */
  const setBriefing = (open) => {
    if (!form) return;
    form.classList.toggle("mobile-open", open);
    briefingTrigger?.setAttribute("aria-expanded", String(open));
  };

  briefingTrigger?.addEventListener("click", () => {
    const open = !form.classList.contains("mobile-open");
    setBriefing(open);
    if (open) form.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  });

  /* ---------- WhatsApp ---------- */
  // Com o número configurado, os links recebem um href real (funciona com
  // toque longo, "abrir em nova aba" etc.). Isso precisa rodar antes da
  // rolagem suave abaixo, que só trata links que começam com "#".
  const whatsappNumber = String(WHATSAPP_NUMBER).replace(/\D/g, "");

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    if (whatsappNumber) {
      link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      return;
    }
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("WhatsApp ainda não configurado. Insira o número no script.js.");
    });
  });

  /* ---------- Rolagem suave entre âncoras ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      // O header agora é position:fixed, então o salto nativo para #topo não rola a página.
      if (targetId === "#topo") {
        event.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      // No celular o formulário fica recolhido: qualquer link para #contato o abre
      if (targetId === "#contato") setBriefing(true);
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      if (targetId === "#conteudo") target.focus({ preventScroll: true });
    });
  });

  /* ---------- Header, botão "voltar ao topo" e link ativo ---------- */
  const updateActiveLink = () => {
    if (!sections.length) return;
    const line = window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= line) current = section;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1];

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      header?.classList.toggle("scrolled", window.scrollY > 10);
      backTop?.classList.toggle("visible", window.scrollY > 600);
      updateActiveLink();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const open = item.classList.toggle("open");
      question.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Animação de entrada ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("is-visible"));
  }

  /* ---------- Vídeo do hero ---------- */
  if (heroVideo && reduceMotion.matches) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
  }

  /* ---------- Formulário ---------- */
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
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };

  form?.querySelectorAll("input, select, textarea").forEach((field) => {
    if (field.type === "hidden") return;
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  const submitButton = form?.querySelector('[type="submit"]');

  form?.addEventListener("submit", (event) => {
    const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];

    // Valida TODOS os campos (com every() a validação parava no primeiro erro
    // e só um campo aparecia destacado).
    fields.forEach(validateField);
    const firstInvalid = fields.find((field) => field.classList.contains("invalid"));

    if (firstInvalid) {
      event.preventDefault();
      feedback.textContent = "Revise os campos destacados antes de continuar.";
      feedback.classList.add("error");
      firstInvalid.focus();
      return;
    }

    feedback.classList.remove("error");
    feedback.textContent = "Enviando seu briefing para a WEBSIL…";
    if (submitButton) submitButton.disabled = true; // evita envio duplo
  });

  // Ao voltar pelo histórico (bfcache) o botão não pode ficar travado
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && submitButton) {
      submitButton.disabled = false;
      feedback.textContent = "";
    }
  });

  // O FormSubmit redireciona de volta para /?enviado=1#contato: confirma o envio
  const params = new URLSearchParams(window.location.search);
  if (params.get("enviado") === "1") {
    showToast("Briefing enviado! A WEBSIL entrará em contato em breve.");
    params.delete("enviado");
    const query = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : "") + window.location.hash);
  }

  /* ---------- Cases: carrossel horizontal no mobile ---------- */
  const mobileProjectRail = document.querySelector(".project-preview");
  const mobileProjects = mobileProjectRail
    ? [...mobileProjectRail.querySelectorAll(".project-placeholder")]
    : [];

  if (mobileProjectRail && mobileProjects.length) {
    const mobileProjectsQuery = window.matchMedia("(max-width: 760px)");
    let projectRaf = 0;

    const syncProjectSlider = () => {
      projectRaf = 0;
      if (!mobileProjectsQuery.matches) {
        mobileProjects.forEach((card) => card.classList.remove("is-slider-active"));
        return;
      }

      const railRect = mobileProjectRail.getBoundingClientRect();
      const railCenter = railRect.left + railRect.width / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      mobileProjects.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.width / 2) - railCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      mobileProjects.forEach((card, index) => {
        card.classList.toggle("is-slider-active", index === nearestIndex);
      });
    };

    const requestProjectSync = () => {
      if (projectRaf) return;
      projectRaf = window.requestAnimationFrame(syncProjectSlider);
    };

    mobileProjectRail.addEventListener("scroll", requestProjectSync, { passive: true });
    window.addEventListener("resize", requestProjectSync);
    mobileProjectsQuery.addEventListener?.("change", requestProjectSync);
    requestProjectSync();
  }

})();