import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // set this in Vercel env vars

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Manually set the amount per unit — prices stay hidden to customers
    const UNIT_PRICE = 550; // in cents ($5.50)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: UNIT_PRICE,
        },
        quantity: item.quantity,
      })),
      success_url: "https://littlemenwholesale.shop/success",
      cancel_url: "https://littlemenwholesale.shop/cancel",
      metadata: {
        order_items: JSON.stringify(items), // 👈 lets you see what they bought
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
