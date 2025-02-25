import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [propertiesRes, searchesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/me', config),
        axios.get('http://localhost:5000/api/auth/saved-searches', config)
      ]);

      setSavedProperties(propertiesRes.data.savedProperties || []);
      setSavedSearches(searchesRes.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}/save`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedProperties(savedProperties.filter(prop => prop._id !== propertyId));
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  const removeSavedSearch = async (searchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/saved-searches/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedSearches(savedSearches.filter(search => search._id !== searchId));
    } catch (error) {
      console.error('Error removing saved search:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>
        </div>

        {/* Saved Properties Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Saved Properties</h3>
          {savedProperties.length === 0 ? (
            <p className="text-gray-600">No saved properties yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <div key={property._id} className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold mb-2">{property.title}</h4>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-primary font-bold mb-4">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <div className="flex justify-between">
                    <Link
                      to={`/properties/${property._id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => removeSavedProperty(property._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Searches Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Saved Searches</h3>
          {savedSearches.length === 0 ? (
            <p className="text-gray-600">No saved searches yet.</p>
          ) : (
            <div className="space-y-4">
              {savedSearches.map((search) => (
                <div key={search._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold mb-2">
                        {search.district} - {search.propertyType}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {search.category && <span className="mr-4">Category: {search.category}</span>}
                        {search.minPrice && <span className="mr-4">Min Price: ₹{search.minPrice}</span>}
                        {search.maxPrice && <span className="mr-4">Max Price: ₹{search.maxPrice}</span>}
                        {search.bedrooms && <span>Bedrooms: {search.bedrooms}</span>}
                      </div>
                      {search.amenities && search.amenities.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Amenities: {search.amenities.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        to={`/properties?${new URLSearchParams(search).toString()}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        Search Again
                      </Link>
                      <button
                        onClick={() => removeSavedSearch(search._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 