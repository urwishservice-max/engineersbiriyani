import { Request, Response } from 'express';
import Order from '../models/Order';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const BIRIYANI_PRICE = parseInt(process.env.BIRIYANI_PRICE || '250', 10);
const DELIVERY_CHARGE = parseInt(process.env.DELIVERY_CHARGE || '0', 10);

const generateOrderId = (): string => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BRY-${dateStr}-${randomStr}`;
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer, quantity, optionType = '1200g' } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      res.status(400).json({ success: false, message: 'Missing required customer details' });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({ success: false, message: 'Invalid quantity' });
      return;
    }

    let unitPrice = BIRIYANI_PRICE; // 250
    let weight = '1200g';
    let pieces = '3 to 4 piece';
    let breadHalwa = true;
    let productName = 'Chicken Biriyani (1200g)';

    if (optionType === '600g') {
      unitPrice = 130;
      weight = '600g';
      pieces = '2 piece';
      breadHalwa = false;
      productName = 'Chicken Biriyani (600g)';
    }

    const subtotal = unitPrice * quantity;
    const totalAmount = subtotal + DELIVERY_CHARGE;
    const orderId = generateOrderId();

    const newOrder = new Order({
      orderId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        landmark: customer.landmark,
        city: customer.city,
        pincode: customer.pincode,
      },
      product: {
        name: productName,
        quantity,
        unitPrice: unitPrice,
        totalAmount,
        weight,
        pieces,
        breadHalwa,
      },
      payment: {
        method: 'UPI',
        amount: totalAmount,
        status: 'PAYMENT_PENDING'
      },
      orderStatus: 'PAYMENT_PENDING'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong creating the order' });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Get Order Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong retrieving the order' });
  }
};

export const uploadPaymentScreenshot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No screenshot file provided' });
      return;
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (order.payment.status !== 'PAYMENT_PENDING' && order.payment.status !== 'PAYMENT_REJECTED') {
      res.status(400).json({ success: false, message: 'Payment screenshot already submitted for this order' });
      return;
    }

    // Process upload to Cloudinary (using dynamic import to avoid circular dependencies if any)
    const { uploadPaymentScreenshot: uploadToCloudinary } = await import('../services/cloudinary.service');
    const uploadResult = await uploadToCloudinary(req.file.path);

    if (!uploadResult) {
      res.status(500).json({ success: false, message: 'Failed to upload screenshot to storage' });
      return;
    }

    order.payment.screenshotUrl = uploadResult.url;
    order.payment.screenshotPublicId = uploadResult.publicId;
    order.payment.status = 'SCREENSHOT_UPLOADED';
    order.payment.uploadedAt = new Date();
    order.orderStatus = 'PAYMENT_VERIFICATION';

    await order.save();
    
    // Send WhatsApp Notification (Disabled - User preferred frontend wa.me link)
    // const { sendNewOrderNotification } = await import('../services/whatsapp.service');
    // await sendNewOrderNotification(order);

    res.status(200).json({
      success: true,
      message: 'Payment screenshot uploaded successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Upload Screenshot Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong uploading the screenshot' });
  }
};

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ success: false, message: 'Valid rating (1-5) is required' });
      return;
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (order.orderStatus !== 'DELIVERED') {
      res.status(400).json({ success: false, message: 'Feedback can only be submitted for delivered orders' });
      return;
    }

    if (order.feedback && order.feedback.rating) {
      res.status(400).json({ success: false, message: 'Feedback already submitted for this order' });
      return;
    }

    order.feedback = {
      rating,
      comment,
      isApproved: false,
      submittedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Submit Feedback Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong submitting feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    const ordersWithFeedback = await Order.find({ 
      'feedback.isApproved': true 
    }).sort({ 'feedback.submittedAt': -1 }).limit(10);
    
    res.status(200).json({
      success: true,
      data: ordersWithFeedback
    });
  } catch (error: any) {
    console.error('Get Feedbacks Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong retrieving feedbacks' });
  }
};
