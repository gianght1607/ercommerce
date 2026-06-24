// ── AUTH ──
const USERS = [
  { username: 'admin', password: '123456', name: 'Admin User' },
  { username: 'tester', password: 'abc123', name: 'Ha Giang' },
];
function isLoggedIn() { return !!sessionStorage.getItem('shop_user'); }
function getUser() { const u = sessionStorage.getItem('shop_user'); return u ? JSON.parse(u) : null; }
function requireLogin() { if (!isLoggedIn()) { window.location.href = getBase() + 'index.html'; } }
function logout() { sessionStorage.removeItem('shop_user'); window.location.href = getBase() + 'index.html'; }
function getBase() {
  const p = window.location.pathname;
  const idx = p.indexOf('/pages/');
  return idx !== -1 ? p.substring(0, idx) + '/' : './';
}

// ── CART ──
function getCart() { return JSON.parse(sessionStorage.getItem('shop_cart') || '[]'); }
function saveCart(cart) { sessionStorage.setItem('shop_cart', JSON.stringify(cart)); updateCartBadge(); }
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
}
function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}
function cartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }
function formatPrice(n) { return new Intl.NumberFormat('vi-VN').format(n) + ' ₫'; }

// ── ORDERS ──
function getOrders() { return JSON.parse(sessionStorage.getItem('shop_orders') || '[]'); }
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  sessionStorage.setItem('shop_orders', JSON.stringify(orders));
}
function genOrderId() { return 'ORD-' + Date.now().toString().slice(-6); }

// ── PRODUCTS DATA ──
const PRODUCTS = [
  { id: 1, name: 'Laptop Dell XPS 15', category: 'Laptop', price: 25990000, oldPrice: 28000000, emoji: '💻', rating: 4.8, reviews: 124, stock: 10, desc: 'Laptop cao cấp Intel Core i7, RAM 16GB, SSD 512GB, màn hình 4K OLED.' },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Phone', price: 33990000, oldPrice: 36000000, emoji: '📱', rating: 4.9, reviews: 318, stock: 5, desc: 'Apple A17 Pro, camera 48MP, Dynamic Island, titanium frame.' },
  { id: 3, name: 'iPad Pro M2 11"', category: 'Tablet', price: 19990000, oldPrice: null, emoji: '📲', rating: 4.7, reviews: 87, stock: 8, desc: 'Apple M2 chip, màn hình Liquid Retina, hỗ trợ Apple Pencil 2.' },
  { id: 4, name: 'Tai nghe Sony WH-1000XM5', category: 'Audio', price: 7990000, oldPrice: 9500000, emoji: '🎧', rating: 4.8, reviews: 256, stock: 15, desc: 'Chống ồn chủ động tốt nhất, 30h battery, kết nối multipoint.' },
  { id: 5, name: 'Bàn phím Keychron K2 Pro', category: 'Accessories', price: 2190000, oldPrice: 2500000, emoji: '⌨️', rating: 4.6, reviews: 143, stock: 20, desc: 'Bàn phím cơ wireless 75%, switch Gateron, backlight RGB.' },
  { id: 6, name: 'Chuột Logitech MX Master 3S', category: 'Accessories', price: 2490000, oldPrice: null, emoji: '🖱️', rating: 4.7, reviews: 198, stock: 12, desc: 'Chuột ergonomic không dây, scroll MagSpeed, 7 nút lập trình.' },
  { id: 7, name: 'Monitor LG UltraWide 34"', category: 'Monitor', price: 14990000, oldPrice: 17000000, emoji: '🖥️', rating: 4.5, reviews: 67, stock: 4, desc: 'Màn hình ultrawide 3440x1440, IPS, 144Hz, HDR10, USB-C.' },
  { id: 8, name: 'Samsung Galaxy S24 Ultra', category: 'Phone', price: 31990000, oldPrice: 33000000, emoji: '📵', rating: 4.7, reviews: 201, stock: 7, desc: 'Snapdragon 8 Gen 3, camera 200MP, S Pen, 5000mAh.' },
  { id: 9, name: 'MacBook Air M3 13"', category: 'Laptop', price: 29990000, oldPrice: null, emoji: '🍎', rating: 4.9, reviews: 412, stock: 6, desc: 'Apple M3, 8GB RAM, 256GB SSD, 18h battery, fanless design.' },
  { id: 10, name: 'AirPods Pro 2nd Gen', category: 'Audio', price: 6490000, oldPrice: 7200000, emoji: '🎵', rating: 4.8, reviews: 531, stock: 18, desc: 'ANC nâng cấp, Transparency mode, Adaptive Audio, MagSafe case.' },
  { id: 11, name: 'Webcam Logitech C920 HD', category: 'Accessories', price: 1890000, oldPrice: 2200000, emoji: '📷', rating: 4.4, reviews: 89, stock: 14, desc: 'Full HD 1080p, autofocus, stereo mic, USB plug-and-play.' },
  { id: 12, name: 'SSD Samsung 990 Pro 1TB', category: 'Storage', price: 3290000, oldPrice: 3800000, emoji: '💾', rating: 4.9, reviews: 174, stock: 22, desc: 'NVMe PCIe 4.0, đọc 7450MB/s, ghi 6900MB/s, bảo hành 5 năm.' },
];

// ── NAV ──
function renderNav(active) {
  const user = getUser();
  const base = getBase() + 'pages/';
  const cartCount = getCart().reduce((s, i) => s + i.qty, 0);
  return `<nav class="navbar">
    <a class="logo" href="${base}products.html">🛍️ ShopDemo</a>
    <a href="${base}products.html" class="${active==='products'?'active':''}" data-testid="nav-products">Products</a>
    <a href="${base}orders.html" class="${active==='orders'?'active':''}" data-testid="nav-orders">My Orders</a>
    <div class="nav-right">
      <a href="${base}cart.html" class="btn btn-secondary btn-sm cart-badge" data-testid="nav-cart">
        🛒 Cart
        <span class="cart-count" data-testid="cart-count" style="display:${cartCount>0?'flex':'none'}">${cartCount}</span>
      </a>
      <span style="font-size:13px;color:var(--text2)">${user?.name || ''}</span>
      <button class="btn-logout" onclick="logout()" data-testid="btn-logout">Logout</button>
    </div>
  </nav>`;
}
