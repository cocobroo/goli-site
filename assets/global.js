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

  /* ---------- Selector de packs ---------- */
  function syncPackSelection(input) {
    var group = input.closest(".packs");
    if (!group) return;
    group.querySelectorAll(".pack").forEach(function (pack) {
      var radio = pack.querySelector('input[type="radio"]');
      pack.classList.toggle("is-selected", !!radio && radio.checked);
    });
  }
  document.querySelectorAll('.pack input[type="radio"]').forEach(function (input) {
    syncPackSelection(input);
    input.addEventListener("change", function () { syncPackSelection(input); });
  });

  /* ---------- Ositos de goma cayendo (fondo de la home) ---------- */
  var bearLayer = document.querySelector("[data-bears]");
  if (bearLayer) {
    var bcolors = ["#D8232A", "#1F6FB2", "#6A4E9C", "#3F8F4E"];
    var bsvg = '<svg viewBox="0 0 80 98" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path fill="currentColor" d="M25.2 14.9C20.8 6.2 9.3 8.4 8.3 18c-.5 4.5 1.6 8.1 5.4 10.1-3.8 5.2-5.3 12-3.4 19.1C4.7 50.5 2.5 58.5 7 64.1c3.5 4.4 9.3 4.7 13.6 1.8.8 7.9 4.9 15.1 10.9 18.8-2.5 5.3.8 11.3 6.7 11.9 6.4.6 10.7-4.7 9.2-10.5 6.7-3.4 11.4-10.8 12.4-19.7 4.3 2.5 9.8 1.9 13.1-2.3 4.5-5.6 2.3-13.6-3.3-16.9 1.9-7.2.4-14-3.5-19.2 3.8-2.1 5.9-5.7 5.4-10.2-1-9.5-12.4-11.7-16.8-3.1-8.1-3.7-21.4-3.7-29.5.2Z"/>' +
      '<path fill="#fff" opacity=".26" d="M18 31.8c6.1-10.2 20.6-13.1 29.8-10.6-11.1.4-20.4 4.5-25.3 12.2-2.2 3.5-7.1 2.1-4.5-1.6Z"/>' +
      '<ellipse cx="21.8" cy="52.5" rx="7.8" ry="10.8" fill="#fff" opacity=".16" transform="rotate(-24 21.8 52.5)"/>' +
      '<ellipse cx="55.5" cy="51" rx="6.6" ry="9.8" fill="#fff" opacity=".13" transform="rotate(24 55.5 51)"/>' +
      '<ellipse cx="29" cy="75" rx="7.5" ry="4.5" fill="#fff" opacity=".15" transform="rotate(-10 29 75)"/>' +
      '</svg>';
    var bn = window.innerWidth < 700 ? 10 : 18;
    for (var i = 0; i < bn; i++) {
      var bear = document.createElement("div");
      bear.className = "bear";
      var size = 22 + Math.random() * 30;
      var dur = 8 + Math.random() * 10;
      bear.style.left = (Math.random() * 100) + "%";
      bear.style.width = size + "px";
      bear.style.color = bcolors[i % 4];
      bear.style.opacity = (0.22 + Math.random() * 0.22).toFixed(2);
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
      body.innerHTML = '<p class="drawer__empty">Tu carro está vacío.<br><a href="/collections/sabores" style="color:var(--ink);text-decoration:underline">Ver las gomitas</a></p>';
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
