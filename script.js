let cart = {};
const maxWeeklyUnits = 100; // shared weekly limit
let totalUnits = 0;

const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

// 🛒 Add to Cart
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const id = productCard.dataset.id;

    if (totalUnits + 10 > maxWeeklyUnits) {
      alert("Weekly limit of 100 units reached!");
      return;
    }

    if (!cart[id]) cart[id] = 0;
    cart[id] += 10;
    totalUnits += 10;

    updateCartDisplay();
  });
});

// 🧹 Update Cart
function updateCartDisplay() {
  cartItemsEl.innerHTML = "";
  for (let id in cart) {
    const li = document.createElement("li");
    li.textContent = `${id} — ${cart[id]} units`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeItem(id);
    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  }

  cartCountEl.textContent = totalUnits;
}

// ❌ Remove Item
function removeItem(id) {
  if (cart[id]) {
    totalUnits -= cart[id];
    delete cart[id];
    updateCartDisplay();
  }
}

// 🧾 Checkout (placeholder until Stripe is live)
checkoutBtn.addEventListener("click", () => {
  if (totalUnits === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Checkout system will be available after Stripe verification.");
});
