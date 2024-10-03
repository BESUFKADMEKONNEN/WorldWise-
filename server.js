import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import citiesRoutes from './api/cities.js';

dotenv.config();

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api/cities', citiesRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
