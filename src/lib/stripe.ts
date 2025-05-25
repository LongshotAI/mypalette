import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from 'stripe';

// Initialize Stripe client with environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe on the client side
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Server-side Stripe instance (for API routes)
export const initServerStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Use the latest API version
  });
};
