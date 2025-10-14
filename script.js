// Stripe public key setup (use your test or live publishable key)
const stripe = Stripe("pk_live_51SHb7QIgrOC6v5CQO85QjkYVnLInG9nEvnXFNpJ5TBoBmfJ3dYO7s1OtF1F16ioGIRDtOFZEQLvnwDXHz4dweSdh00wR260ysu");

const cart = [];
const cartList = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");

function renderCart() {
  cartList.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => {
      cart.splice(i, 1);
      renderCart();
    };
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", e => {
    const name = e.target.closest(".product-card").dataset.name;
    const existing = cart.find(p => p.name === name);
    if (existing) existing.quantity++;
    else cart.push({ name, quantity: 1 });
    renderCart();
  });
});

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) return alert("Your cart is empty!");

  const response = await fetch("https://littlemen.vercel.app/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart })
  });

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Checkout failed.");
  }
});
