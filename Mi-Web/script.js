const products = [
  {id:1,name:"Goku – Figura 3D",price:4.99,category:"Figuras y personajes",rating:4.9,reviews:24,tag:"Más vendido",object:"🥋"},
  {id:2,name:"Baby Yoda – Figura 3D",price:3.99,category:"Figuras y personajes",rating:4.8,reviews:18,tag:"Nuevo",object:"👽"},
  {id:3,name:"Castillo Medieval – Modelo 3D",price:6.99,category:"Arquitectura",rating:4.9,reviews:12,tag:"",object:"🏰"},
  {id:4,name:"Jarrón Decorativo – Modelo 3D",price:2.99,category:"Arte y diseño",rating:4.7,reviews:9,tag:"",object:"🏺"},
  {id:5,name:"Engranaje Mecánico – Modelo 3D",price:3.49,category:"Piezas mecánicas",rating:4.8,reviews:15,tag:"",object:"⚙️"},
  {id:6,name:"Dragón Fantástico – Figura 3D",price:5.49,category:"Fantasía y juegos",rating:5,reviews:31,tag:"Popular",object:"🐉"},
  {id:7,name:"Robot Mini – Modelo 3D",price:3.49,category:"Otros",rating:4.6,reviews:8,tag:"Nuevo",object:"🤖"},
  {id:8,name:"Busto Clásico – Modelo 3D",price:4.49,category:"Educación",rating:4.8,reviews:11,tag:"",object:"🏛️"}
];

let cart = JSON.parse(localStorage.getItem("elcheArtCart") || "[]");

const grid = document.getElementById("productGrid");
const search = document.getElementById("productSearch");
const sort = document.getElementById("sortProducts");
const count = document.getElementById("cartCount");
const modal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function money(value) {
  return value.toLocaleString("es-ES", {style:"currency", currency:"EUR"});
}

function stars(rating) {
  return "★★★★★".split("").map((s,i) => i < Math.round(rating) ? s : "☆").join("");
}

function renderProducts() {
  const term = search.value.trim().toLowerCase();
  let list = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)
  );

  switch (sort.value) {
    case "price-low": list.sort((a,b)=>a.price-b.price); break;
    case "price-high": list.sort((a,b)=>b.price-a.price); break;
    case "name": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }

  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <button class="favorite" aria-label="Añadir a favoritos">♡</button>
        <div class="object">${p.object}</div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="rating">${stars(p.rating)} <small>(${p.reviews})</small></div>
        <div class="price">${money(p.price)}</div>
        <button class="add-cart" data-id="${p.id}">🛒 Añadir al carrito</button>
      </div>
    </article>
  `).join("") : `<p>No se han encontrado productos.</p>`;

  grid.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty++;
  else cart.push({id, qty:1});
  saveCart();
  updateCartUI();
  const btn = document.querySelector(`.add-cart[data-id="${id}"]`);
  if (btn) {
    const old = btn.textContent;
    btn.textContent = "✓ Añadido";
    setTimeout(()=>btn.textContent=old, 900);
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
  renderCart();
}

function saveCart() {
  localStorage.setItem("elcheArtCart", JSON.stringify(cart));
}

function updateCartUI() {
  count.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<p style="color:#617084">Tu carrito está vacío.</p>`;
    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const p = products.find(x=>x.id===item.id);
    total += p.price * item.qty;
    return `<div class="cart-row">
      <span>${p.name} × ${item.qty}</span>
      <strong>${money(p.price * item.qty)}</strong>
      <button data-remove="${p.id}" aria-label="Eliminar">Eliminar</button>
    </div>`;
  }).join("");

  cartItems.querySelectorAll("[data-remove]").forEach(btn =>
    btn.addEventListener("click", ()=>removeFromCart(Number(btn.dataset.remove)))
  );
  cartTotal.textContent = money(total);
}

function openCart() {
  renderCart();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}
function closeCart() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}

search.addEventListener("input", renderProducts);
sort.addEventListener("change", renderProducts);
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("footerCart").addEventListener("click", e => { e.preventDefault(); openCart(); });
document.getElementById("closeCart").addEventListener("click", closeCart);
modal.addEventListener("click", e => { if(e.target === modal) closeCart(); });

document.getElementById("searchBtn").addEventListener("click", () => {
  document.getElementById("tienda").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>search.focus(),400);
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category-card").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    search.value = card.dataset.category;
    document.getElementById("tienda").scrollIntoView({behavior:"smooth"});
    renderProducts();
  });
});

document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("¡Gracias por suscribirte a Elche Art 3D!");
  e.target.reset();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return alert("Tu carrito está vacío.");
  alert("Aquí conectaremos el sistema de pago de la tienda.");
});

renderProducts();
updateCartUI();
