import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    // invisible pricing logic — you control amount
    const BASE_PRICE = Number(process.env.UNIT_PRICE) || 550; // defaults to $5.50

    // count total quantity
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "LittleMen Bulk Order" },
            unit_amount: BASE_PRICE,
          },
          quantity: totalUnits,
        },
      ],
      mode: "payment",
      success_url: "https://littlemenwholesale.shop/success",
      cancel_url: "https://littlemenwholesale.shop/cancel",
      billing_address_collection: "auto",
      invoice_creation: { enabled: true },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
