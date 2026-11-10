
const menuItems = [
    { id: 1, name: "Truffle Scallops", category: "Appetizers", price: 18.50, rating: 4.8, type: "non-veg", popular: true, time: "15m", desc: "Pan-seared sea scallops with creamy truffle risotto.", img: "https://placehold.co/500x350/13221C/FC8019?text=Scallops" },
    { id: 2, name: "Wagyu Beef Carpaccio", category: "Appetizers", price: 22.00, rating: 4.9, type: "non-veg", popular: true, time: "12m", desc: "Thinly sliced A5 Wagyu with arugula and truffle aioli.", img: "https://placehold.co/500x350/13221C/FC8019?text=Carpaccio" },
    { id: 3, name: "Crispy Brussels & Truffle Honey", category: "Appetizers", price: 14.00, rating: 4.7, type: "veg", popular: true, time: "10m", desc: "Charred Brussels sprouts tossed in spicy truffle honey.", img: "https://placehold.co/500x350/13221C/FC8019?text=Brussels" },
    { id: 4, name: "Pan-Roasted Chilean Sea Bass", category: "Mains", price: 42.00, rating: 4.9, type: "non-veg", popular: true, time: "25m", desc: "Served with saffron lemongrass reduction and bok choy.", img: "https://placehold.co/500x350/13221C/FC8019?text=Sea+Bass" },
    { id: 5, name: "Wild Mushroom Risotto", category: "Mains", price: 32.00, rating: 4.6, type: "veg", popular: true, time: "20m", desc: "Arborio rice, porcini mushrooms, truffle butter.", img: "https://placehold.co/500x350/13221C/FC8019?text=Risotto" },
    { id: 6, name: "Truffled Margherita Pizza", category: "Mains", price: 26.00, rating: 4.8, type: "veg", popular: false, time: "18m", desc: "San Marzano tomatoes, fior di latte, summer truffles.", img: "https://placehold.co/500x350/13221C/FC8019?text=Pizza" },
    { id: 7, name: "Gilded Signature Old Fashioned", category: "Drinks", price: 19.00, rating: 4.9, type: "veg", popular: true, time: "5m", desc: "Japanese whisky, bitters, smoked maple, 24k gold leaf.", img: "https://placehold.co/500x350/13221C/FC8019?text=Cocktail" },
    { id: 8, name: "Vintage Barolo DOCG 2016", category: "Drinks", price: 95.00, rating: 5.0, type: "veg", popular: false, time: "3m", desc: "Exceptional Piedmont red with violet and truffle notes.", img: "https://placehold.co/500x350/13221C/FC8019?text=Barolo" },
    { id: 9, name: "Valrhona Dark Chocolate Soufflé", category: "Desserts", price: 15.00, rating: 4.9, type: "veg", popular: true, time: "18m", desc: "Warm molten chocolate soufflé with vanilla gelato.", img: "https://placehold.co/500x350/13221C/FC8019?text=Souffle" }
];

let cart = [];
let currentCategory = 'All';
let currentThemeFilter = 'all';
let activeDishForDetails = null;
let detailQty = 1;
let selectedSpice = 1;
let currentTrackingState = 2;
let isDarkMode = true;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const html = document.documentElement;
    const icon = document.getElementById('theme-mode-icon');
    if (isDarkMode) {
        html.classList.add('dark');
        icon.className = 'fa-solid fa-moon text-sm';
    } else {
        html.classList.remove('dark');
        icon.className = 'fa-solid fa-sun text-sm text-amber-500';
    }
}

