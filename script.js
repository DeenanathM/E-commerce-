const products = [
  {id:1, name:"Cloud Runner", cat:"Running", price:89, emoji:"👟"},
  {id:2, name:"Court Classic", cat:"Basketball", price:120, emoji:"🏀"},
  {id:3, name:"Street Low", cat:"Lifestyle", price:75, emoji:"🛹"},
  {id:4, name:"Trail Blazer", cat:"Running", price:110, emoji:"⛰️"},
  {id:5, name:"High Top Pro", cat:"Basketball", price:135, emoji:"🔥"},
  {id:6, name:"Canvas Original", cat:"Lifestyle", price:60, emoji:"✨"},
  {id:7, name:"Sprint Elite", cat:"Running", price:99, emoji:"⚡"},
  {id:8, name:"Retro Bounce", cat:"Lifestyle", price:80, emoji:"🎨"},
];

const cats = ["All", "Running", "Basketball", "Lifestyle"];
let activeCat = "All";
let cart = {}; // id -> qty

function renderFilters(){
  const el = document.getElementById('filters');
  el.innerHTML = cats.map(c =>
    `<button class="filter-btn ${c===activeCat?'active':''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
}

function setFilter(c){
  activeCat = c;
  renderFilters();
  renderGrid();
}

function renderGrid(){
  const el = document.getElementById('grid');
  const list = activeCat === "All" ? products : products.filter(p=>p.cat===activeCat);
  el.innerHTML = list.map(p => `
    <div class="card">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <div class="card-tag">${p.cat.toUpperCase()}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-price">$${p.price}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  showToast("Added to cart");
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = count;

  const itemsEl = document.getElementById('drawerItems');
  const ids = Object.keys(cart);
  if(ids.length === 0){
    itemsEl.innerHTML = `<div class="empty-msg">Your cart is empty.</div>`;
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const p = products.find(p=>p.id==id);
      const qty = cart[id];
      return `
        <div class="drawer-item">
          <div class="drawer-item-emoji">${p.emoji}</div>
          <div class="drawer-item-info">
            <div class="drawer-item-name">${p.name}</div>
            <div class="drawer-item-price">$${p.price} × ${qty}</div>
          </div>
          <div class="qty-ctrl">
            <button onclick="changeQty(${p.id},-1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${p.id},1)">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  const total = ids.reduce((sum,id)=> sum + products.find(p=>p.id==id).price * cart[id], 0);
  document.getElementById('totalPrice').textContent = `$${total}`;
}

function toggleDrawer(show){
  document.getElementById('drawer').classList.toggle('show', show);
  document.getElementById('overlay').classList.toggle('show', show);
}

function checkout(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  if(count === 0){ showToast("Your cart is empty"); return; }
  showToast("Order placed — thank you!");
  cart = {};
  updateCartUI();
  toggleDrawer(false);
}

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 1800);
}

renderFilters();
renderGrid();
updateCartUI();
