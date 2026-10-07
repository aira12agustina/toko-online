// ====== Data awal ======
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Headphone Bluetooth", price: 250000, category: "Elektronik", seller: "TokoGadget", image: "", emoji: "🎧", desc: "Suara jernih, baterai tahan 20 jam." },
  { id: 2, name: "Kaos Polos Katun", price: 65000, category: "Fashion", seller: "KaosKita", image: "", emoji: "👕", desc: "Bahan adem, tersedia berbagai ukuran." },
  { id: 3, name: "Lampu Meja LED", price: 90000, category: "Rumah", seller: "RumahAsri", image: "", emoji: "💡", desc: "Hemat energi, cahaya bisa diatur." },
  { id: 4, name: "Set Kartu Remi", price: 15000, category: "Hobi", seller: "HobiBox", image: "", emoji: "🃏", desc: "Kualitas premium, tahan lama." },
  { id: 5, name: "Mouse Wireless", price: 85000, category: "Elektronik", seller: "TokoGadget", image: "", emoji: "🖱️", desc: "Ergonomis, sensor presisi." }
];

const KEY_PRODUCTS = "pasarku_products";
const KEY_CART = "pasarku_cart";

// ====== State ======
let products = load(KEY_PRODUCTS, DEFAULT_PRODUCTS);
let cart = load(KEY_CART, []); // [{id, qty}]
let state = { search: "", category: "Semua", sort: "new" };

// ====== Util ======
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* abaikan */ }
}
function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function safeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : "";
}
function $(sel) { return document.querySelector(sel); }

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 2000);
}

// ====== Render produk ======
function visualFor(p, cls) {
  const url = safeUrl(p.image);
  if (url) return `<img src="${escapeHTML(url)}" alt="${escapeHTML(p.name)}" loading="lazy">`;
  return p.emoji || "📦";
}

function renderCategories() {
  const cats = ["Semua", ...new Set(products.map(p => p.category))];
  $("#categories").innerHTML = cats
    .map(c => `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`)
    .join("");
}

function renderProducts() {
  let list = products.filter(p => {
    const q = state.search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchCat = state.category === "Semua" || p.category === state.category;
    return matchSearch && matchCat;
  });

  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  else if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.id - a.id);

  $("#productGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="card-img">${visualFor(p)}</div>
      <div class="card-body">
        <div class="card-title">${escapeHTML(p.name)}</div>
        <div class="card-price">${rupiah(p.price)}</div>
        <div class="card-meta">${escapeHTML(p.category)} · ${escapeHTML(p.seller)}</div>
        <div class="card-desc">${escapeHTML(p.desc)}</div>
        <button class="btn btn-primary" data-add="${p.id}">+ Keranjang</button>
      </div>
    </article>
  `).join("");

  $("#emptyState").hidden = list.length > 0;
}

// ====== Keranjang ======
function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  save(KEY_CART, cart);
  renderCart();
  toast("Ditambahkan ke keranjang");
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  save(KEY_CART, cart);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  save(KEY_CART, cart);
  renderCart();
}

function renderCart() {
  // buang item yang produknya sudah tidak ada
  cart = cart.filter(i => products.some(p => p.id === i.id));
  $("#cartCount").textContent = cartCount();

  if (cart.length === 0) {
    $("#cartItems").innerHTML = `<p class="cart-empty">Keranjang masih kosong.</p>`;
    $("#cartTotal").textContent = rupiah(0);
    return;
  }

  let total = 0;
  $("#cartItems").innerHTML = cart.map(i => {
    const p = products.find(x => x.id === i.id);
    total += p.price * i.qty;
    return `
      <div class="cart-item">
        <div class="cart-thumb">${visualFor(p)}</div>
        <div class="cart-info">
          ${escapeHTML(p.name)}<br><small>${rupiah(p.price)}</small>
        </div>
        <div>
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Kurangi">-</button>
            <span>${i.qty}</span>
            <button data-inc="${p.id}" aria-label="Tambah">+</button>
          </div>
          <button class="remove" data-rm="${p.id}">Hapus</button>
        </div>
      </div>`;
  }).join("");
  $("#cartTotal").textContent = rupiah(total);
}

// ====== Modal ======
function openModal(el) { el.hidden = false; }
function closeModal(el) { el.hidden = true; }

// ====== Event ======
$("#searchInput").addEventListener("input", e => { state.search = e.target.value; renderProducts(); });
$("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; renderProducts(); });

$("#categories").addEventListener("click", e => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderCategories();
  renderProducts();
});

$("#productGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});

$("#cartItems").addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.inc) changeQty(Number(t.dataset.inc), 1);
  else if (t.dataset.dec) changeQty(Number(t.dataset.dec), -1);
  else if (t.dataset.rm) removeFromCart(Number(t.dataset.rm));
});

$("#sellBtn").addEventListener("click", () => openModal($("#sellModal")));
$("#cartBtn").addEventListener("click", () => { renderCart(); openModal($("#cartDrawer")); });

document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("click", e => {
    if (e.target === m || e.target.hasAttribute("data-close")) closeModal(m);
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".modal").forEach(closeModal);
});

$("#sellForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const price = Number(f.get("price"));
  if (!Number.isFinite(price) || price <= 0) return toast("Harga tidak valid");

  const newProduct = {
    id: Date.now(),
    name: f.get("name").trim(),
    price,
    category: f.get("category"),
    seller: f.get("seller").trim(),
    image: f.get("image").trim(),
    emoji: "📦",
    desc: f.get("desc").trim() || "Tidak ada deskripsi."
  };
  products.push(newProduct);
  save(KEY_PRODUCTS, products);
  e.target.reset();
  closeModal($("#sellModal"));
  renderCategories();
  renderProducts();
  toast("Barang berhasil dipasang");
});

$("#checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return toast("Keranjang kosong");
  // Simulasi: belum ada pembayaran sungguhan
  cart = [];
  save(KEY_CART, cart);
  renderCart();
  closeModal($("#cartDrawer"));
  toast("Pesanan dibuat (simulasi)");
});

// ====== Init ======
renderCategories();
renderProducts();
renderCart();
