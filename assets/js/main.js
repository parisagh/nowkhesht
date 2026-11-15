// ====== تنظیمات راه تماس: فقط این سه خط را پر کن ======
const CONTACT = {
  whatsapp: "",   // شماره با کد کشور و بدون صفر و + ، مثلاً 989141234567
  telegram: "Iamnotinhere",   // نام کاربری تلگرام بدون @ ، مثلاً nowkhesht
  email: "parigh.gh@gmail.com"       // مثلاً hello@nowkhesht.ir
};
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  const LANG = document.documentElement.lang || "fa";
  const T = {
    fa: { title: "درخواست مشاوره از سایت نوخشت", subject: "درخواست مشاوره", soon: "راه‌های تماس به‌زودی اضافه می‌شوند.", copied: "متن درخواست کپی شد. در تلگرام آن را بچسبانید و بفرستید.", locale: "fa-IR" },
    en: { title: "Consultation request from the Nowkhesht website", subject: "Consultation request", soon: "Contact options coming soon.", copied: "Message copied. Paste it in Telegram and send.", locale: "en-GB" },
    it: { title: "Richiesta di consulenza dal sito Nowkhesht", subject: "Richiesta di consulenza", soon: "Contatti in arrivo.", copied: "Messaggio copiato. Incollalo su Telegram e invialo.", locale: "it-IT" }
  }[LANG] || {};
  const y = document.getElementById("year");
  if (y) y.textContent = new Intl.DateTimeFormat(T.locale, { year: "numeric" }).format(new Date());

  const form = document.getElementById("consult-form");
  if (!form) return;
  const msg = document.getElementById("form-msg");
  const buttons = form.querySelectorAll("[data-channel]");
  buttons.forEach(b => { if (!CONTACT[b.dataset.channel]) b.hidden = true; });
  if (![...buttons].some(b => !b.hidden)) {
    msg.textContent = T.soon;
    msg.classList.add("show");
  }

  const compose = () => {
    const lines = [T.title];
    form.querySelectorAll("input, select, textarea").forEach(el => {
      const lab = el.closest("label");
      const name = lab ? (lab.childNodes[0].textContent || "").trim() : el.name;
      lines.push(name + ": " + (el.value || ""));
    });
    return lines.join("\n");
  };

  buttons.forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const text = encodeURIComponent(compose());
    let url = "";
    if (b.dataset.channel === "whatsapp") url = "https://wa.me/" + CONTACT.whatsapp + "?text=" + text;
    if (b.dataset.channel === "telegram") {
      navigator.clipboard?.writeText(compose()).catch(() => {});
      url = "https://t.me/" + CONTACT.telegram;
      msg.textContent = T.copied;
      msg.classList.add("show");
    }
    if (b.dataset.channel === "email") url = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(T.subject) + "&body=" + text;
    window.open(url, "_blank", "noopener");
  }));
  form.addEventListener("submit", e => e.preventDefault());
});
