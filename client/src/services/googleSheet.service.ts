// Google Sheets Webhook Dispatch Service
// Sends order records directly to the Google Apps Script Web App endpoint

export interface GoogleSheetOrderPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  location: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  screenshotUrl?: string;
  deliveryDate?: string;
  notes?: string;
}

export function getGoogleSheetWebhookUrl(): string {
  return (
    import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL ||
    localStorage.getItem('google_sheet_webhook_url') ||
    'https://script.google.com/macros/s/AKfycbzN8GM0meEkEtBr1FgDr7-A09sMrCz6Ghq4gdWQH9Y7PHW7qkE91NI3jsZTgnyJRL3t1g/exec'
  );
}

export function setGoogleSheetWebhookUrl(url: string): void {
  localStorage.setItem('google_sheet_webhook_url', url.trim());
}

export async function sendOrderToGoogleSheet(payload: GoogleSheetOrderPayload): Promise<boolean> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    console.info('Google Sheet Webhook URL not set. Skipping sheet sync.');
    return false;
  }

  try {
    // Google Apps Script Web App uses 302 redirects.
    // fetch with mode 'no-cors' and Content-Type 'text/plain' succeeds without CORS blocking.
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    console.log('Order successfully sent to Google Sheet:', payload.orderId);
    return true;
  } catch (err) {
    console.error('Failed to send order to Google Sheet:', err);
    return false;
  }
}
