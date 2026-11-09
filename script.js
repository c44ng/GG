// =========================
// WARMHUZZ JAVASCRIPT
// =========================

const products = [
  ...document.querySelectorAll('.product-card')
];

const filters = document.querySelectorAll('.filter');
const grid = document.getElementById('productGrid');
const sortSelect = document.getElementById('sortSelect');

let activeFilter = 'all';
let cart = [];

// FORMAT HARGA RUPIAH

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

// FILTER DAN SORT PRODUK

function renderProducts() {
  let visible = products.filter(card =>
    activeFilter === 'all' ||
    card.dataset.category === activeFilter
  );

  const sort = sortSelect.value;

  if (sort === 'low') {
    visible.sort((a, b) =>
      Number(a.dataset.price) - Number(b.dataset.price)
    );
  }

  if (sort === 'high') {
    visible.sort((a, b) =>
      Number(b.dataset.price) - Number(a.dataset.price)
    );
  }

  grid.innerHTML = '';

  if (!visible.length) {
    grid.innerHTML =
      '<p class="no-results">No products found in this category.</p>';
    return;
  }

  visible.forEach(card => grid.appendChild(card));
}

// FILTER BUTTON

filters.forEach(button => {
  button.addEventListener('click', () => {

    filters.forEach(item =>
      item.classList.remove('active')
    );

    button.classList.add('active');

    activeFilter = button.dataset.filter;

    renderProducts();
  });
});

// SORT BUTTON

sortSelect.addEventListener('change', renderProducts);

// =========================
// SHOPPING CART
// =========================

function updateCart() {

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  document.getElementById('cartCount').textContent = count;

  document.getElementById('drawerCount').textContent =
    `(${count})`;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  document.getElementById('cartTotal').textContent =
    formatRupiah(total);

  const container = document.getElementById('cartItems');

  if (!cart.length) {
    container.innerHTML =
      '<p class="empty-cart">Your bag is currently empty.</p>';

    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">

      <div>
        <strong>${item.name}</strong>
        <p>
          ${formatRupiah(item.price)} × ${item.qty}
        </p>
      </div>

      <button data-remove="${index}">
        REMOVE
      </button>

    </div>
  `).join('');

  container.querySelectorAll('[data-remove]').forEach(button => {

    button.addEventListener('click', () => {

      cart.splice(Number(button.dataset.remove), 1);

      updateCart();

    });

  });
}

// ADD TO BAG

document.addEventListener('click', event => {

  const add = event.target.closest('.quick-add');

  if (!add) return;

  const name = add.dataset.name;
  const price = Number(add.dataset.price);

  const existing = cart.find(item =>
    item.name === name
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1
    });
  }

  updateCart();

  add.textContent = 'ADDED ✓';

  setTimeout(() => {
    add.textContent = 'ADD TO BAG +';
  }, 1100);

});

// OPEN CART

const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');

function openCart() {
  drawer.classList.add('open');
  overlay.classList.add('show');
}

function closePanels() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
}

document.getElementById('cartToggle')
  .addEventListener('click', openCart);

document.getElementById('closeCart')
  .addEventListener('click', closePanels);

overlay.addEventListener('click', closePanels);

// CHECKOUT DEMO

document.getElementById('checkoutButton')
  .addEventListener('click', () => {

    alert(
      'This is a front-end demo. Connect a checkout or payment service to accept real orders.'
    );

  });

// =========================
// SEARCH PRODUCTS
// =========================

const searchPanel =
  document.getElementById('searchPanel');

document.getElementById('searchToggle')
  .addEventListener('click', () => {

    searchPanel.classList.add('open');

    document.getElementById('searchInput').focus();

  });

document.getElementById('closeSearch')
  .addEventListener('click', () => {

    searchPanel.classList.remove('open');

  });

document.getElementById('searchInput')
  .addEventListener('input', event => {

    const term = event.target.value
      .toLowerCase()
      .trim();

    products.forEach(card => {

      const matches = card.textContent
        .toLowerCase()
        .includes(term);

      card.style.display = matches ? '' : 'none';

    });

    if (!term) {
      renderProducts();
    }

  });

// =========================
// MOBILE MENU
// =========================

document.getElementById('menuToggle')
  .addEventListener('click', () => {

    document.getElementById('mainNav')
      .classList.toggle('open');

  });

document.querySelectorAll('.main-nav a')
  .forEach(link => {

    link.addEventListener('click', () => {

      document.getElementById('mainNav')
        .classList.remove('open');

    });

  });

// =========================
// CATEGORY CARDS
// =========================

document.querySelectorAll('[data-jump]')
  .forEach(link => {

    link.addEventListener('click', () => {

      activeFilter = link.dataset.jump;

      filters.forEach(item => {

        item.classList.toggle(
          'active',
          item.dataset.filter === activeFilter
        );

      });

      renderProducts();

    });

  });

// =========================
// NEWSLETTER
// =========================

document.getElementById('newsletterForm')
  .addEventListener('submit', event => {

    event.preventDefault();

    document.getElementById('formMessage')
      .textContent =
      'Thanks for joining the WARMHUZZ list!';

    event.target.reset();

  });

// INITIALIZE

updateCart();
