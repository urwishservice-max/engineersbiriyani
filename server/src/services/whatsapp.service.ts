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
Location: ${order.customer.location || 'N/A'}
Address:
${order.customer.address}
${order.customer.city} - ${order.customer.pincode}

${order.product.name} × ${order.product.quantity}
Total: ₹${order.payment.amount}
Delivery Date: ${process.env.DELIVERY_DATE || '27-Sep-26 (Sunday)'}
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

export const sendPaymentConfirmedNotification = async (order: IOrder): Promise<boolean> => {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const customerPhone = order.customer.phone.replace(/\D/g, ''); // Remove non-digits

    if (!phoneNumberId || !accessToken || !customerPhone) {
      console.log('WhatsApp credentials not configured or customer phone missing. Skipping notification.');
      return false;
    }

    // Ensure phone has country code (assume 91 for India if exactly 10 digits)
    const formattedPhone = customerPhone.length === 10 ? `91${customerPhone}` : customerPhone;

    const deliveryDate = process.env.DELIVERY_DATE || '27-Sep-26 (Sunday)';
    const messageText = `
Hi ${order.customer.name},

Your payment of ₹${order.payment.amount} for Order #${order.orderId} has been successfully VERIFIED! ✅

Your order is scheduled for delivery on ${deliveryDate}. We are preparing your ${order.product.name} with love. We'll let you know once it's out for delivery.

Thank you for choosing Engineer's Biriyani! 🍲
    `.trim();

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
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

    console.log('WhatsApp payment confirmed notification sent:', response.data.messages[0].id);
    return true;
  } catch (error: any) {
    console.error('WhatsApp Payment Notification Error:', error.response?.data || error.message);
    return false;
  }
};

export const sendOutForDeliveryNotification = async (order: IOrder): Promise<boolean> => {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const customerPhone = order.customer.phone.replace(/\D/g, ''); // Remove non-digits

    if (!phoneNumberId || !accessToken || !customerPhone) {
      console.log('WhatsApp credentials not configured or customer phone missing. Skipping notification.');
      return false;
    }

    // Ensure phone has country code (assume 91 for India if exactly 10 digits)
    const formattedPhone = customerPhone.length === 10 ? `91${customerPhone}` : customerPhone;

    const messageText = `
Hi ${order.customer.name},

Great news! Your Order #${order.orderId} is OUT FOR DELIVERY! 🚀

Our delivery partner is on the way to:
${order.customer.address}, ${order.customer.city}

Get ready to enjoy your piping hot biriyani! 🍽️
    `.trim();

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
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

    console.log('WhatsApp delivery notification sent:', response.data.messages[0].id);
    return true;
  } catch (error: any) {
    console.error('WhatsApp Delivery Notification Error:', error.response?.data || error.message);
    return false;
  }
};

