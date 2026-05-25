const apiUrl = "/api/v1/products";

let allProducts     = [];
let filteredProducts = [];
let activeCategory  = "all";
let cart            = [];
let pendingDeleteId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  injectSidebarOverlay();
});

async function loadProducts() {
  showLoading(true);
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allProducts = await res.json();
    rebuildCategoryChips();
    applyFilters();
  } catch (err) {
    showToast("Failed to load products. Is the server running?", "error");
    console.error(err);
    showLoading(false);
    showEmpty(true);
  }
}

async function createProduct() {
  const body = collectFormData();
  if (!body) return;

  setSubmitLoading(true);
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await loadProducts();
    closeModalDirect();
    showToast("Product added successfully!", "success");
  } catch (err) {
    showToast("Failed to create product.", "error");
    console.error(err);
  } finally {
    setSubmitLoading(false);
  }
}

async function updateProduct(id) {
  const body = collectFormData();
  if (!body) return;

  setSubmitLoading(true);
  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await loadProducts();
    closeModalDirect();
    showToast("Product updated successfully!", "success");
  } catch (err) {
    showToast("Failed to update product.", "error");
    console.error(err);
  } finally {
    setSubmitLoading(false);
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    cart = cart.filter(c => c.id !== id);
    updateCartUI();
    await loadProducts();
    showToast("Product deleted.", "info");
  } catch (err) {
    showToast("Failed to delete product.", "error");
    console.error(err);
  } finally {
    closeConfirm();
  }
}

function openAddModal() {
  document.getElementById("modalTitle").textContent   = "Add Product";
  document.getElementById("modalSubmitBtn").textContent = "Add Product";
  document.getElementById("editProductId").value      = "";
  clearForm();
  openModal("modalOverlay");
}

function openEditModal(product) {
  document.getElementById("modalTitle").textContent   = "Edit Product";
  document.getElementById("modalSubmitBtn").textContent = "Save Changes";
  document.getElementById("editProductId").value      = product.id;
  document.getElementById("inputName").value          = product.name      || "";
  document.getElementById("inputPrice").value         = product.price     ?? "";
  document.getElementById("inputCategory").value      = product.category  || "";
  document.getElementById("inputImageUrl").value      = product.imageUrl  || "";
  previewImage();
  openModal("modalOverlay");
}

function submitModal() {
  const id = document.getElementById("editProductId").value;
  if (id) {
    updateProduct(Number(id));
  } else {
    createProduct();
  }
}

function collectFormData() {
  const name     = document.getElementById("inputName").value.trim();
  const price    = parseFloat(document.getElementById("inputPrice").value);
  const category = document.getElementById("inputCategory").value.trim();
  const imageUrl = document.getElementById("inputImageUrl").value.trim();

  if (!name) { showToast("Product name is required.", "error"); return null; }
  if (isNaN(price) || price < 0) { showToast("Enter a valid price.", "error"); return null; }
  if (!category) { showToast("Category is required.", "error"); return null; }

  return { name, price, category, imageUrl };
}

function clearForm() {
  ["inputName","inputPrice","inputCategory","inputImageUrl"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("previewPlaceholder").style.display = "";
}

function previewImage() {
  const url = document.getElementById("inputImageUrl").value.trim();
  const img = document.getElementById("imagePreview");
  const ph  = document.getElementById("previewPlaceholder");
  if (url) {
    img.src = url;
    img.style.display = "block";
    ph.style.display  = "none";
    img.onerror = () => {
      img.style.display = "none";
      ph.style.display  = "";
    };
  } else {
    img.style.display = "none";
    ph.style.display  = "";
  }
}

function openConfirmDelete(id, name) {
  pendingDeleteId = id;
  document.getElementById("confirmProductName").textContent = name;
  document.getElementById("confirmDeleteBtn").onclick = () => deleteProduct(id);
  openModal("confirmOverlay");
}

function closeConfirm() {
  pendingDeleteId = null;
  closeOverlay("confirmOverlay");
}

function renderCards(products) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  if (products.length === 0) {
    showEmpty(true);
    showLoading(false);
    return;
  }

  showEmpty(false);
  showLoading(false);

  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${escapeHtml(p.imageUrl || "")}"
          alt="${escapeHtml(p.name)}"
          onerror="this.src='https://placehold.co/400x260/e8e4dc/9e9b94?text=No+Image'"
          loading="lazy"
        />
        <span class="product-category-badge">${escapeHtml(p.category || "")}</span>
        <div class="add-to-cart-overlay">
          <button class="cart-add-btn" onclick="addToCart(${p.id})" title="Add to cart">
            Add to Cart
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</div>
        <div class="product-price">$${formatPrice(p.price)}</div>
        <div class="product-actions">
          <button class="btn-edit" onclick="openEditModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">Edit</button>
          <button class="btn-delete" onclick="openConfirmDelete(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterProducts() {
  applyFilters();
  const q = document.getElementById("searchInput").value;
  const btn = document.getElementById("clearSearch");
  btn.classList.toggle("visible", q.length > 0);
}

