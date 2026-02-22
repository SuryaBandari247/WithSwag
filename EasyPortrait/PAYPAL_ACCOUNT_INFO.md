# PayPal Account & Payment Flow

## Where Does the Money Go?

All payments go directly to **YOUR PayPal Business Account** - the account you use to create the PayPal app in the Developer Dashboard.

## Setup Process

### Step 1: Create/Use PayPal Business Account

1. Go to https://www.paypal.com
2. Sign up for a **Business Account** (or upgrade your personal account)
3. Complete business verification
4. This is the account that will receive all payments

### Step 2: Create Developer App

1. Go to https://developer.paypal.com
2. Log in with your PayPal Business Account
3. Create an app in the Developer Dashboard
4. The app is linked to your business account

### Step 3: Get Client ID

When you create the app, you get:
- **Sandbox Client ID** - For testing (fake money)
- **Live Client ID** - For production (real money)

Both are linked to your PayPal Business Account.

## Payment Flow

```
Customer pays €5 or €8
        ↓
PayPal processes payment
        ↓
Money goes to YOUR PayPal Business Account
        ↓
You can withdraw to your bank account
```

## Important Notes

### Sandbox vs Live

**Sandbox (Testing)**:
- Uses fake money
- No real transactions
- For development and testing only
- Money doesn't actually move

**Live (Production)**:
- Uses real money
- Real transactions
- Money goes to your PayPal account
- You can withdraw to your bank

### PayPal Fees

PayPal charges fees for each transaction:
- **Standard rate**: 2.9% + €0.35 per transaction
- **For €5.00**: You receive ~€4.50 (after fees)
- **For €8.00**: You receive ~€7.42 (after fees)

Exact fees depend on:
- Your country
- Transaction volume
- PayPal account type

### Receiving Payments

1. **Instant**: Money appears in your PayPal balance immediately
2. **Withdraw**: Transfer to your bank account (1-3 business days)
3. **Use**: Spend directly from PayPal balance

## Verifying Your Account

To receive payments, you need:

1. **Email verified** ✓
2. **Bank account linked** ✓
3. **Business information completed** ✓
4. **Identity verified** (for larger amounts)

## Monitoring Payments

### PayPal Dashboard

1. Log in to https://www.paypal.com
2. Go to "Activity" or "Transactions"
3. See all payments received
4. Filter by date, amount, status
5. Export reports for accounting

### Transaction Details

Each payment shows:
- Customer email (if they paid with PayPal)
- Amount paid
- Fees deducted
- Net amount received
- Transaction ID
- Date and time
- Item description

## Tax & Accounting

### Important for Business

1. **Keep records**: PayPal provides transaction history
2. **Tax reporting**: You're responsible for reporting income
3. **Invoices**: PayPal can generate invoices
4. **Reports**: Export CSV/Excel for your accountant

### Annual Statements

PayPal provides:
- Monthly statements
- Annual summaries
- Tax forms (if applicable in your country)

## Security

### Your Account is Protected

- PayPal Seller Protection
- Fraud monitoring
- Dispute resolution
- Chargeback protection (with conditions)

### Best Practices

1. **Enable 2FA**: Two-factor authentication
2. **Monitor regularly**: Check transactions daily
3. **Respond to disputes**: Handle customer issues promptly
4. **Keep records**: Save transaction details

## Withdrawing Money

### To Bank Account

1. Go to PayPal dashboard
2. Click "Transfer Money"
3. Select "Transfer to Bank"
4. Enter amount
5. Confirm transfer
6. Money arrives in 1-3 business days

### Withdrawal Limits

- **Standard**: No limit (after verification)
- **Unverified**: Limited withdrawals
- **New accounts**: May have temporary holds

## Multiple Currencies

If you receive payments in EUR but your account is in another currency:
- PayPal automatically converts
- Conversion fees apply (~3-4%)
- You can hold multiple currencies in your PayPal account

## Customer Refunds

If you need to refund a customer:

1. Go to transaction in PayPal
2. Click "Refund"
3. Enter amount (full or partial)
4. Confirm refund
5. Money returns to customer
6. Fees are not refunded by PayPal

## Support

### PayPal Support

- Help Center: https://www.paypal.com/help
- Phone support: Available in most countries
- Email support: Through dashboard
- Community forums: https://www.paypal-community.com

### Common Questions

**Q: When do I receive the money?**
A: Immediately in your PayPal balance. Withdraw to bank takes 1-3 days.

**Q: Can customers pay without a PayPal account?**
A: Yes! They can pay with credit/debit cards through PayPal Checkout.

**Q: What if a customer disputes a payment?**
A: PayPal handles disputes. Respond promptly with evidence.

**Q: Are there monthly fees?**
A: No monthly fees. Only transaction fees when you receive payments.

**Q: Can I use a personal PayPal account?**
A: For business use, a Business Account is recommended and may be required.

## Summary

✅ Money goes to YOUR PayPal Business Account
✅ You control when to withdraw to your bank
✅ PayPal charges ~2.9% + €0.35 per transaction
✅ You can monitor all transactions in PayPal dashboard
✅ Customers can pay with PayPal or cards
✅ You're responsible for tax reporting

## Next Steps

1. Create/verify your PayPal Business Account
2. Link your bank account for withdrawals
3. Create app in Developer Dashboard
4. Get your Client ID
5. Add to environment variables
6. Start receiving payments!
