import dotenv from 'dotenv';
import { app } from './app.js';
import { configureCloudinary } from './config/cloudinary.js';
import { connectDB } from './config/db.js';

dotenv.config();
configureCloudinary();

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
