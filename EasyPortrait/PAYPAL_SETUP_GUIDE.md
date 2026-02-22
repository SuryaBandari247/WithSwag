# PayPal Integration Setup Guide

## ✅ What's Implemented

PayPal payment integration is fully implemented for EasyPortrait with:
- PayPal Buttons integration
- Euro (€) currency support
- €5.00 for single photos
- €8.00 for collages
- Test mode fallback for development

## 🚀 Quick Setup

### Step 1: Create PayPal Developer Account

1. Go to https://developer.paypal.com
2. Sign up or log in with your PayPal account
3. Navigate to "Dashboard"

### Step 2: Create an App

1. Click "Apps & Credentials" in the dashboard
2. Click "Create App"
3. Enter app name (e.g., "EasyPortrait")
4. Choose "Merchant" as app type
5. Click "Create App"

### Step 3: Get Your Client ID

After creating the app, you'll see:
- **Sandbox Client ID** (for testing)
- **Live Client ID** (for production)

Copy the appropriate Client ID.

### Step 4: Configure Environment Variable

#### For Local Development

Create a `.env` file in the EasyPortrait directory:

```bash
REACT_APP_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
```

#### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name**: `REACT_APP_PAYPAL_CLIENT_ID`
   - **Value**: Your PayPal Client ID
   - **Environment**: Production (or all environments)
4. Click "Save"
5. Redeploy your application

### Step 5: Test with Sandbox

1. Use the Sandbox Client ID in your `.env` file
2. Start the app: `npm run dev`
3. Complete the payment flow
4. Use PayPal sandbox test accounts to test payments

#### Create Test Accounts

1. Go to https://developer.paypal.com/dashboard/accounts
2. Click "Create Account"
3. Create a "Personal" account (buyer)
4. Create a "Business" account (seller)
5. Use these credentials to test payments

### Step 6: Go Live

1. Get your **Live Client ID** from PayPal dashboard
2. Update environment variable with Live Client ID
3. Test thoroughly in production
4. Monitor transactions in PayPal dashboard

## 🧪 Testing

### Test Mode (No PayPal Account)

If `REACT_APP_PAYPAL_CLIENT_ID` is not set or set to 'test':
- PayPal buttons won't load
- A "Simulate Payment" button appears
- Clicking it simulates a successful payment after 2 seconds
- Perfect for development without PayPal setup

### Sandbox Testing

With Sandbox Client ID configured:
1. PayPal buttons appear
2. Click "PayPal" button
3. Log in with sandbox test account
4. Complete payment
5. Returns to app with success

### Production Testing

With Live Client ID:
1. Use real PayPal account
2. Real money is charged
3. Transactions appear in your PayPal account

## 💰 Pricing Configuration

Current pricing is set in `src/utils/payment.ts`:

```typescript
export const getPaymentAmount = (isCollage: boolean, numPhotos?: number): number => {
  if (isCollage) {
    return 8.00; // €8.00 for collage
  }
  return 5.00; // €5.00 for single photo
};
```

To change pricing, edit these values.

## 🌍 Currency Configuration

Currently set to EUR (Euro). To change currency:

1. Update PayPal script provider in `PaymentModal.tsx`:
```typescript
<PayPalScriptProvider
  options={{
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD', // Change to USD, GBP, etc.
    intent: 'capture',
  }}
>
```

2. Update currency code in order creation:
```typescript
amount: {
  currency_code: 'USD', // Match the currency above
  value: amount.toFixed(2),
}
```

3. Update display symbols in UI (€ → $, £, etc.)

## 🔧 Customization

### Change Button Style

Edit `PaymentModal.tsx`:

```typescript
<PayPalButtons
  style={{
    layout: 'vertical',  // or 'horizontal'
    color: 'gold',       // 'gold', 'blue', 'silver', 'white', 'black'
    shape: 'rect',       // 'rect' or 'pill'
    label: 'paypal',     // 'paypal', 'checkout', 'buynow', 'pay'
  }}
  // ...
/>
```

### Add Additional Payment Methods

PayPal supports multiple payment methods:
- Credit/Debit cards
- PayPal balance
- Bank accounts
- Buy Now Pay Later (in supported regions)

These are automatically available through PayPal Checkout.

## 📊 Transaction Tracking

### In Session Storage

After successful payment:
- `easyportrait_payment_status`: 'paid'
- `easyportrait_payment_timestamp`: Unix timestamp
- `easyportrait_payment_id`: PayPal transaction ID

### In PayPal Dashboard

1. Log in to https://www.paypal.com
2. Go to "Activity"
3. View all transactions
4. Export reports for accounting

## 🔒 Security

### Best Practices

1. **Never expose secret keys** - Only use Client ID in frontend
2. **Validate on backend** - For production, verify transactions server-side
3. **Use HTTPS** - Required for PayPal integration
4. **Monitor transactions** - Check PayPal dashboard regularly
5. **Handle errors gracefully** - Show user-friendly error messages

### Backend Verification (Recommended for Production)

For production, add server-side verification:

1. Create API endpoint to verify PayPal transaction
2. After `onApprove`, send transaction ID to your backend
3. Backend calls PayPal API to verify transaction
4. Only then mark payment as successful

Example backend endpoint (Node.js):

```javascript
// api/verify-payment.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { orderId } = req.body;
  
  const response = await fetch(
    `https://api.paypal.com/v2/checkout/orders/${orderId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    }
  );
  
  const order = await response.json();
  
  if (order.status === 'COMPLETED') {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};
```

## 🐛 Troubleshooting

### PayPal Buttons Don't Appear

- Check that `REACT_APP_PAYPAL_CLIENT_ID` is set
- Verify Client ID is correct
- Check browser console for errors
- Ensure internet connection is active

### Payment Fails

- Check PayPal account has sufficient funds (sandbox)
- Verify currency is supported
- Check PayPal dashboard for error details
- Review browser console for error messages

### Test Mode Button Appears in Production

- Verify environment variable is set in Vercel
- Check that you're using the correct Client ID
- Redeploy after setting environment variable

### Currency Mismatch Error

- Ensure currency in script provider matches order creation
- Verify PayPal account supports the currency
- Check that amount is formatted correctly (2 decimal places)

## 📝 Environment Variables Summary

| Variable | Value | Environment |
|----------|-------|-------------|
| `REACT_APP_PAYPAL_CLIENT_ID` | Sandbox Client ID | Development |
| `REACT_APP_PAYPAL_CLIENT_ID` | Live Client ID | Production |

## 🎯 Next Steps

1. ✅ PayPal SDK installed
2. ✅ Payment modal updated
3. ✅ Test mode implemented
4. ⏳ Create PayPal developer account
5. ⏳ Get Client ID
6. ⏳ Set environment variable
7. ⏳ Test with sandbox
8. ⏳ Go live with production Client ID

## 📞 Support

- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Integration Guide: https://developer.paypal.com/docs/checkout/
- PayPal Support: https://www.paypal.com/us/smarthelp/contact-us

## 🎉 Ready to Accept Payments!

Once you've set up your PayPal Client ID, the payment system is ready to accept real payments!
