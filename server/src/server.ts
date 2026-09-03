import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database', error);
  process.exit(1);
});
