const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cache for storing location results to avoid repeated API calls
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper function to clean and format location data
const formatLocationData = (osmData) => {
  return osmData.map(location => ({
    id: location.place_id,
    name: location.display_name,
    type: location.type,
    category: location.class,
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon),
    address: {
      road: location.address?.road,
      suburb: location.address?.suburb,
      city: location.address?.city || location.address?.town,
      state: location.address?.state,
      postcode: location.address?.postcode,
      country: location.address?.country
    },
    importance: location.importance,
    boundingBox: location.boundingbox
  }));
};

// Get real estate locations by city
router.get('/search', async (req, res) => {
  try {
    const { city, category } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        error: 'City parameter is required' 
      });
    }

    // Check cache first
    const cacheKey = `${city}-${category || 'all'}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return res.json(data);
      }
      cache.delete(cacheKey); // Clear expired cache
    }

    // Build search query
    let searchQuery = city;
    if (category) {
      searchQuery += ` ${category}`;
    }

    // Make request to Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchQuery,
        format: 'json',
        addressdetails: 1,
        limit: 50,
        countrycodes: 'in', // Limit to India
        featuretype: ['building', 'residential', 'commercial', 'retail']
      },
      headers: {
        'User-Agent': 'RoyalGroupRealEstates/1.0'
      }
    });

    // Filter and format the results
    const formattedData = formatLocationData(response.data);

    // Store in cache
    cache.set(cacheKey, {
      data: formattedData,
      timestamp: Date.now()
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      error: 'Error fetching location data',
      message: error.message
    });
  }
});

// Get location details by coordinates
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Both latitude and longitude parameters are required'
      });
    }

    // Check cache
    const cacheKey = `${lat}-${lon}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return res.json(data);
      }
      cache.delete(cacheKey);
    }

    // Make request to Nominatim reverse geocoding API
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
        zoom: 18
      },
      headers: {
        'User-Agent': 'RoyalGroupRealEstates/1.0'
      }
    });

    const locationData = {
      id: response.data.place_id,
      name: response.data.display_name,
      type: response.data.type,
      category: response.data.class,
      latitude: parseFloat(response.data.lat),
      longitude: parseFloat(response.data.lon),
      address: response.data.address,
      boundingBox: response.data.boundingbox
    };

    // Store in cache
    cache.set(cacheKey, {
      data: locationData,
      timestamp: Date.now()
    });

    res.json(locationData);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      error: 'Error fetching location details',
      message: error.message
    });
  }
});

// Get nearby properties
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 1000 } = req.query; // radius in meters

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Both latitude and longitude parameters are required'
      });
    }

    // Check cache
    const cacheKey = `nearby-${lat}-${lon}-${radius}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return res.json(data);
      }
      cache.delete(cacheKey);
    }

    // Make request to Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        addressdetails: 1,
        limit: 50,
        featuretype: ['building', 'residential', 'commercial', 'retail'],
        viewbox: [
          parseFloat(lon) - 0.01,
          parseFloat(lat) + 0.01,
          parseFloat(lon) + 0.01,
          parseFloat(lat) - 0.01
        ].join(','),
        bounded: 1
      },
      headers: {
        'User-Agent': 'RoyalGroupRealEstates/1.0'
      }
    });

    const formattedData = formatLocationData(response.data);

    // Store in cache
    cache.set(cacheKey, {
      data: formattedData,
      timestamp: Date.now()
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      error: 'Error fetching nearby locations',
      message: error.message
    });
  }
});

module.exports = router; 