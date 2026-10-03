/* ============================================================
   SariSari PH — Main Application
   ------------------------------------------------------------
   Renders all dynamic UI (products, categories, highlights,
   testimonials, teams, etc.) from JS data, and wires up global
   behaviour: navbar, loader, toasts, scroll reveal, back-to-top
   and the contact form.
   ============================================================ */
(function () {
  'use strict';

  const Store = window.Store;

  /* ---- Tiny DOM helpers ---- */
  const $ = function (selector, ctx) {
    return (ctx || document).querySelector(selector);
  };
  const $$ = function (selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  };

  /* ---- Shared formatting (used by cart.js & checkout.js too) ---- */
  Store.formatPrice = function (n) {
    return "₱" + Number(n).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  /* ============================================================
     TOAST NOTIFICATIONS
     ============================================================ */
  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  const ICON_ALERT =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';

  Store.toast = function (message, type) {
    type = type || "success";
    const container = $("#toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML =
      '<span class="toast-icon">' + (type === "error" ? ICON_ALERT : ICON_CHECK) + "</span>" +
      "<span>" + message + "</span>";

    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("hide");
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, 2800);
  };

  /* ============================================================
     LOADING OVERLAY
     ============================================================ */
  function hideLoader() {
    const loader = $("#loader");
    if (!loader) return;

    const done = function () {
      loader.classList.add("done");
    };

    if (document.readyState === "complete") {
      setTimeout(done, 500);
    } else {
      window.addEventListener("load", function () {
        setTimeout(done, 500);
      });
    }
    setTimeout(done, 2500); // safety net
  }

  /* ============================================================
     NAVBAR — hamburger, active link, scroll shadow
     ============================================================ */
  function initNavbar() {
    const current = location.pathname.split("/").pop() || "index.html";

    // Highlight the link matching the current page
    $$(".nav-link").forEach(function (link) {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });

    const navbar = $("#navbar");
    const burger = $("#hamburger");
    const menu = $("#navMenu");
    if (!burger || !menu) return;

    const setMenu = function (open) {
      menu.classList.toggle("open", open);
      burger.classList.toggle("active", open);
      burger.setAttribute("aria-expanded", String(open));
    };

    burger.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });

    // Close the menu after tapping a link
    $$(".nav-link", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    // Close when clicking outside the menu / burger
    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("open") &&
        !menu.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    // Close with the Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    // Shadow once the page is scrolled
    const onScroll = function () {
      navbar.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ============================================================
     BACK-TO-TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     SCROLL-REVEAL — fade sections in as they enter the viewport
     ============================================================ */
  function initReveal() {
    const elements = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     PRODUCT CARD — template + grid behaviour
     ============================================================ */
  const ICON_CART_SMALL =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';

  function productCard(product) {
    const soldOut = product.stock <= 0;

    return (
      '<article class="product-card' + (soldOut ? " out-of-stock" : "") + '" data-id="' + product.id + '">' +
        '<div class="product-image" style="background:' + product.bg + '">' +
          '<span class="p-stock ' + (soldOut ? "out" : "in") + '">' +
            (soldOut ? "Out of stock" : "In stock") +
          "</span>" +
          Store.ICONS[product.icon] +
        "</div>" +
        '<div class="product-body">' +
          '<span class="p-category">' + product.category + "</span>" +
          '<h3 class="product-name">' + product.name + "</h3>" +
          '<div class="product-price">' +
            '<span class="price">' + Store.formatPrice(product.price) + "</span>" +
            '<span class="price-unit">' + product.unit + "</span>" +
          "</div>" +
          '<p class="product-desc">' + product.description + "</p>" +
          '<div class="product-qty">' +
            '<span class="stock-left">' + product.stock + " left</span>" +
            '<div class="qty">' +
              '<button type="button" class="qty-btn" data-qty="dec" aria-label="Decrease quantity">−</button>' +
              '<input type="number" class="qty-input" value="1" min="1" max="' + product.stock + '" aria-label="Quantity">' +
              '<button type="button" class="qty-btn" data-qty="inc" aria-label="Increase quantity">+</button>' +
            "</div>" +
          "</div>" +
          '<button type="button" class="add-to-cart"' + (soldOut ? " disabled" : "") + ">" +
            ICON_CART_SMALL + "Add to Cart" +
          "</button>" +
        "</div>" +
      "</article>"
    );
  }

  /* Wire up quantity steppers and Add-to-Cart via event delegation */
  function bindProductGrid(grid) {
    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const input = card.querySelector(".qty-input");

      // Quantity steppers
      if (e.target.closest("[data-qty]")) {
        let value = parseInt(input.value, 10) || 1;
        const max = parseInt(input.max, 10) || 1;
        value += e.target.closest('[data-qty="dec"]') ? -1 : 1;
        input.value = Math.min(Math.max(value, 1), max);
        return;
      }

      // Add to cart
      if (e.target.closest(".add-to-cart")) {
        const productId = Number(card.dataset.id);
        const qty = parseInt(input.value, 10) || 1;
        const product = Store.getProduct(productId);

        if (Store.cart.add(productId, qty)) {
          Store.toast("Added to cart — " + product.name);
        } else {
          Store.toast("Sorry, that item is unavailable", "error");
        }
      }
    });

    // Clamp manual typing inside 1..stock
    grid.addEventListener("input", function (e) {
      if (!e.target.matches(".qty-input")) return;
      const max = parseInt(e.target.max, 10) || 1;
      let value = parseInt(e.target.value, 10);
      if (Number.isNaN(value) || value < 1) e.target.value = 1;
      else if (value > max) e.target.value = max;
    });
  }

  /* ============================================================
     HOME PAGE
     ============================================================ */
  function initHome() {
    renderHeroVisual();
    renderHighlights();
    renderFeatured();
    renderCategories();
    renderTestimonials();
  }

  /* Floating icon collage behind the hero copy */
  function renderHeroVisual() {
    const el = $("#heroVisual");
    if (!el) return;

    const picks = [
      { cls: "hv-tile--big", category: "Grains & Rice" },
      { cls: "hv-tile--s1", category: "Beverages" },
      { cls: "hv-tile--s2", category: "Snacks & Biscuits" },
      { cls: "hv-tile--s3", category: "Instant Noodles" },
      { cls: "hv-tile--s4", category: "Canned Goods" }
    ];

    el.innerHTML = picks
      .map(function (pick) {
        const meta = Store.getCategoryMeta(pick.category);
        return (
          '<div class="hv-tile ' + pick.cls + '" style="background:' + meta.bg + '">' +
          meta.icon +
          "</div>"
        );
      })
      .join("");
  }

  /* Store highlights */
  function renderHighlights() {
    const grid = $("#highlightsGrid");
    if (!grid) return;

    const highlights = [
      {
        icon: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
        title: "Fast Delivery",
        text: "Same-day delivery within the barangay, order before 5 PM."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 12 22l-8-8V4h10l6.6 9.4z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>',
        title: "Affordable Prices",
        text: "Sukli-friendly pricing and sachet sizes for everyday budgets."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 5-8 16-9-1 11-4 16-9 16z"/><path d="M4 21c4-5 8-9 13-13"/></svg>',
        title: "Fresh & Quality",
        text: "Bread, eggs and produce are restocked fresh every single day."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/></svg>',
        title: "Friendly Service",
        text: "Your kapitbahay is our suki — we greet everyone with a smile."
      }
    ];

    grid.innerHTML = highlights
      .map(function (h) {
        return (
          '<div class="highlight-card reveal">' +
            '<div class="highlight-icon">' + h.icon + "</div>" +
            "<h3>" + h.title + "</h3>" +
            "<p>" + h.text + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  /* Featured products */
  function renderFeatured() {
    const grid = $("#featuredGrid");
    if (!grid) return;

    grid.innerHTML = Store.getFeatured(8).map(productCard).join("");
    bindProductGrid(grid);
  }

  /* Category cards (link to the filtered shop page) */
  function renderCategories() {
    const grid = $("#categoryGrid");
    if (!grid) return;

    grid.innerHTML = Store.categories
      .map(function (category) {
        const meta = Store.getCategoryMeta(category);
        const count = Store.products.filter(function (p) {
          return p.category === category;
        }).length;
        const href = "shop.html?cat=" + encodeURIComponent(category);
        return (
          '<a class="category-card reveal" href="' + href + '">' +
            '<div class="category-tile" style="background:' + meta.bg + '">' + meta.icon + "</div>" +
            '<span class="category-name">' + category + "</span>" +
            '<span class="category-count">' + count + " products</span>" +
          "</a>"
        );
      })
      .join("");
  }

  /* Customer testimonials */
  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    if (!grid) return;

    const testimonials = [
      {
        quote:
          "Super convenient! I order pandesal and eggs in the morning, and it's at my door before my anak wakes up.",
        name: "Maria Santos",
        role: "Loyal suki since 2019",
        initials: "MS",
        color: "linear-gradient(135deg, #f97316, #f59e0b)"
      },
      {
        quote:
          "The prices are honest and the delivery riders are always respectful. Mas okay pa kesa sa mall!",
        name: "Joselito Ramos",
        role: "Neighborhood resident",
        initials: "JR",
        color: "linear-gradient(135deg, #3b82f6, #06b6d4)"
      },
      {
        quote:
          "I run a small eatery and SariSari PH delivers my cooking oil and seasonings in bulk. Never late.",
        name: "Lorna Bautista",
        role: "Eatery owner",
        initials: "LB",
        color: "linear-gradient(135deg, #16a34a, #65a30d)"
      },
      {
        quote:
          "Aling Nena remembers my order from last week. That personal touch is why I keep coming back.",
        name: "Paolo Mendoza",
        role: "Student",
        initials: "PM",
        color: "linear-gradient(135deg, #a855f7, #ec4899)"
      }
    ];

    const stars = '<span class="t-stars" aria-label="5 out of 5 stars">★★★★★</span>';

    grid.innerHTML = testimonials
      .map(function (t) {
        return (
          '<div class="testimonial-card reveal">' +
            stars +
            '<p class="t-quote">"' + t.quote + '"</p>' +
            '<div class="t-author">' +
              '<span class="t-avatar" style="background:' + t.color + '">' + t.initials + "</span>" +
              "<div><strong>" + t.name + "</strong><span>" + t.role + "</span></div>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ============================================================
     SHOP PAGE — search, filter, sort, render
     ============================================================ */
  function initShop() {
    const grid = $("#productGrid");
    const chipsWrap = $("#filterChips");
    const search = $("#searchInput");
    const sort = $("#sortSelect");
    const countEl = $("#resultsCount");
    const emptyEl = $("#emptyState");
    const clearBtn = $("#clearFiltersBtn");
    if (!grid) return;

    // Pre-select a category when arriving from a category card
    const categoryParam = new URLSearchParams(location.search).get("cat");
    let activeCategory = Store.categories.includes(categoryParam) ? categoryParam : "all";
    let query = "";

    /* Build the chip row from the product categories */
    function buildChips() {
      const chips = ["all"].concat(Store.categories);
      chipsWrap.innerHTML = chips
        .map(function (c) {
          return (
            '<button type="button" class="chip' + (c === activeCategory ? " active" : "") +
            '" data-cat="' + c + '">' + (c === "all" ? "All" : c) + "</button>"
          );
        })
        .join("");
    }

    function getFiltered() {
      const q = query.toLowerCase();

      const list = Store.products.filter(function (p) {
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        const matchesQuery = !q || (p.name + " " + p.category).toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });

      switch (sort.value) {
        case "price-asc":
          list.sort(function (a, b) { return a.price - b.price; });
          break;
        case "price-desc":
          list.sort(function (a, b) { return b.price - a.price; });
          break;
        case "name-asc":
          list.sort(function (a, b) { return a.name.localeCompare(b.name); });
          break;
        case "name-desc":
          list.sort(function (a, b) { return b.name.localeCompare(a.name); });
          break;
        default:
          list.sort(function (a, b) { return a.id - b.id; });
      }
      return list;
    }

    function render() {
      const list = getFiltered();
      grid.innerHTML = list.map(productCard).join("");
      bindProductGrid(grid);

      emptyEl.hidden = list.length > 0;
      countEl.textContent =
        list.length + " product" + (list.length === 1 ? "" : "s") + " found";
    }

    function updateChips() {
      $$(".chip", chipsWrap).forEach(function (chip) {
        chip.classList.toggle("active", chip.dataset.cat === activeCategory);
      });
    }

    /* ---- Events ---- */
    search.addEventListener("input", function () {
      query = search.value.trim();
      render();
    });

    sort.addEventListener("change", render);

    chipsWrap.addEventListener("click", function (e) {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      activeCategory = chip.dataset.cat;
      updateChips();
      render();
    });

    clearBtn.addEventListener("click", function () {
      activeCategory = "all";
      query = "";
      search.value = "";
      sort.value = "featured";
      updateChips();
      render();
    });

    /* ---- Initial render ---- */
    buildChips();
    render();
  }

  /* ============================================================
     ABOUT PAGE — core values & team
     ============================================================ */
  function initAbout() {
    renderValues();
    renderTeam();
  }

  function renderValues() {
    const grid = $("#valuesGrid");
    if (!grid) return;

    const values = [
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>',
        title: "Service with a Smile",
        text: "Every customer is treated like family — with patience and a warm welcome."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        title: "Trust & Honesty",
        text: "Fair weighing, fair prices, and never a stale item sold on purpose."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/></svg>',
        title: "Suki Forever",
        text: "We value long-term relationships over one-time sales, every time."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 5-8 16-9-1 11-4 16-9 16z"/><path d="M4 21c4-5 8-9 13-13"/></svg>',
        title: "Fresh & Quality",
        text: "We only sell what we'd serve to our own family at home."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        title: "Community First",
        text: "We hire local, support local suppliers, and give back to the barangay."
      },
      {
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 12 22l-8-8V4h10l6.6 9.4z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>',
        title: "Sukli-Friendly",
        text: "Small portions, clear pricing, and always giving back the right change."
      }
    ];

    grid.innerHTML = values
      .map(function (v) {
        return (
          '<div class="value-card reveal">' +
            '<div class="value-icon">' + v.icon + "</div>" +
            "<h3>" + v.title + "</h3>" +
            "<p>" + v.text + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderTeam() {
    const grid = $("#teamGrid");
    if (!grid) return;

    const team = [
      {
        name: "Aling Nena Reyes",
        role: "Founder & Owner",
        bio: "Started the store in 1998 with a small counter and a big heart. She still greets every suki by name.",
        initials: "NR",
        color: "linear-gradient(135deg, #f97316, #f59e0b)"
      },
      {
        name: "Rico Reyes",
        role: "Delivery Rider",
        bio: "The fastest rider in the barangay. If your order is late, it's probably because he helped someone carry groceries.",
        initials: "RR",
        color: "linear-gradient(135deg, #3b82f6, #06b6d4)"
      },
      {
        name: "Ana Reyes",
        role: "Cashier & Inventory",
        bio: "Keeps the shelves stocked and the numbers straight. She can tell you the price of anything from memory.",
        initials: "AR",
        color: "linear-gradient(135deg, #16a34a, #65a30d)"
      }
    ];

    grid.innerHTML = team
      .map(function (m) {
        return (
          '<div class="team-card reveal">' +
            '<div class="team-avatar" style="background:' + m.color + '">' + m.initials + "</div>" +
            "<h3>" + m.name + "</h3>" +
            '<span class="team-role">' + m.role + "</span>" +
            "<p>" + m.bio + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ============================================================
     CONTACT PAGE — form validation
     ============================================================ */
  function validateField(input, isValid, message) {
    const errorEl = document.querySelector('.form-error[data-for="' + input.id + '"]');
    const valid = isValid(input.value);

    input.classList.toggle("invalid", !valid);
    if (errorEl) errorEl.textContent = valid ? "" : message;
    return valid;
  }

  function initContact() {
    const form = $("#contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = $("#contactName");
      const email = $("#contactEmail");
      const phone = $("#contactPhone");
      const subject = $("#contactSubject");
      const message = $("#contactMessage");

      let ok = true;

      ok = validateField(name, function (v) {
        return v.trim().length >= 3;
      }, "Please enter your full name") && ok;

      ok = validateField(email, function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      }, "Please enter a valid email address") && ok;

      ok = validateField(phone, function (v) {
        return /^09\d{9}$/.test(v.replace(/[\s-]/g, ""));
      }, "Enter a valid PH number (09xxxxxxxxx)") && ok;

      ok = validateField(subject, function (v) {
        return v.trim().length >= 3;
      }, "Please add a short subject") && ok;

      ok = validateField(message, function (v) {
        return v.trim().length >= 10;
      }, "Your message should be at least 10 characters") && ok;

      if (!ok) {
        Store.toast("Please fix the highlighted fields", "error");
        return;
      }

      form.reset();
      Store.toast("Message sent! Salamat po, we'll reply soon.");
    });

    // Clear an error as soon as the user starts fixing a field
    $$("#contactForm input, #contactForm textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.classList.contains("invalid")) {
          validateField(field, function () { return true; }, "");
        }
      });
    });
  }

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  function init() {
    hideLoader();
    initNavbar();
    initBackToTop();
    initReveal();

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "about") initAbout();
    if (page === "contact") initContact();

    // Sync the cart badge/drawer once, in case the cart is non-empty
    if (typeof Store.cart === "object" && typeof Store.cart.render === "function") {
      Store.cart.render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
