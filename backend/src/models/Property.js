const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true,
    enum: [
      'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Budgam',
      'Ganderbal', 'Kupwara', 'Pulwama', 'Shopian', 'Kulgam',
      'Udhampur', 'Kathua', 'Rajouri', 'Poonch', 'Doda',
      'Kishtwar', 'Ramban', 'Reasi', 'Samba', 'Bandipora'
    ]
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'land', 'plot']
  },
  category: {
    type: String,
    required: true,
    enum: ['sale', 'rent', 'homestay', 'holiday-home']
  },
  bedrooms: {
    type: Number,
    required: function() {
      return this.propertyType === 'residential';
    }
  },
  bathrooms: {
    type: Number,
    required: function() {
      return this.propertyType === 'residential';
    }
  },
  area: {
    type: Number,
    required: true
  },
  areaUnit: {
    type: String,
    required: true,
    enum: ['sqft', 'sqm', 'acres', 'kanal']
  },
  amenities: [{
    type: String,
    enum: [
      'parking', 'gym', 'swimming_pool', 'security',
      'garden', 'play_area', 'power_backup', 'water_supply'
    ]
  }],
  images: [{
    type: String,
    required: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold', 'rented'],
    default: 'available'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
propertySchema.index({ location: 1, district: 1 });
propertySchema.index({ propertyType: 1, category: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ featured: 1 });

module.exports = mongoose.model('Property', propertySchema); 