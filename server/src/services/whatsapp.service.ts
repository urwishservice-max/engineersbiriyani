import axios from 'axios';
import dotenv from 'dotenv';
import { IOrder } from '../models/Order';

dotenv.config();

export const sendNewOrderNotification = async (order: IOrder): Promise<boolean> => {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;

    if (!phoneNumberId || !accessToken || !ownerNumber) {
      console.log('WhatsApp credentials not configured. Skipping notification.');
      return false;
    }

    const messageText = `
NEW BIRIYANI ORDER
Order ID: ${order.orderId}

Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Address:
${order.customer.address}
${order.customer.city} - ${order.customer.pincode}

${order.product.name} × ${order.product.quantity}
Total: ₹${order.payment.amount}
Payment Status: Screenshot Uploaded

Please verify payment in the admin dashboard.
Screenshot: ${order.payment.screenshotUrl}
    `.trim();

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: ownerNumber,
        type: 'text',
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('WhatsApp notification sent successfully:', response.data.messages[0].id);
    return true;
  } catch (error: any) {
    console.error('WhatsApp Notification Error:', error.response?.data || error.message);
    // Returning false but not throwing so it doesn't break the main flow
    return false;
  }
};
