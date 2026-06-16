/* Goli Gomitas — interacciones */
(function () {
  "use strict";

  /* ---------- Revelado suave al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Barra de compra sticky (mobile) ---------- */
  var buybar = document.querySelector("[data-buybar]");
  var anchor = document.querySelector("[data-buybar-trigger]");
  if (buybar && anchor && "IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        buybar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    io2.observe(anchor);
  }

  /* ---------- FAQ acordeón ---------- */
  var faqs = document.querySelectorAll("[data-faq] details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Año dinámico ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Ositos de goma cayendo (fondo de la home) ---------- */
  var bearLayer = document.querySelector("[data-bears]");
  if (bearLayer && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var bcolors = ["#D8232A", "#1F6FB2", "#6A4E9C", "#3F8F4E"];
    var bsvg = '<svg viewBox="0 0 40 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="11" cy="9" r="5"/><circle cx="29" cy="9" r="5"/><circle cx="20" cy="15" r="9.5"/>' +
      '<rect x="8" y="21" width="24" height="26" rx="12"/>' +
      '<circle cx="6" cy="28" r="5"/><circle cx="34" cy="28" r="5"/>' +
      '<circle cx="13" cy="46" r="5.5"/><circle cx="27" cy="46" r="5.5"/></svg>';
    var bn = window.innerWidth < 700 ? 12 : 22;
    for (var i = 0; i < bn; i++) {
      var bear = document.createElement("div");
      bear.className = "bear";
      var size = 18 + Math.random() * 26;
      var dur = 7 + Math.random() * 8;
      bear.style.left = (Math.random() * 100) + "%";
      bear.style.width = size + "px";
      bear.style.color = bcolors[i % 4];
      bear.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
      bear.style.animation = "bearfall " + dur.toFixed(2) + "s linear infinite";
      bear.style.animationDelay = (-Math.random() * dur).toFixed(2) + "s";
      bear.innerHTML = bsvg;
      bearLayer.appendChild(bear);
    }
  }

  /* ====================================================
     Carrito drawer
     ==================================================== */
  var drawer  = document.querySelector("[data-cart-drawer]");
  var overlay = document.querySelector("[data-cart-overlay]");
  if (!drawer || !overlay) return;

  var body      = drawer.querySelector("[data-cart-body]");
  var foot      = drawer.querySelector("[data-cart-foot]");
  var totalEl   = drawer.querySelector("[data-cart-total]");
  var countLbl  = drawer.querySelector("[data-cart-count-label]");
  var lastFocus = null;

  function clp(cents) { return "$" + Math.round(cents / 100).toLocaleString("es-CL"); }

  function setCount(n) {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = n; });
    if (countLbl) countLbl.textContent = n ? "(" + n + ")" : "";
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    overlay.classList.add("show");
    drawer.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    var c = drawer.querySelector("[data-cart-close]");
    if (c) c.focus();
  }
  function closeDrawer() {
    overlay.classList.remove("show");
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { overlay.hidden = true; }, 360);
    if (lastFocus) lastFocus.focus();
  }

  function render(cart) {
    setCount(cart.item_count);
    if (!cart.item_count) {
      body.innerHTML = '<p class="drawer__empty">Tu carro está vacío.<br><a href="/#oferta" style="color:var(--apple-dark);text-decoration:underline">Ver las gomitas</a></p>';
      if (foot) foot.hidden = true;
      return;
    }
    body.innerHTML = cart.items.map(function (it, i) {
      var img = it.image ? it.image.replace(/(\.[^.\/]+)(\?|$)/, "_120x$1$2") : "";
      var variant = (it.variant_title && it.variant_title.indexOf("Default") === -1) ? '<div class="drawer-item__variant">' + it.variant_title + "</div>" : "";
      return '' +
        '<div class="drawer-item" data-key="' + it.key + '" style="animation-delay:' + (i * 40) + 'ms">' +
          (img ? '<img src="' + img + '" alt="" loading="lazy">' : '<div class="drawer-item__img"></div>') +
          '<div class="drawer-item__info">' +
            '<div class="drawer-item__title">' + it.product_title + "</div>" +
            variant +
            '<div class="drawer-item__qty">' +
              '<button type="button" data-change="' + it.key + '" data-qty="' + (it.quantity - 1) + '" aria-label="Quitar uno">&#8722;</button>' +
              "<span>" + it.quantity + "</span>" +
              '<button type="button" data-change="' + it.key + '" data-qty="' + (it.quantity + 1) + '" aria-label="Agregar uno">&#43;</button>' +
            "</div>" +
          "</div>" +
          '<div class="drawer-item__price">' + clp(it.final_line_price) + "</div>" +
        "</div>";
    }).join("");
    if (totalEl) totalEl.textContent = clp(cart.total_price);
    if (foot) foot.hidden = false;
  }

  function refresh(open) {
    return fetch("/cart.js", { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { render(cart); if (open) openDrawer(); return cart; })
      .catch(function () {});
  }

  function changeQty(key, qty) {
    body.style.opacity = ".55";
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); })
      .then(function (cart) { render(cart); body.style.opacity = "1"; })
      .catch(function () { body.style.opacity = "1"; });
  }

  function addToCart(form) {
    var btn = form.querySelector('[type="submit"]');
    var label = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = "Agregando…"; }
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    }).then(function (r) { return r.json(); })
      .then(function () { return refresh(true); })
      .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } })
      .catch(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } form.submit(); });
  }

  /* Abrir carro */
  document.querySelectorAll("[data-cart-open]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); refresh(true); });
  });

  /* Cerrar */
  overlay.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("[data-cart-close]").forEach(function (b) { b.addEventListener("click", closeDrawer); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("show")) closeDrawer(); });

  /* Cambiar cantidad dentro del drawer */
  body.addEventListener("click", function (e) {
    var b = e.target.closest("[data-change]");
    if (b) changeQty(b.getAttribute("data-change"), parseInt(b.getAttribute("data-qty"), 10));
  });

  /* Interceptar formularios de agregar al carro */
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.matches && form.matches('form[action*="/cart/add"]')) {
      e.preventDefault();
      addToCart(form);
    }
  });
})();
