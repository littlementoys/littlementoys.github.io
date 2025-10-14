import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: 2000, // example: $20.00 each
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "https://littlemenwholesale.shop/success",
      cancel_url: "https://littlemenwholesale.shop/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

