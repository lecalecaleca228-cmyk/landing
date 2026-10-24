const burger = document.querySelector(".burger");
const nav = document.querySelector(".site-nav");

burger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  burger.classList.toggle("is-open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  });
});

const FORM_ENDPOINT = "https://formspree.io/f/moeeqzze";

const form = document.querySelector(".contact-form");
const statusLine = form.querySelector(".form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  statusLine.classList.remove("is-success", "is-error");
  statusLine.textContent = "";

  try {
    if (FORM_ENDPOINT) {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.info("Демо-режим: заполните FORM_ENDPOINT в script.js, чтобы заявки реально отправлялись.");
    }

    statusLine.textContent = "Спасибо! Заявка отправлена, я свяжусь с вами в ближайшее время.";
    statusLine.classList.add("is-success");
    form.reset();
  } catch (error) {
    statusLine.textContent = "Не удалось отправить. Попробуйте ещё раз или напишите напрямую в Telegram.";
    statusLine.classList.add("is-error");
  } finally {
    button.disabled = false;
  }
});

document.querySelector(".footer-year").textContent = new Date().getFullYear();

const copyBtn = document.querySelector("[data-copy]");
const payStatus = document.querySelector(".pay-status");

if (copyBtn && payStatus) {
  copyBtn.addEventListener("click", async () => {
    const value = copyBtn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const tmp = document.createElement("textarea");
      tmp.value = value;
      tmp.setAttribute("readonly", "");
      tmp.style.position = "absolute";
      tmp.style.left = "-9999px";
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
    }
    payStatus.textContent = "Номер скопирован — вставьте его в приложении банка.";
    setTimeout(() => {
      payStatus.textContent = "";
    }, 4000);
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

if (!prefersReducedMotion && canHover) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
