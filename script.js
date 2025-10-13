const cart = {};
const cartList = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");

const MAX_WEEKLY_UNITS = 100;
let totalUnits = 0;

// Add to cart
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const name = productCard.querySelector("h3").textContent;
    const priceId = productCard.dataset.priceId;

    if (totalUnits + 10 > MAX_WEEKLY_UNITS) {
      alert("Weekly limit reached (100 units total).");
      return;
    }

    if (!cart[priceId]) {
      cart[priceId] = { name, quantity: 0 };
    }

    cart[priceId].quantity += 10;
    totalUnits += 10;

    renderCart();
  });
});

function renderCart() {
  cartList.innerHTML = "";
  Object.values(cart).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.quantity} units`;
    cartList.appendChild(li);
  });
}

// Stripe Checkout
checkoutBtn.addEventListener("click", async () => {
  if (totalUnits === 0) {
    alert("Your cart is empty.");
    return;
  }

  const lineItems = Object.keys(cart).map((id) => ({
    price: id,
    quantity: cart[id].quantity
  }));

  // Stripe checkout redirect
  const { error } = await stripe.redirectToCheckout({
    lineItems,
    mode: "payment",
    successUrl: window.location.origin + "/success.html",
    cancelUrl: window.location.origin + "/cancel.html",
  });

  if (error) {
    console.error(error);
    alert("Checkout failed. Please try again.");
  }
});
