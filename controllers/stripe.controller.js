import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentSheet = async (req, res) => {
  try {
    const {
      amount,      // Amount in cents
      currency,    // Currency code (usd)
      name,        // Customer name
      email,       // Customer email
      description, // Purchase description
      userId,      // User ID from backend
      metadata     // metadata for the payment
    } = req.body;

    // Validate the input
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Find or create a customer
    let customer;
    if (email) {
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];

        // Update customer details if name is provided
        if (name && customer.name !== name) {
          customer = await stripe.customers.update(customer.id, {
            name: name
          });
        }
      } else {
        // Create a new customer
        customer = await stripe.customers.create({
          email: email,
          name: name,
          metadata: {
            userId: userId,
            appUser: true
          }
        });
      }
    } else {
      // Create an anonymous customer if no email is provided
      customer = await stripe.customers.create({
        metadata: {
          userId: userId,
          anonymous: true
        }
      });
    }

    // Create ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      {apiVersion: '2025-03-31.basil'}
    );

    // Create payment intent with detailed information
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'usd',
      customer: customer.id,
      description: description || `Coin purchase`,
      receipt_email: email,
      metadata: {
        userId: userId,
        packageType: metadata?.packageType || 'custom',
        coins: metadata?.coins || (amount / 100).toString(),
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the payment details to the client
    res.json({
      success: true,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    // Verify the payment intent status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed'
      });
    }

    // Get the user ID from the payment metadata
    const userId = paymentIntent.metadata.userId;

    // Here you would typically update your database to add coins to the user's account
    // This is just a placeholder - implement your own logic
    // await db.users.updateCoins(userId, amount);

    res.json({
      success: true,
      message: `${amount} coins added to user account`,
      userId: userId
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};
