import { Router } from 'express';
import { loginAdmin } from '../controllers/admin.controller';
import { verifyAdmin } from '../middleware/auth';
import Order from '../models/Order';
import { deletePaymentScreenshot, getStorageUsage } from '../services/cloudinary.service';
import { sendPaymentConfirmedNotification, sendOutForDeliveryNotification } from '../services/whatsapp.service';

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

// Delete Order
router.delete('/orders/:orderId', async (req, res) => {
  try {
    const id = req.params.orderId;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ orderId: id }, { _id: id }] }
      : { orderId: id };

    const order = await Order.findOne(query);
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    // Attempt to delete from cloudinary if there is a publicId
    if (order.payment?.screenshotPublicId) {
      await deletePaymentScreenshot(order.payment.screenshotPublicId);
    } else if (order.payment?.screenshotUrl) {
      // Fallback: Extract publicId from URL if it exists but wasn't saved explicitly
      const matches = order.payment.screenshotUrl.match(/\/v\d+\/(.+)\.[a-z]+$/i);
      if (matches && matches[1]) {
        await deletePaymentScreenshot(matches[1]);
      }
    }

    await Order.deleteOne({ _id: order._id });
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
});

// Send Payment Notification
router.post('/orders/:orderId/notify/payment', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    const sent = await sendPaymentConfirmedNotification(order);
    if (sent) {
      res.status(200).json({ success: true, message: 'Payment notification sent' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send WhatsApp message. Check API keys or template limits.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to trigger notification' });
  }
});

// Send Delivery Notification
router.post('/orders/:orderId/notify/delivery', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    
    const sent = await sendOutForDeliveryNotification(order);
    if (sent) {
      res.status(200).json({ success: true, message: 'Delivery notification sent' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send WhatsApp message. Check API keys or template limits.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to trigger notification' });
  }
});

// Get Storage Details
router.get('/storage', async (req, res) => {
  try {
    const usage = await getStorageUsage();
    if (!usage) {
       res.status(500).json({ success: false, message: 'Failed to fetch storage usage' });
       return;
    }
    res.status(200).json({ success: true, data: usage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching storage' });
  }
});

export default router;
