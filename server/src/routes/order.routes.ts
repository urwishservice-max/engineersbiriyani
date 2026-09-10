import { Router } from 'express';
import { createOrder, getOrder, getOrdersByPhone, uploadPaymentScreenshot, submitFeedback, getFeedbacks } from '../controllers/order.controller';
import { uploadScreenshot } from '../middleware/upload';

const router = Router();

router.post('/', createOrder);
router.get('/feedbacks', getFeedbacks); // Fetch approved feedbacks
router.get('/phone/:phone', getOrdersByPhone); // Lookup orders by phone number
router.get('/:orderId', getOrder);
router.post('/:orderId/payment-screenshot', uploadScreenshot.single('screenshot'), uploadPaymentScreenshot);
router.post('/:orderId/feedback', submitFeedback); // Submit feedback

export default router;
