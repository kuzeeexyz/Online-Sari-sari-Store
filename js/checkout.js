/* ============================================================
   SariSari PH — Checkout Modal
   ------------------------------------------------------------
   Collects customer info + payment method, shows a live order
   summary (items, subtotal, shipping, grand total), and on
   submit generates a random Order ID, clears the cart and shows
   a thank-you confirmation screen.
   ============================================================ */
(function () {
  'use strict';

  const Store = window.Store;

  const SHIPPING_FLAT = 50;
  const FREE_THRESHOLD = 500;

  const ICON_BIG_CHECK =
    '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  const PAYMENT_OPTIONS = [
    { id: "COD", name: "Cash on Delivery", note: "Pay when your order arrives", badge: "Popular" },
    { id: "GCash", name: "GCash", note: "Pay via the GCash app", badge: "Digital" },
    { id: "Maya", name: "Maya", note: "Pay via the Maya app", badge: "Digital" }
  ];

  let selectedPayment = "COD";

  /* ---- Fee logic ---- */
  function getShipping(subtotal) {
    return subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
  }

  /* ---- Escapes user text before injecting into HTML ---- */
  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---- Build the checkout layout ---- */
  function buildCheckoutHTML() {
    const items = Store.cart.getItems();
    const subtotal = Store.cart.getSubtotal();
    const shipping = getShipping(subtotal);
    const total = subtotal + shipping;

    const itemRows = items
      .map(function (item) {
        return (
          '<div class="co-summary-item">' +
            "<span>" + escapeHTML(item.product.name) +
              ' <span class="qty-tag">× ' + item.qty + "</span></span>" +
            "<span>" + Store.formatPrice(item.product.price * item.qty) + "</span>" +
          "</div>"
        );
      })
      .join("");

    const payOptions = PAYMENT_OPTIONS
      .map(function (pay, index) {
        return (
          '<label class="pay-option' + (index === 0 ? " selected" : "") + '" data-pay="' + pay.id + '">' +
            '<span class="pay-radio"></span>' +
            '<span class="pay-logo">' + pay.name + "<small>" + pay.note + "</small></span>" +
            '<span class="pay-badge">' + pay.badge + "</span>" +
          "</label>"
        );
      })
      .join("");

    return (
      '<div class="co-header">' +
        "<h2>Checkout</h2>" +
        "<p>Just a few details and you're all set.</p>" +
      "</div>" +
      '<form id="checkoutForm" novalidate>' +

        '<div class="co-grid">' +

          /* ---- Customer information & payment ---- */
          '<div class="co-section">' +
            "<h3>Customer Information</h3>" +

            '<div class="form-group">' +
              '<label for="coName">Full Name</label>' +
              '<input type="text" id="coName" name="name" placeholder="Juan Dela Cruz" required>' +
              '<span class="form-error" data-for="coName"></span>' +
            "</div>" +

            '<div class="form-row">' +
              '<div class="form-group">' +
                '<label for="coPhone">Phone Number</label>' +
                '<input type="tel" id="coPhone" name="phone" placeholder="0912 345 6789" required>' +
                '<span class="form-error" data-for="coPhone"></span>' +
              "</div>" +
              '<div class="form-group">' +
                '<label for="coEmail">Email Address</label>' +
                '<input type="email" id="coEmail" name="email" placeholder="you@example.com" required>' +
                '<span class="form-error" data-for="coEmail"></span>' +
              "</div>" +
            "</div>" +

            '<div class="form-group">' +
              '<label for="coAddress">Complete Address</label>' +
              '<textarea id="coAddress" rows="3" placeholder="House no., street, barangay, city…" required></textarea>' +
              '<span class="form-error" data-for="coAddress"></span>' +
            "</div>" +

            "<h3>Payment Method</h3>" +
            '<div class="pay-methods">' + payOptions + "</div>" +
          "</div>" +

          /* ---- Order summary ---- */
          '<div class="co-section">' +
            "<h3>Order Summary</h3>" +
            '<div class="co-summary">' +
              itemRows +
              '<div class="co-summary-item"><span>Subtotal</span><span>' + Store.formatPrice(subtotal) + "</span></div>" +
              '<div class="co-summary-item"><span>Shipping fee</span><span>' +
                (shipping === 0 ? "Free" : Store.formatPrice(shipping)) + "</span></div>" +
              '<div class="co-summary-total"><span>Total</span><span class="amount">' +
                Store.formatPrice(total) + "</span></div>" +
            "</div>" +
          "</div>" +
        "</div>" +

        '<div class="co-place-row">' +
          '<p class="co-grand">Grand Total <span class="amount">' + Store.formatPrice(total) + "</span></p>" +
          '<button type="submit" class="btn btn-primary btn-lg">Place Order</button>' +
        "</div>" +
      "</form>"
    );
  }

  /* ---- Confirmation screen ---- */
  function renderSuccess(order) {
    const content = document.getElementById("checkoutContent");

    content.innerHTML =
      '<div class="co-success">' +
        '<div class="success-icon">' + ICON_BIG_CHECK + "</div>" +
        "<h2>Salamat, " + escapeHTML(order.name) + "!</h2>" +
        "<p>Your order has been placed and is being prepared.</p>" +
        '<span class="order-id">Order ID: ' + escapeHTML(order.id) + "</span>" +
        "<p>Payment: <strong>" + escapeHTML(order.payment) + "</strong> &nbsp;•&nbsp; " +
          "Grand Total: <strong>" + Store.formatPrice(order.total) + "</strong></p>" +
        '<button type="button" class="btn btn-primary" id="doneBtn">Continue Shopping</button>' +
      "</div>";
  }

  /* ---- Random order ID ---- */
  function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-5);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "SS-" + timestamp + "-" + random;
  }

  /* ---- Validation ---- */
  function setFieldError(input, message) {
    const errorEl = document.querySelector('.form-error[data-for="' + input.id + '"]');
    input.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  function validate(input, tester, message) {
    const valid = tester(input.value);
    setFieldError(input, valid ? "" : message);
    return valid;
  }

  function handleSubmit() {
    const name = document.getElementById("coName");
    const phone = document.getElementById("coPhone");
    const email = document.getElementById("coEmail");
    const address = document.getElementById("coAddress");

    let ok = true;

    ok = validate(name, function (v) {
      return v.trim().length >= 3;
    }, "Please enter your full name") && ok;

    ok = validate(phone, function (v) {
      return /^09\d{9}$/.test(v.replace(/[\s-]/g, ""));
    }, "Enter a valid PH number (09xxxxxxxxx)") && ok;

    ok = validate(email, function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }, "Enter a valid email address") && ok;

    ok = validate(address, function (v) {
      return v.trim().length >= 10;
    }, "Please enter your complete delivery address") && ok;

    if (!ok) {
      Store.toast("Please fix the highlighted fields", "error");
      return;
    }

    const subtotal = Store.cart.getSubtotal();
    const total = subtotal + getShipping(subtotal);

    renderSuccess({
      id: generateOrderId(),
      name: name.value.trim(),
      payment: selectedPayment,
      total: total
    });

    // Keep a happy toast and reset the cart
    Store.toast("Order placed successfully!");
    Store.cart.clear();
  }

  /* ============================================================
     BOOTSTRAP — listeners attached to the always-present overlay
     ============================================================ */
  function init() {
    const overlay = document.getElementById("checkoutOverlay");
    if (!overlay) return;

    const content = document.getElementById("checkoutContent");
    const closeBtn = document.getElementById("checkoutClose");

    function show() {
      content.innerHTML = buildCheckoutHTML();
      selectedPayment = "COD";
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function hide() {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    Store.openCheckout = function () {
      if (Store.cart.isEmpty()) {
        Store.toast("Your cart is empty", "error");
        return;
      }
      show();
    };
    Store.closeCheckout = hide;

    closeBtn && closeBtn.addEventListener("click", hide);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) hide();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });

    /* Payment option selection (delegated) */
    overlay.addEventListener("click", function (e) {
      const option = e.target.closest("[data-pay]");
      if (option) {
        selectedPayment = option.dataset.pay;
        overlay.querySelectorAll("[data-pay]").forEach(function (el) {
          el.classList.toggle("selected", el.dataset.pay === selectedPayment);
        });
      }

      if (e.target.closest("#doneBtn")) hide();
    });

    /* Form submit (delegated — form is built dynamically) */
    overlay.addEventListener("submit", function (e) {
      if (e.target.id === "checkoutForm") {
        e.preventDefault();
        handleSubmit();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();