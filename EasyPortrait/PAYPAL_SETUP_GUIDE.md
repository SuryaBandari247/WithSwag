# PayPal Setup Guide - Production Ready

## Quick Setup (5 Minutes)

### Step 1: Create PayPal Business Account

1. Go to https://www.paypal.com/business
2. Click "Sign Up"
3. Choose "Business Account"
4. Complete registration
5. Verify email
6. Link your bank account

### Step 2: Get Your Live Client ID

1. Log in to your PayPal Business Account
2. Go to: https://www.paypal.com/businessmanage/credentials/apiAccess
3. Scroll to "REST API apps" section
4. Click "Create App"
5. Enter app name: "EasyPortrait"
6. Click "Create App"
7. **Copy your "Client ID"** (the long string starting with "A...")

### Step 3: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your WithSwag project
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Enter:
   - **Key**: `REACT_APP_PAYPAL_CLIENT_ID`
   - **Value**: Paste your Client ID
   - **Environment**: Production (or all)
6. Click "Save"

### Step 4: Redeploy

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Step 5: Test! 🎉

1. Go to your live site
2. Try to download a photo
3. Payment modal should show PayPal buttons
4. Complete a test payment
5. Check your PayPal account - money should appear!

## That's It!

You're now accepting real payments. Money goes directly to your PayPal account.

## Configuration Details

### Environment Variable

The app looks for: `REACT_APP_PAYPAL_CLIENT_ID`

- If not set: Shows "PayPal Not Configured" error
- If set: Shows PayPal payment buttons

### Where to Find Client ID

Direct link: https://www.paypal.com/businessmanage/credentials/apiAccess

Look for "REST API apps" section, then your app name.

## 💰 Pricing

Current pricing in `src/utils/payment.ts`:

```typescript
export const getPaymentAmount = (isCollage: boolean): number => {
  if (isCollage) {
    return 8.00; // €8.00 for collage
  }
  return 5.00; // €5.00 for single photo
};
```

## 🌍 Currency

Set to EUR (Euro). To change:

1. Update `PaymentModal.tsx`:
```typescript
<PayPalScriptProvider
  options={{
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD', // Change here
    intent: 'capture',
  }}
>
```

2. Update order creation:
```typescript
amount: {
  currency_code: 'USD', // Match above
  value: amount.toFixed(2),
}
```

3. Update UI symbols (€ → $, £, etc.)

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
/>
```

## 📊 Monitoring Payments

### In Your PayPal Account

1. Log in to https://www.paypal.com
2. Go to "Activity"
3. View all transactions
4. Export reports for accounting

### Transaction Details

Each payment includes:
- Customer email
- Amount paid (€5 or €8)
- Fees deducted
- Net amount received
- Transaction ID
- Date and time

## 🐛 Troubleshooting

### PayPal Buttons Don't Appear

- Check `REACT_APP_PAYPAL_CLIENT_ID` is set in Vercel
- Verify you redeployed after adding variable
- Check browser console for errors
- Make sure Client ID is correct (starts with "A...")

### Payment Fails

- Verify your PayPal account is active
- Check bank account is linked
- Ensure account is verified
- Check PayPal dashboard for issues

### "PayPal Not Configured" Error

- Environment variable not set
- Redeploy after setting variable
- Check variable name is exactly: `REACT_APP_PAYPAL_CLIENT_ID`

## 📝 Summary

✅ Create PayPal Business Account
✅ Get Live Client ID from PayPal
✅ Add to Vercel environment variables
✅ Redeploy
✅ Start receiving real payments!

Money goes directly to your PayPal account. Simple as that!