function setThemeFilter(filter) {
    currentThemeFilter = filter;
    const root = document.body;

    const allBtn = document.getElementById('filter-all-btn');
    const vegBtn = document.getElementById('filter-veg-btn');
    const nonVegBtn = document.getElementById('filter-nonveg-btn');
    const popularBtn = document.getElementById('filter-popular-btn');

    // Reset base unselected styles
    [allBtn, vegBtn, nonVegBtn, popularBtn].forEach(b => {
        b.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-slate-500 dark:text-slate-400';
    });

    if (filter === 'veg') {
        vegBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-600 text-white shadow-md hover:bg-emerald-500';
        root.style.setProperty('--theme-primary', '#10B981');
        root.style.setProperty('--theme-secondary', '#059669');
    } else if (filter === 'non-veg') {
        nonVegBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-rose-600 text-white shadow-md hover:bg-rose-500';
        root.style.setProperty('--theme-primary', '#E23744');
        root.style.setProperty('--theme-secondary', '#991B1B');
    } else if (filter === 'popular') {
        popularBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500 text-slate-900 shadow-md hover:bg-amber-400';
        root.style.setProperty('--theme-primary', '#D4AF37');
        root.style.setProperty('--theme-secondary', '#B8860B');
    } else {
        allBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-[#FC8019] text-white shadow-md hover:opacity-90';
        root.style.setProperty('--theme-primary', '#FC8019');
        root.style.setProperty('--theme-secondary', '#E23744');
    }
    renderMenuGrid();
}

function switchView(viewName) {
    ['welcome', 'menu', 'details', 'cart', 'checkout', 'tracking', 'review'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    const header = document.getElementById('main-header');
    const toolbar = document.getElementById('persistent-toolbar');

    if (viewName === 'welcome') {
        if (header) header.classList.add('hidden');
        if (toolbar) toolbar.classList.add('hidden');
    } else {
        if (header) header.classList.remove('hidden');
        if (toolbar) toolbar.classList.remove('hidden');
    }
    if (viewName === 'menu') renderMenuGrid();
    if (viewName === 'cart') renderFullCart();
    if (viewName === 'checkout') updateCheckoutAmount();
}

function startSession() {
    switchView('menu');
    showToast('Connected', 'Table 01 active session started.');
}

function renderMenuGrid(query = '') {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    let filtered = [...menuItems];
    if (currentCategory !== 'All') filtered = filtered.filter(i => i.category === currentCategory);
    if (currentThemeFilter === 'veg') filtered = filtered.filter(i => i.type === 'veg');
    if (currentThemeFilter === 'non-veg') filtered = filtered.filter(i => i.type === 'non-veg');
    if (currentThemeFilter === 'popular') filtered = filtered.filter(i => i.popular === true);

    // If veg or non-veg filter is active, float most popular dishes to the top of the grid
    if (currentThemeFilter === 'veg' || currentThemeFilter === 'non-veg') {
        filtered.sort((a, b) => (b.popular === true) - (a.popular === true));
    }

    if (query.trim() !== '') {
        const q = query.toLowerCase();
        filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-16 text-slate-400 text-xs">No matching dishes found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="bg-white dark:bg-[#13221C] border border-slate-200 dark:border-emerald-900/40 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-brand transition-all">
            <div>
                <div class="relative h-44 sm:h-48 overflow-hidden cursor-pointer" onclick="openFoodDetails(${item.id})">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-2.5 left-2.5 bg-white/90 dark:bg-[#0B1310]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200 dark:border-emerald-900/40 flex items-center space-x-1">
                        <span class="w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                        <span class="text-[9px] font-bold uppercase">${item.type}</span>
                    </div>
                    ${item.popular ? '<div class="absolute top-2.5 right-2.5 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-lg text-[9px] font-extrabold shadow-md">🔥 Popular</div>' : ''}
                    <div class="absolute bottom-2.5 left-2.5 bg-white/90 dark:bg-[#0B1310]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-500">
                        <i class="fa-solid fa-star text-[10px]"></i> ${item.rating}
                    </div>
                    <div class="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-[#0B1310]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-400">
                        ${item.time}
                    </div>
                </div>

                <div class="p-4 sm:p-5">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] uppercase font-extrabold theme-text tracking-wider">${item.category}</span>
                        <span class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">$${item.price.toFixed(2)}</span>
                    </div>
                    <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5 cursor-pointer hover:text-brand" onclick="openFoodDetails(${item.id})">${item.name}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${item.desc}</p>
                </div>
            </div>

            <div class="p-4 sm:p-5 pt-0 flex items-center space-x-2">
                <button onclick="openFoodDetails(${item.id})" class="flex-1 bg-slate-100 dark:bg-[#0B1310] hover:bg-slate-200 border border-slate-200 dark:border-emerald-900/40 text-slate-700 dark:text-slate-200 py-2.5 rounded-2xl text-xs font-bold transition-all">
                    Customize & Ingredients
                </button>
                <button onclick="quickAddToCart(${item.id})" class="theme-gradient hover:opacity-90 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                    <i class="fa-solid fa-plus text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(btn => {
        if (btn.innerText.includes(cat) || (cat === 'All' && btn.innerText.includes('All'))) {
            btn.className = 'cat-pill px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all theme-bg text-white shadow-md shrink-0';
        } else {
            btn.className = 'cat-pill px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all bg-white dark:bg-[#13221C] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/40 shrink-0';
        }
    });
    renderMenuGrid();
}

function handleSearch(val) {
    renderMenuGrid(val);
}

function openFoodDetails(id) {
    activeDishForDetails = menuItems.find(i => i.id === id);
    if (!activeDishForDetails) return;

    detailQty = 1;
    selectedSpice = 1;
    document.getElementById('detail-img').src = activeDishForDetails.img;
    document.getElementById('detail-category').innerText = activeDishForDetails.category;
    document.getElementById('detail-title').innerText = activeDishForDetails.name;
    document.getElementById('detail-desc').innerText = activeDishForDetails.desc;
    document.getElementById('detail-price').innerText = `$${activeDishForDetails.price.toFixed(2)}`;
    document.getElementById('detail-qty').innerText = detailQty;
    document.getElementById('detail-add-label').innerText = `Add ($${activeDishForDetails.price.toFixed(2)})`;

    const popularBadge = document.getElementById('detail-popular-badge');
    if (activeDishForDetails.popular) {
        popularBadge.classList.remove('hidden');
    } else {
        popularBadge.classList.add('hidden');
    }

     document.querySelectorAll('input[name="custom"]').forEach(cb => cb.checked = false);
    switchView('details');
        }

function adjustDetailQty(delta) {
    detailQty = Math.max(1, detailQty + delta);
    document.getElementById('detail-qty').innerText = detailQty;
    const total = activeDishForDetails.price * detailQty;
    document.getElementById('detail-add-label').innerText = `Add ($${total.toFixed(2)})`;
}

function setSpice(lvl) {
    selectedSpice = lvl;
    [1, 2, 3].forEach(n => {
        const btn = document.getElementById(`spice-${n}`);
        if (n === lvl) {
            btn.className = 'spice-btn flex-1 py-2 bg-brand/10 border theme-border rounded-xl text-xs font-semibold theme-text';
        } else {
            btn.className = 'spice-btn flex-1 py-2 bg-slate-100 dark:bg-[#0B1310] border border-slate-200 dark:border-emerald-900/40 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300';
        }
    });
}

function addCurrentDishToCart() {
    if (!activeDishForDetails) return;
    const customs = Array.from(document.querySelectorAll('input[name="custom"]:checked')).map(cb => cb.value);

    cart.push({
        id: Date.now(),
        name: activeDishForDetails.name,
        price: activeDishForDetails.price,
        qty: detailQty,
        customizations: customs,
        img: activeDishForDetails.img
    });
    updateCartUI();
    switchView('menu');
    showToast('Added to Cart', `${detailQty}x ${activeDishForDetails.name} customized & added.`);
}

function quickAddToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return
    cart.push({
        id: Date.now(),
        name: item.name,
        price: item.price,
        qty: 1,
        customizations: [],
        img: item.img
    });
    updateCartUI();
    showToast('Added', `1x ${item.name} added.`);
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge-count');
    const countLabel = document.getElementById('cart-item-count-label');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const sidebarList = document.getElementById('sidebar-cart-items');

     const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (badge) badge.innerText = totalCount;
    if (countLabel) countLabel.innerText = `${totalCount} items`;

     const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

     if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;

     if (checkoutBtn) {
        if (cart.length > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.className = 'w-full theme-gradient text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center space-x-2';
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.className = 'w-full bg-slate-200 dark:bg-emerald-950 text-slate-400 dark:text-slate-500 cursor-not-allowed font-bold py-3.5 rounded-2xl transition-all text-xs flex items-center justify-center space-x-2';
        }
    }

     if (sidebarList) {
        if (cart.length === 0) {
            sidebarList.innerHTML = `<div class="text-center py-16 text-slate-400"><i class="fa-solid fa-basket-shopping text-3xl mb-2 text-slate-300 dark:text-emerald-950"></i><p class="text-xs">Cart is empty.</p></div>`;
        } else {
            sidebarList.innerHTML = cart.map(item => `
                <div class="bg-slate-50 dark:bg-[#0B1310] border border-slate-200 dark:border-emerald-900/40 p-3 rounded-2xl flex items-center justify-between space-x-2">
                    <img src="${item.img}" class="w-10 h-10 rounded-xl object-cover">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${item.name}</h4>
                        <p class="text-[10px] theme-text font-bold">$${item.price.toFixed(2)} x ${item.qty}</p>
                    </div>
                    <div class="flex items-center space-x-1 bg-white dark:bg-[#13221C] border border-slate-200 dark:border-emerald-900/40 p-1 rounded-xl text-xs">
                        <button onclick="modifyCartQty(${item.id}, -1)" class="w-5 h-5 rounded-lg bg-slate-100 dark:bg-[#0B1310]">-</button>
                        <span class="font-bold w-4 text-center">${item.qty}</span>
                        <button onclick="modifyCartQty(${item.id}, 1)" class="w-5 h-5 rounded-lg bg-slate-100 dark:bg-[#0B1310]">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

 function modifyCartQty(id, delta) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx !== -1) {
        cart[idx].qty += delta;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
    }
    updateCartUI();
    renderFullCart();
}

 function renderFullCart() {
    const list = document.getElementById('cart-full-list');
    const subtotalEl = document.getElementById('full-cart-subtotal');
    const taxEl = document.getElementById('full-cart-tax');
    const totalEl = document.getElementById('full-cart-total');

     const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

     if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    if (!list) return;

     if (cart.length === 0) {
        list.innerHTML = `<div class="bg-white dark:bg-[#13221C] border border-slate-200 dark:border-emerald-900/40 rounded-3xl p-12 text-center text-slate-400 text-xs">Your cart is empty.</div>`;
        return;
    }

     list.innerHTML = cart.map(item => `
        <div class="bg-white dark:bg-[#13221C] border border-slate-200 dark:border-emerald-900/40 rounded-3xl p-4 flex items-center space-x-3 shadow-md">
            <img src="${item.img}" class="w-14 h-14 rounded-2xl object-cover">
            <div class="flex-1">
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">${item.name}</h4>
                <p class="text-xs theme-text font-bold">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center space-x-1.5 bg-slate-50 dark:bg-[#0B1310] border border-slate-200 dark:border-emerald-900/40 p-1.5 rounded-2xl">
                <button onclick="modifyCartQty(${item.id}, -1)" class="w-7 h-7 rounded-xl bg-white dark:bg-[#13221C] text-xs">-</button>
                <span class="text-xs font-bold w-5 text-center">${item.qty}</span>
                <button onclick="modifyCartQty(${item.id}, 1)" class="w-7 h-7 rounded-xl bg-white dark:bg-[#13221C] text-xs">+</button>
            </div>
        </div>
    `).join('');
}

 function proceedToCheckout() {
    if (cart.length === 0) return;
    switchView('checkout');
}

 function selectPayment(type) {
    document.querySelectorAll('.pay-method-btn').forEach(b => {
        b.className = 'pay-method-btn bg-slate-50 dark:bg-[#0B1310] border border-slate-200 dark:border-emerald-900/40 rounded-2xl p-4 text-left transition-all';
    });
    const sel = document.getElementById(`pay-${type.toLowerCase()}`);
    if (sel) sel.className = 'pay-method-btn bg-slate-50 dark:bg-[#0B1310] border-2 theme-border rounded-2xl p-4 text-left transition-all shadow-md';
}

 function updateCheckoutAmount() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal * 1.10;
    const el = document.getElementById('checkout-final-amount');
    if (el) el.innerText = `$${total.toFixed(2)}`;
}

 function submitOrderAndPay() {
    showToast('Order Dispatched', 'Kitchen has received your order.');
    switchView('tracking');
    cart = [];
    updateCartUI();
}

 function advanceTrackingState() {
    currentTrackingState = currentTrackingState >= 3 ? 1 : currentTrackingState + 1;
    const fill = document.getElementById('progress-bar-fill');
    const statusText = document.getElementById('tracking-status-text');

     if (currentTrackingState === 1) {
        if (fill) fill.style.width = '0%';
        if (statusText) statusText.innerText = 'Received';
    } else if (currentTrackingState === 2) {
        if (fill) fill.style.width = '50%';
        if (statusText) statusText.innerText = 'Preparing';
    } else if (currentTrackingState === 3) {
        if (fill) fill.style.width = '100%';
        if (statusText) statusText.innerText = 'Served';
    }
    showToast('Status Updated', 'Kitchen status advanced.');
}

 function submitReviewAndFinish() {
    showToast('Thank You!', 'Review submitted successfully.');
    setTimeout(() => switchView('welcome'), 1500);
}

 function triggerToolbarAction(action) {
    if (action === 'call') showToast('Waiter Summoned', 'Staff notified of your table.');
    else if (action === 'bill') {
        showToast('Bill Requested', 'Manager dispatching bill summary.');
        switchView('cart');
    }
}

 function showToast(title, desc) {
    const toast = document.getElementById('toast-modal');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-desc').innerText = desc;
    toast.classList.remove('translate-x-96');
    setTimeout(() => toast.classList.add('translate-x-96'), 3000);
}

 window.onload = function() {
    switchView('welcome');
}