import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Properties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: '',
    propertyType: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  useEffect(() => {
    // Get filters from URL query parameters
    const params = new URLSearchParams(location.search);
    const urlFilters = {
      district: params.get('district') || '',
      propertyType: params.get('propertyType') || '',
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      bedrooms: params.get('bedrooms') || ''
    };
    setFilters(urlFilters);
    fetchProperties(urlFilters);
  }, [location.search]);

  const fetchProperties = async (currentFilters) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(currentFilters).toString();
      const response = await axios.get(`http://localhost:5000/api/properties?${queryString}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryString = new URLSearchParams(newFilters).toString();
    window.history.pushState(null, '', `${location.pathname}?${queryString}`);
    
    fetchProperties(newFilters);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">All Districts</option>
              <option value="Srinagar">Srinagar</option>
              <option value="Jammu">Jammu</option>
              {/* Add all districts */}
            </select>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">All Property Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="plot">Plot</option>
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">All Categories</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="homestay">Homestay</option>
              <option value="holiday-home">Holiday Home</option>
            </select>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="w-full p-3 border rounded"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="w-full p-3 border rounded"
            />
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No properties found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-primary font-bold text-xl">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {property.category === 'rent' ? '/month' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-gray-600">
                      {property.bedrooms && (
                        <span>{property.bedrooms} BHK</span>
                      )}
                      <span>{property.area} {property.areaUnit}</span>
                    </div>
                    <Link
                      to={`/properties/${property._id}`}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties; 