
const products = [
  { index: 1, id: "p1", name: "Samsung TV", price: 500000, image: "assets/product1.png" },
  { index: 2, id: "p2", name: "Pixel 4a", price: 250000, image: "assets/product2.png" },
  { index: 3, id: "p3", name: "PS 5", price: 300000, image: "assets/product3.png" },
  { index: 4, id: "p4", name: "MacBook Air", price: 800000, image: "assets/product4.png" },
  { index: 5, id: "p5", name: "Apple Watch", price: 95000, image: "assets/product5.png" },
  { index: 6, id: "p6", name: "Air Pods", price: 75000, image: "assets/product6.png" },
];

function formatPrice(pesewas) {
  return "GHS " + (pesewas / 100).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });
}

const productGrid = document.getElementById("productGrid");

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name.toUpperCase()}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn btn-primary" data-id="${product.id}">
          ADD TO CART
        </button>
      </div>
    `
    )
    .join("");
}

renderProducts();


let cart = [];

const cartCountEl = document.getElementById("cartCount");

function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

function isInCart(id) {
  return Boolean(findCartItem(id));
}

function updateCartCount() {

  cartCountEl.textContent = cart.length;
}

function setProductButtonState(id, inCart) {
  const btn = productGrid.querySelector(`button[data-id="${id}"]`);
  if (!btn) return;
  btn.textContent = inCart ? "REMOVE FROM CART" : "ADD TO CART";
  btn.classList.toggle("in-cart", inCart);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product || isInCart(id)) return;

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
  });

  setProductButtonState(id, true);
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  setProductButtonState(id, false);
  updateCartCount();
  renderCart();
}


productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;

  const id = btn.dataset.id;
  if (isInCart(id)) {
    removeFromCart(id);
  } else {
    addToCart(id);
  }
});

updateCartCount();


const cartItemsEl = document.getElementById("cartItems");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const cartTotalEl = document.getElementById("cartTotal");

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart-msg" id="emptyCartMsg">Your cart is empty.</p>`;
  } else {
    checkoutError.textContent = "";
    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-price">${formatPrice(item.price * item.quantity)}</p>
            <div class="qty-controls">
              <div class="qty-stepper">
                <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="inc" aria-label="Increase quantity">&plus;</button>
              </div>
              <button type="button" class="remove-item-btn" data-action="remove">Remove</button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  cartTotalEl.textContent = formatPrice(calculateTotal());
}

function incrementQty(id) {
  const item = findCartItem(id);
  if (!item) return;
  item.quantity += 1;
  renderCart();
}

function decrementQty(id) {
  const item = findCartItem(id);
  if (!item || item.quantity <= 1) return;
  item.quantity -= 1;
  renderCart();
}


cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.closest(".cart-item").dataset.id;
  const action = btn.dataset.action;

  if (action === "inc") incrementQty(id);
  if (action === "dec") decrementQty(id);
  if (action === "remove") removeFromCart(id);
});

renderCart();


const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");

// Accepts Ghana mobile numbers like 0201234567 or +233201234567
const PHONE_REGEX = /^(\+233|0)[0-9]{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(input, errorEl, message) {
  input.classList.add("invalid");
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove("invalid");
  errorEl.textContent = "";
}

function validateFullName() {
  const value = fullNameInput.value.trim();
  if (value === "") {
    showError(fullNameInput, fullNameError, "Full name is required.");
    return false;
  }
  if (value.length < 2) {
    showError(fullNameInput, fullNameError, "Enter your full name.");
    return false;
  }
  clearError(fullNameInput, fullNameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    showError(emailInput, emailError, "Email is required.");
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    showError(emailInput, emailError, "Enter a valid email address.");
    return false;
  }
  clearError(emailInput, emailError);
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim().replace(/[\s-]/g, "");
  if (value === "") {
    showError(phoneInput, phoneError, "Phone number is required.");
    return false;
  }
  if (!PHONE_REGEX.test(value)) {
    showError(phoneInput, phoneError, "Enter a valid Ghana phone number, e.g. 0201234567.");
    return false;
  }
  clearError(phoneInput, phoneError);
  return true;
}


function validateForm() {
  const isNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  return isNameValid && isEmailValid && isPhoneValid;
}

fullNameInput.addEventListener("blur", validateFullName);
emailInput.addEventListener("blur", validateEmail);
phoneInput.addEventListener("blur", validatePhone);


const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const overlay = document.getElementById("overlay");
const closeCartBtn = document.getElementById("closeCart");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");

function openCart() {
  cartModal.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartModal.classList.remove("open");
  overlay.classList.remove("visible");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
continueShoppingBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);


const PAYSTACK_PUBLIC_KEY = "pk_test_b6cbdae9dc79cc15481e956438a033004870a7e9";

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutError = document.getElementById("checkoutError");

function generateReference() {
  return "EMS-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutError.textContent = "Your cart is empty — add something before checking out.";
    return;
  }
  checkoutError.textContent = "";


  if (!validateForm()) {
    return;
  }

  
  closeCart();

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: emailInput.value.trim(),
    amount: calculateTotal(), // already in pesewas
    currency: "GHS",
    ref: generateReference(),
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: fullNameInput.value.trim(),
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phoneInput.value.trim(),
        },
      ],
    },
    callback: function () {
      showSummary();
    },
    onClose: function () {
    
    },
  });

  handler.openIframe();
});


const summaryOverlay = document.getElementById("summaryOverlay");
const summaryModal = document.getElementById("summaryModal");
const summaryMessage = document.getElementById("summaryMessage");
const summaryItems = document.getElementById("summaryItems");
const summaryOkBtn = document.getElementById("summaryOkBtn");

function showSummary() {
  summaryMessage.textContent = `Thank you, ${fullNameInput.value.trim()}! Your order was successful.`;

  summaryItems.innerHTML = cart
    .map(
      (item) => `
      <div class="summary-item-row">
        <span>${item.name} &times; ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
    `
    )
    .join("");

  summaryModal.classList.add("open");
  summaryOverlay.classList.add("visible");
}


summaryOkBtn.addEventListener("click", () => {
  window.location.reload();
});