function applyFilters() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();

  filteredProducts = allProducts.filter(p => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q);
    const matchesCat    = activeCategory === "all" || (p.category || "").toLowerCase() === activeCategory;
    return matchesSearch && matchesCat;
  });

  renderCards(filteredProducts);
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("clearSearch").classList.remove("visible");
  applyFilters();
}

function selectCategory(el, cat) {
  activeCategory = cat;
  document.querySelectorAll(".cat-chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  applyFilters();
}

function rebuildCategoryChips() {
  const container = document.getElementById("categoryFilters");

  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

  container.innerHTML = `<button class="cat-chip ${activeCategory === "all" ? "active" : ""}" data-cat="all" onclick="selectCategory(this, 'all')">All</button>`;
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `cat-chip${activeCategory === cat.toLowerCase() ? " active" : ""}`;
    btn.dataset.cat = cat.toLowerCase();
    btn.textContent = cat;
    btn.setAttribute("onclick", `selectCategory(this, '${cat.toLowerCase().replace(/'/g, "\\'")}' )`);
    container.appendChild(btn);
  });
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  bumpCartCount();
  showToast(`"${product.name}" added to cart`, "success");
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  updateCartUI();
}

function clearCart() {
  cart = [];
  updateCartUI();
  showToast("Cart cleared.", "info");
}

function updateCartUI() {
  const countEl  = document.getElementById("cartCount");
  const itemsEl  = document.getElementById("cartItems");
  const footer   = document.getElementById("cartFooter");
  const totalEl  = document.getElementById("cartTotal");

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "";
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  totalEl.textContent = `$${formatPrice(total)}`;

  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img
        class="cart-item-img"
        src="${escapeHtml(c.imageUrl || "")}"
        alt="${escapeHtml(c.name)}"
        onerror="this.src='https://placehold.co/96x96/e8e4dc/9e9b94?text=?'"
      />
      <div class="cart-item-info">
        <div class="cart-item-name" title="${escapeHtml(c.name)}">${escapeHtml(c.name)} ${c.qty > 1 ? `×${c.qty}` : ""}</div>
        <div class="cart-item-price">$${formatPrice(c.price * c.qty)}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})" title="Remove">✕</button>
    </div>
  `).join("");
}

function bumpCartCount() {
  const el = document.getElementById("cartCount");
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}

function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  try { localStorage.setItem("ph-theme", isDark ? "light" : "dark"); } catch(_) {}
}

(function initTheme() {
  try {
    const saved = localStorage.getItem("ph-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch(_) {}
})();

function injectSidebarOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.id = "sidebarOverlay";
  overlay.onclick = closeSidebar;
  document.body.appendChild(overlay);
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("mobile-open");
  document.getElementById("sidebarOverlay").classList.toggle("open");
}

function closeSidebar() {
  document.querySelector(".sidebar").classList.remove("mobile-open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

function openModal(overlayId) {
  document.getElementById(overlayId).classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOverlay(overlayId) {
  document.getElementById(overlayId).classList.remove("open");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target === document.getElementById("modalOverlay")) {
    closeModalDirect();
  }
}

function closeModalDirect() {
  closeOverlay("modalOverlay");
  clearForm();
}

function setSubmitLoading(loading) {
  const btn = document.getElementById("modalSubmitBtn");
  btn.disabled = loading;
  btn.textContent = loading ? "Saving…" : (document.getElementById("editProductId").value ? "Save Changes" : "Add Product");
}

function showLoading(show) {
  document.getElementById("loadingState").style.display  = show ? "" : "none";
  document.getElementById("productsGrid").style.display  = show ? "none" : "";
  if (show) document.getElementById("emptyState").style.display = "none";
}

function showEmpty(show) {
  document.getElementById("emptyState").style.display   = show ? "" : "none";
  document.getElementById("productsGrid").style.display = show ? "none" : "";
  document.getElementById("loadingState").style.display = "none";
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-dot"></span>${escapeHtml(message)}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrice(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return "0.00";
  return n.toFixed(2);
}