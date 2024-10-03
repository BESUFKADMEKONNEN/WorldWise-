import mongoose from 'mongoose';

// Define a schema for cities
const citySchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  emoji: String,
  date: { type: Date, default: Date.now },
  notes: String,
  lat: Number,
  lng: Number
});

// Export the City model
const City = mongoose.model('City', citySchema);
export default City;
