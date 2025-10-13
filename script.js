const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
let cart = [];

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  cart.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.qty}`;
    cartItems.appendChild(li);
  });
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.parentElement;
    const name = card.querySelector('h3').innerText;
    const priceId = card.getAttribute('data-price-id');

    const existing = cart.find(i => i.priceId === priceId);
    if(existing) existing.qty += 10; // add 10 instead of 1
    else cart.push({name, priceId, qty:10}); // first add is 10

    renderCart();
  });
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  if(cart.length === 0) { 
    alert('Cart is empty'); 
    return; 
  }

  const lineItems = cart.map(item => ({price: item.priceId, quantity: item.qty}));

  stripe.redirectToCheckout({
    lineItems,
    mode: 'payment',
    successUrl: window.location.href + '?success=true',
    cancelUrl: window.location.href + '?canceled=true'
  });
});
