# Payment Integration Setup Guide

## Overview

EasyPortrait now includes payment integration for downloading passport photos. Users must pay before downloading their processed images.

## Current Implementation

### Payment Flow

1. User completes photo editing (crop, background, layout)
2. User clicks "Download PNG" or "Download JPG"
3. If payment not detected, payment modal appears
4. User completes payment
5. Download proceeds automatically

### Pricing

- **Single Photo**: €5.00
- **Collage**: €8.00 (flat rate)

Pricing is configured in `src/utils/payment.ts`:

```typescript
export const getPaymentAmount = (isCollage: boolean, numPhotos?: number): number => {
  if (isCollage) {
    return 8.00;
  }
  return 5.00;
};
```

### Payment Validity

Payments are valid for 24 hours after completion. This is stored in browser session storage.

## Integration with Real Payment Gateway

### Option 1: Stripe Checkout (Recommended)

Stripe Checkout is the easiest to integrate for static sites.

#### Setup Steps:

1. **Create Stripe Account**
   - Sign up at https://stripe.com
   - Get your API keys from Dashboard

2. **Install Stripe Package**
   ```bash
   npm install @stripe/stripe-js
   ```

3. **Create Backend Endpoint** (Required)
   
   You'll need a serverless function to create checkout sessions. With Vercel, create:
   
   `api/create-checkout-session.ts`:
   ```typescript
   import Stripe from 'stripe';
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2023-10-16',
   });
   
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
   
     const { amount, description } = req.body;
   
     try {
       const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
           {
             price_data: {
               currency: 'usd',
               product_data: {
                 name: 'Passport Photo Download',
                 description: description,
               },
               unit_amount: Math.round(amount * 100), // Convert to cents
             },
             quantity: 1,
           },
         ],
         mode: 'payment',
         success_url: `${req.headers.origin}/portrait/editor/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.headers.origin}/portrait/editor/cancel`,
       });
   
       res.status(200).json({ sessionId: session.id });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   }
   ```

4. **Update PaymentModal Component**
   
   Replace the simulated payment in `src/components/PaymentModal.tsx`:
   
   ```typescript
   import { loadStripe } from '@stripe/stripe-js';
   
   const stripePromise = loadStripe('pk_live_YOUR_PUBLISHABLE_KEY');
   
   const handlePayment = async () => {
     setIsProcessing(true);
     setError('');
   
     try {
       const response = await fetch('/api/create-checkout-session', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           amount,
           description: itemDescription,
         }),
       });
   
       const { sessionId } = await response.json();
       const stripe = await stripePromise;
       
       if (stripe) {
         const { error } = await stripe.redirectToCheckout({ sessionId });
         if (error) {
           setError(error.message || 'Payment failed');
         }
       }
     } catch (err) {
       setError('Payment failed. Please try again.');
     } finally {
       setIsProcessing(false);
     }
   };
   ```

5. **Add Environment Variables**
   
   In Vercel dashboard, add:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

6. **Handle Success Callback**
   
   Create a success page to verify payment and mark it in session storage.

### Option 2: PayPal

1. Install PayPal SDK:
   ```bash
   npm install @paypal/react-paypal-js
   ```

2. Wrap your app with PayPalScriptProvider

3. Use PayPalButtons component in PaymentModal

### Option 3: Razorpay (For India)

1. Install Razorpay:
   ```bash
   npm install razorpay
   ```

2. Follow similar pattern to Stripe with backend endpoint

## Testing

### Test Mode

The current implementation uses a simulated payment that:
- Waits 2 seconds
- Automatically succeeds
- Stores payment status in session storage

To test:
1. Complete photo editing
2. Click download
3. Payment modal appears
4. Click "Pay" button
5. After 2 seconds, download proceeds

### Production Testing

Before going live:
1. Use Stripe test mode keys
2. Test with test card: 4242 4242 4242 4242
3. Verify payment flow end-to-end
4. Test payment expiry (24 hours)
5. Test multiple downloads with single payment

## Security Considerations

1. **Never expose secret keys** in frontend code
2. **Always validate payments** on the backend
3. **Use HTTPS** in production
4. **Implement webhook verification** for payment confirmation
5. **Store payment records** in a database for audit trail

## Customization

### Change Pricing

Edit `src/utils/payment.ts`:

```typescript
export const getPaymentAmount = (isCollage: boolean, numPhotos?: number): number => {
  if (isCollage) {
    return 4.99; // Flat rate for collage
  }
  return 2.99; // New single photo price
};
```

### Change Payment Validity

Edit `src/utils/payment.ts`:

```typescript
const PAYMENT_VALIDITY_HOURS = 48; // 48 hours instead of 24
```

### Customize Payment Modal

Edit `src/components/PaymentModal.tsx` to change:
- Colors and styling
- Feature list
- Button text
- Error messages

## Files Modified

- `src/components/PaymentModal.tsx` - Payment modal UI
- `src/utils/payment.ts` - Payment utilities
- `src/pages/EditorPage.tsx` - Payment integration in editor
- `src/components/PhotoPreview.tsx` - Download handling

## Next Steps

1. Choose payment gateway (Stripe recommended)
2. Set up account and get API keys
3. Create backend endpoint for checkout session
4. Update PaymentModal with real integration
5. Add environment variables in Vercel
6. Test thoroughly in test mode
7. Switch to production keys
8. Monitor payments in gateway dashboard

## Support

For issues or questions:
- Stripe docs: https://stripe.com/docs/checkout/quickstart
- PayPal docs: https://developer.paypal.com/
- Razorpay docs: https://razorpay.com/docs/
