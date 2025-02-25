const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { auth, adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateProperty = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('district').trim().notEmpty().withMessage('District is required'),
  body('propertyType').trim().notEmpty().withMessage('Property type is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('area').isNumeric().withMessage('Area must be a number'),
  body('areaUnit').trim().notEmpty().withMessage('Area unit is required')
];

// Get all properties
router.get('/', async (req, res) => {
  try {
    const filters = {};
    
    // Apply filters from query parameters
    if (req.query.district) filters.district = req.query.district;
    if (req.query.propertyType) filters.propertyType = req.query.propertyType;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.minPrice) filters.price = { $gte: parseInt(req.query.minPrice) };
    if (req.query.maxPrice) {
      filters.price = { ...filters.price, $lte: parseInt(req.query.maxPrice) };
    }
    if (req.query.bedrooms) filters.bedrooms = parseInt(req.query.bedrooms);
    
    const properties = await Property.find(filters)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
      
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured properties
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('createdBy', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create property (admin only)
router.post('/', [adminAuth, validateProperty], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const property = new Property({
      ...req.body,
      createdBy: req.user._id
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update property (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save property (for authenticated users)
router.post('/:id/save', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!req.user.savedProperties.includes(property._id)) {
      req.user.savedProperties.push(property._id);
      await req.user.save();
    }

    res.json({ message: 'Property saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove saved property
router.delete('/:id/save', auth, async (req, res) => {
  try {
    req.user.savedProperties = req.user.savedProperties.filter(
      id => id.toString() !== req.params.id
    );
    await req.user.save();
    res.json({ message: 'Property removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 