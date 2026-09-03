# Engineer's Biriyani Online Ordering System

A complete production-ready online ordering and payment-verification system built for a single-product Biriyani business.

## Features

- **Customer Flow**: View product -> Select quantity -> Enter delivery details -> See QR code & Total -> Upload UPI payment screenshot -> Track order.
- **Admin Dashboard**: Secure login -> View all orders -> Filter by status -> View payment screenshots -> Manually verify or reject payments -> Update order progress (Preparing, Out for Delivery, Delivered).
- **Automated Notifications**: Sends WhatsApp notifications to the business owner when a customer uploads a payment screenshot (using WhatsApp Business Cloud API).
- **Image Storage**: Screenshots are safely uploaded to Cloudinary, keeping the database clean.

## Architecture

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide Icons, React Router.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB.
- **Storage**: Cloudinary (via Multer).
- **Security**: Helmet, Express Rate Limit, JWT Authentication, CORS.

## Folder Structure

```
biriyani-ordering-system/
├── client/                 # React frontend
│   ├── public/             # Static assets (QR code, images)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── layouts/        # Page layouts (Customer & Admin)
│       ├── lib/            # Utilities (shadcn/ui setup)
│       ├── pages/          # React route components
│       └── ...
└── server/                 # Node.js Express backend
    ├── src/
    │   ├── config/         # Database and app config
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Auth, Upload, Security middlewares
    │   ├── models/         # Mongoose schemas (Order)
    │   ├── routes/         # Express API routes
    │   └── services/       # Cloudinary and WhatsApp logic
    └── ...
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Meta Developer Account (for WhatsApp Business API)

### 2. Environment Variables
Create a `.env` file in the `server` directory (use `.env.example` as a template) and fill in your credentials:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/biriyani
JWT_SECRET=supersecretjwtkey

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
OWNER_WHATSAPP_NUMBER=your_number_with_country_code

# Admin Credentials
ADMIN_EMAIL=admin@biriyani.com
ADMIN_PASSWORD=admin123

# Business Info
UPI_ID=business@upi
BUSINESS_NAME="Engineer's Biriyani"
BIRIYANI_PRICE=250
DELIVERY_CHARGE=0
```

### 3. Local Development

**Backend Setup**
```bash
cd server
npm install
npm run dev
```

**Frontend Setup**
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.
Access the admin panel at `http://localhost:5173/admin/login`.

## Deployment

1. **Frontend**: Deploy `client/` to Vercel or Netlify. Set the build command to `npm run build` and output directory to `dist`. Ensure to set the `CLIENT_URL` env variable on the backend to match this deployed URL.
2. **Backend**: Deploy `server/` to Render, Heroku, or DigitalOcean. Set up all environment variables.
3. **Database**: Use MongoDB Atlas for a production database and update `MONGODB_URI`.
4. **Images**: Cloudinary will handle image storage securely.

## Troubleshooting

- **CORS Errors**: Ensure the `CLIENT_URL` in the backend `.env` exactly matches the URL where the frontend is hosted.
- **Image Upload Fails**: Verify Cloudinary credentials and ensure the `uploads` directory exists locally (it will be created automatically, but check permissions if it fails).
- **WhatsApp Not Sending**: Check if the WhatsApp access token has expired (Meta generates temporary 24hr tokens by default unless you configure a system user).
