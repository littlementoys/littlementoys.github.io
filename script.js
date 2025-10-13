// Replace with your Stripe publishable key
const stripe = Stripe('pk_live_51SHb7QIgrOC6v5CQO85QjkYVnLInG9nEvnXFNpJ5TBoBmfJ3dYO7s1OtF1F16ioGIRDtOFZEQLvnwDXHz4dweSdh00wR260ysu');

let cart = [];
const WEEKLY_LIMIT = 100;

// Reset weekly limits if a new week starts
(function(){
  const lastWeek = localStorage.getItem('week') || 0;
  const currentWeek = (new Date()).getWeekNumber();
  if(currentWeek != lastWeek){
    localStorage.clear();
    localStorage.setItem('week', currentWeek);
  }
})();

// Helper to get week number
Date.prototype.getWeekNumber = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart)/86400000 + 1)/7));
};

// Render cart items
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.qty}`;
    cartItems.appendChild(li);
  });
}

// Add product button handler
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.parentElement;
    const name = card.querySelector('h3').innerText;
    const priceId = card.getAttribute('data-price-id');

    let storedQty = parseInt(localStorage.getItem(priceId)) || 0;
    if(storedQty + 10 > WEEKLY_LIMIT){
      alert(`Weekly limit of ${WEEKLY_LIMIT} units per product reached.`);
      return;
    }

    const existing = cart.find(i => i.priceId === priceId);
    if(existing) existing.qty += 10;
    else cart.push({name, priceId, qty:10});

    localStorage.setItem(priceId, storedQty + 10);
    renderCart();
  });
});

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', async () => {
  if(cart.length === 0){
    alert('Cart is empty');
    return;
  }

  const lineItems = cart.map(item => ({price: item.priceId, quantity: item.qty}));

  try {
    const {error} = await stripe.redirectToCheckout({
      lineItems,
      mode: 'payment',
      successUrl: window.location.href + '?success=true',
      cancelUrl: window.location.href + '?canceled=true'
    });
    if(error) console.error(error);
  } catch(e){
    console.error('Stripe checkout error:', e);
  }
});

