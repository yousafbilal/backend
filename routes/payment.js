const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendEmail = require("../utils/email");

const router = express.Router();

// Payment API
router.post("/pay", async (req, res) => {
  const { email, amount, currency, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    await sendEmail(
      email,
      "Payment Confirmation",
      `Your payment of ${amount} ${currency} was successful!`
    );

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
