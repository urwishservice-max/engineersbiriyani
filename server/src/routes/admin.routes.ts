import { Router } from 'express';
import { loginAdmin } from '../controllers/admin.controller';
import { verifyAdmin } from '../middleware/auth';
import Order from '../models/Order';

const router = Router();

router.post('/login', loginAdmin);

// Protected routes below
router.use(verifyAdmin);

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

router.patch('/orders/:orderId/payment/verify', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    order.payment.status = 'PAYMENT_VERIFIED';
    order.payment.verifiedAt = new Date();
    order.orderStatus = 'CONFIRMED';
    
    await order.save();
    
    res.status(200).json({ success: true, message: 'Payment verified', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
});

router.patch('/orders/:orderId/payment/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    order.payment.status = 'PAYMENT_REJECTED';
    order.orderStatus = 'PAYMENT_PENDING';
    order.adminNote = reason || 'Payment rejected';
    
    await order.save();
    
    res.status(200).json({ success: true, message: 'Payment rejected', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject payment' });
  }
});

router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    order.orderStatus = status;
    await order.save();
    
    res.status(200).json({ success: true, message: 'Status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

router.get('/feedbacks', async (req, res) => {
  try {
    const ordersWithFeedback = await Order.find({ feedback: { $exists: true } })
                                          .sort({ 'feedback.submittedAt': -1 });
    res.status(200).json({ success: true, data: ordersWithFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
  }
});

router.patch('/orders/:orderId/feedback/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order || !order.feedback) {
       res.status(404).json({ success: false, message: 'Feedback not found' });
       return;
    }
    
    order.feedback.isApproved = isApproved;
    await order.save();
    
    res.status(200).json({ success: true, message: 'Feedback approval updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update feedback approval' });
  }
});

export default router;
