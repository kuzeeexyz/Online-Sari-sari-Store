/* ============================================================
   SariSari PH — Shopping Cart
   ------------------------------------------------------------
   State stored in localStorage so the cart survives a refresh.
   Handles add / remove / quantity updates, the cart drawer UI
   (open, close, line items) and the navbar badge counter.
   ============================================================ */
(function () {
  'use strict';

  const Store = window.Store;
  const STORAGE_KEY = "sarisari-cart";

  const ICON_BAG =
    '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

  /* ---- Persisted cart state ---- */
  let items = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ---- Lookup helpers ---- */
  function indexOf(productId) {
    return items.findIndex(function (item) {
      return item.productId === Number(productId);
    });
  }

  function getQtyOf(productId) {
    const index = indexOf(productId);
    return index > -1 ? items[index].qty : 0;
  }

  /* ---- Cart operations ---- */
  function add(productId, qty) {
    const product = Store.getProduct(productId);
    qty = Math.max(1, Number(qty) || 1);

    if (!product || product.stock <= 0) return false;

    const index = indexOf(productId);
    const newQty = index > -1 ? items[index].qty + qty : qty;

    if (index > -1) {
      items[index].qty = Math.min(newQty, product.stock);
    } else {
      items.push({ productId: product.id, qty: Math.min(newQty, product.stock) });
    }

    save();
    render();
    return true;
  }

  function setQty(productId, qty) {
    const index = indexOf(productId);
    if (index === -1) return;

    qty = Math.max(1, Number(qty) || 1);
    const product = Store.getProduct(productId);
    if (product) qty = Math.min(qty, product.stock);

    items[index].qty = qty;
    save();
    render();
  }

  function remove(productId) {
    items = items.filter(function (item) {
      return item.productId !== Number(productId);
    });
    save();
    render();
  }

  function clear() {
    items = [];
    save();
    render();
  }

  function getCount() {
    return items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function getSubtotal() {
    return items.reduce(function (sum, item) {
      const product = Store.getProduct(item.productId);
      return product ? sum + product.price * item.qty : sum;
    }, 0);
  }

  function isEmpty() {
    return items.length === 0;
  }

  /* Rich item list: each row includes its full product object */
  function getItems() {
    return items
      .map(function (item) {
        const product = Store.getProduct(item.productId);
        return product ? { product: product, qty: item.qty } : null;
      })
      .filter(Boolean);
  }

  /* ---- Public API ---- */
  Store.cart = {
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    getCount: getCount,
    getQty: getQtyOf,
    getSubtotal: getSubtotal,
    getItems: getItems,
    isEmpty: isEmpty,
    render: render
  };

  /* ============================================================
     RENDERING
     ============================================================ */

  /* Refresh the header badge and the drawer every time state changes */
  function render() {
    renderBadge();
    renderDrawer();
  }

  function renderBadge() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;

    badge.textContent = String(getCount());

    // Small "pop" animation on every change
    badge.classList.remove("pop");
    void badge.offsetWidth; // restart the animation
    badge.classList.add("pop");
  }

  /* A single cart line item */
  function lineTemplate(item) {
    const p = item.product;

    return (
      '<div class="drawer-item" data-id="' + p.id + '">' +
        '<div class="di-img" style="background:' + p.bg + '">' +
          Store.ICONS[p.icon] +
        "</div>" +
        '<div class="di-info">' +
          '<p class="di-name">' + p.name + "</p>" +
          '<span class="di-price">' + Store.formatPrice(p.price * item.qty) + "</span>" +
          '<div class="di-controls">' +
            '<div class="di-qty">' +
              '<button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>' +
              '<input type="number" class="qty-input" value="' + item.qty + '" min="1" max="' + p.stock +
                '" data-id="' + p.id + '" aria-label="Quantity">' +
              '<button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>' +
            "</div>" +
            '<button type="button" class="di-remove" data-action="remove" aria-label="Remove item">Remove</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderDrawer() {
    const container = document.getElementById("cartItems");
    const footer = document.getElementById("cartFooter");
    if (!container || !footer) return;

    /* ---- Empty cart ---- */
    if (isEmpty()) {
      container.innerHTML =
        '<div class="di-empty">' +
          '<div class="empty-icon">' + ICON_BAG + "</div>" +
          "<h4>Your cart is empty</h4>" +
          "<p>Browse the store and add something you'll love.</p>" +
        "</div>";

      footer.innerHTML =
        '<div class="drawer-actions">' +
          '<a href="shop.html" class="btn btn-primary">Browse Shop</a>' +
        "</div>";
      return;
    }

    /* ---- Filled cart ---- */
    const subtotal = getSubtotal();

    container.innerHTML = getItems()
      .map(function (item) {
        return lineTemplate(item);
      })
      .join("");

    footer.innerHTML =
      '<div class="cart-total-row"><span>Subtotal</span><strong>' +
        Store.formatPrice(subtotal) + "</strong></div>" +
      '<div class="cart-total-row grand"><span>Total</span><span class="amount">' +
        Store.formatPrice(subtotal) + "</span></div>" +
      '<p class="drawer-note">Shipping fee is calculated at checkout.</p>' +
      '<div class="drawer-actions">' +
        '<button type="button" class="btn btn-primary" id="checkoutBtn">Proceed to Checkout</button>' +
        '<button type="button" class="btn btn-outline" id="clearCartBtn">Empty Cart</button>' +
      "</div>";
  }

  /* ============================================================
     DRAWER BEHAVIOUR
     ============================================================ */
  function initCartUI() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;

    const overlay = document.getElementById("drawerOverlay");
    const cartBtn = document.getElementById("cartBtn");
    const closeBtn = document.getElementById("cartClose");

    function open() {
      drawer.classList.add("open");
      overlay.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    Store.openCart = open;

    /* Open / close triggers */
    cartBtn && cartBtn.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    overlay && overlay.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    /* Quantity and remove actions inside the drawer */
    drawer.addEventListener("click", function (e) {
      const button = e.target.closest("[data-action]");
      if (!button) return;

      const row = button.closest(".drawer-item");
      if (!row) return;
      const id = row.dataset.id;

      if (button.dataset.action === "inc") {
        setQty(id, getQtyOf(id) + 1);
      } else if (button.dataset.action === "dec") {
        if (getQtyOf(id) === 1) {
          remove(id);
          Store.toast("Removed from cart");
        } else {
          setQty(id, getQtyOf(id) - 1);
        }
      } else if (button.dataset.action === "remove") {
        remove(id);
        Store.toast("Removed from cart");
      }
    });

    /* Manual quantity input (committed on blur/enter) */
    drawer.addEventListener("change", function (e) {
      if (e.target.matches(".di-qty .qty-input")) {
        const id = e.target.dataset.id;
        const value = parseInt(e.target.value, 10);
        if (Number.isNaN(value) || value < 1) {
          setQty(id, 1);
        } else {
          setQty(id, value);
        }
      }
    });

    /* Checkout + clear buttons live in the dynamically built footer */
    document.addEventListener("click", function (e) {
      if (e.target.closest("#checkoutBtn")) {
        close();
        if (typeof Store.openCheckout === "function") Store.openCheckout();
      } else if (e.target.closest("#clearCartBtn")) {
        clear();
        Store.toast("Cart cleared");
      }
    });
  }

  /* ---- Boot ---- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartUI);
  } else {
    initCartUI();
  }
})();