const express = require('express')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const router = express.Router()

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Plan configuration (amounts in paise — ₹10 = 1000 paise)
// TODO: Change back to 19900 (₹199) and 99900 (₹999) after testing!
const PLAN_CONFIG = {
  'Pro Creator': { amount: 1000, currency: 'INR', description: 'TemplateAI Pro Creator — 1 Month' },
  'Agency':      { amount: 5000, currency: 'INR', description: 'TemplateAI Agency — 1 Month' },
}

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order for the selected plan.
 * Body: { planName: "Pro Creator" | "Agency" }
 */
router.post('/create-order', async (req, res) => {
  try {
    const { planName } = req.body

    if (!planName || !PLAN_CONFIG[planName]) {
      return res.status(400).json({ error: `Invalid plan: "${planName}". Valid plans are: ${Object.keys(PLAN_CONFIG).join(', ')}` })
    }

    const plan = PLAN_CONFIG[planName]

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `receipt_${planName.replace(/\s/g, '_')}_${Date.now()}`,
      notes: {
        plan: planName,
        description: plan.description,
      },
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay create-order error:', err)
    res.status(500).json({ error: 'Could not create payment order', details: err.message })
  }
})

/**
 * POST /api/payment/verify
 * Verifies the Razorpay payment signature to confirm authenticity.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName }
 */
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' })
    }

    // Generate the expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Signature mismatch.' })
    }

    // Payment is genuine!
    // In a full production app, you would save this to a database here.
    // For now, we send back success so the frontend can upgrade the user.
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month from now

    res.json({
      success: true,
      message: `Payment verified! Plan upgraded to ${planName}.`,
      paymentId: razorpay_payment_id,
      planName,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (err) {
    console.error('Razorpay verify error:', err)
    res.status(500).json({ error: 'Payment verification failed', details: err.message })
  }
})

module.exports = router
