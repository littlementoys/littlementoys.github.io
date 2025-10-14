import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { items } = req.body;
  const lineItems = items.map(i => ({
    price_data: {
      currency: "usd",
      product_data: { name: i.name },
      unit_amount: 550, // $5.50
    },
    quantity: i.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://littlemenwholesale.shop/success",
    cancel_url: "https://littlemenwholesale.shop/cancel",
  });

  res.status(200).json({ url: session.url });
}
