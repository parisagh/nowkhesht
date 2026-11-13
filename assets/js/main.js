// ====== تنظیمات راه تماس: فقط این سه خط را پر کن ======
const CONTACT = {
  whatsapp: "989015089646",   // شماره با کد کشور و بدون صفر و + ، مثلاً 989141234567
  telegram: "",   // نام کاربری تلگرام بدون @ ، مثلاً nowkhesht
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

  const y = document.getElementById("year");
  if (y) y.textContent = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());

  const form = document.getElementById("consult-form");
  if (!form) return;
  const msg = document.getElementById("form-msg");
  const buttons = form.querySelectorAll("[data-channel]");
  buttons.forEach(b => { if (!CONTACT[b.dataset.channel]) b.hidden = true; });
  if (![...buttons].some(b => !b.hidden)) {
    msg.textContent = "راه‌های تماس به‌زودی اضافه می‌شوند.";
    msg.classList.add("show");
  }

  const compose = () => {
    const d = new FormData(form);
    return [
      "درخواست مشاوره از سایت نوخشت",
      "نام: " + (d.get("name") || ""),
      "تلفن: " + (d.get("phone") || ""),
      "نوع ساختمان: " + (d.get("type") || ""),
      "سال ساخت تقریبی: " + (d.get("year") || ""),
      "موضوع: " + (d.get("topic") || ""),
      "توضیح: " + (d.get("details") || "")
    ].join("\n");
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
      msg.textContent = "متن درخواست کپی شد. در تلگرام آن را بچسبانید و بفرستید.";
      msg.classList.add("show");
    }
    if (b.dataset.channel === "email") url = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("درخواست مشاوره") + "&body=" + text;
    window.open(url, "_blank", "noopener");
  }));
  form.addEventListener("submit", e => e.preventDefault());
});
