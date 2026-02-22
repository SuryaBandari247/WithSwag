# Payment Integration - Quick Start

## ✅ What's Done

Payment integration is fully implemented and ready to test!

## 🎯 Quick Test

1. **Start the app**:
   ```bash
   cd withswag/EasyPortrait
   npm run dev
   ```

2. **Test the flow**:
   - Go to http://localhost:5173/portrait
   - Choose "Single Photo" or "Photo Collage"
   - Upload an image
   - Complete the editing steps
   - Click "Download PNG" or "Download JPG"
   - **Payment modal will appear!**
   - Click "Pay €5.00" (or €8.00 for collage)
   - Wait 2 seconds (simulated payment)
   - Download proceeds automatically

3. **Test payment persistence**:
   - Try downloading again
   - Should work without payment modal (24-hour validity)

## 💰 Current Pricing

- **Single Photo**: €5.00
- **Collage**: €8.00 (flat rate, any number of photos)

## 🔧 How to Change Pricing

Edit `src/utils/payment.ts`:

```typescript
export const getPaymentAmount = (isCollage: boolean, numPhotos?: number): number => {
  if (isCollage) {
    return 8.00;  // ← Collage price in euros
  }
  return 5.00;  // ← Single photo price in euros
};
```

## 🚀 Deploy to Production

### Current State (Test Mode)
- ✅ UI fully functional
- ✅ Payment flow working
- ✅ Simulated payment (no real money)
- ✅ Session storage for payment status

### To Go Live with Real Payments

1. **Read the setup guide**:
   ```bash
   cat PAYMENT_SETUP.md
   ```

2. **Choose payment provider** (Stripe recommended)

3. **Set up backend endpoint** (required for security)

4. **Update PaymentModal.tsx** with real integration

5. **Test with test cards**

6. **Deploy with production keys**

## 📁 Files to Know

- `src/components/PaymentModal.tsx` - Payment UI
- `src/utils/payment.ts` - Payment logic & pricing
- `src/pages/EditorPage.tsx` - Integration point
- `PAYMENT_SETUP.md` - Full integration guide
- `PAYMENT_IMPLEMENTATION_SUMMARY.md` - What was built

## 🎨 Customization

### Change Modal Colors

Edit `src/components/PaymentModal.tsx`:
- Line 48: Header gradient colors
- Line 89: Button gradient colors
- Line 82: Security badge colors

### Change Payment Validity

Edit `src/utils/payment.ts`:
```typescript
const PAYMENT_VALIDITY_HOURS = 24; // Change to 48, 72, etc.
```

### Add/Remove Features

Edit `src/components/PaymentModal.tsx`, lines 67-75:
```typescript
{[
  'High-resolution download (300 DPI)',
  'Both PNG and JPG formats',
  'Your custom feature here',  // ← Add more
].map((feature, i) => (
  // ...
))}
```

## 🐛 Troubleshooting

### Payment modal doesn't appear
- Check browser console for errors
- Verify `checkPaymentStatus()` is imported
- Clear session storage: `sessionStorage.clear()`

### Download doesn't work after payment
- Check `handlePaymentSuccess` is called
- Verify `pendingDownload` state is set
- Check browser console for errors

### Build fails
```bash
npm run build
```
Should complete without errors. If not, check TypeScript errors.

## 📞 Need Help?

1. Check `PAYMENT_SETUP.md` for detailed integration
2. Review `PAYMENT_IMPLEMENTATION_SUMMARY.md` for architecture
3. Look at code comments in `PaymentModal.tsx`

## ✨ Features Included

- ✅ Beautiful payment modal with gradient design
- ✅ Clear pricing display
- ✅ Loading states during payment
- ✅ Error handling
- ✅ Payment persistence (24 hours)
- ✅ Works for both single and collage modes
- ✅ Responsive design
- ✅ Security badge
- ✅ Feature list
- ✅ Professional UI matching WithSwag design system

## 🎉 Ready to Test!

The payment system is fully functional in test mode. Start the dev server and try it out!
