import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the contact form data to your backend
      console.log('Contact form submitted:', contactForm);
      setShowContactForm(false);
      alert('Thank you for your inquiry. We will contact you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProperty = async () => {
    try {
      if (!user) {
        alert('Please login to save properties');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/properties/${id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('Property saved successfully');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold">Property not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96">
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      activeImage === index ? 'bg-primary' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-xl text-gray-600">{property.location}, {property.district}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹{property.price.toLocaleString()}
                  {property.category === 'rent' && <span className="text-sm text-gray-500">/month</span>}
                </div>
                <button
                  onClick={handleSaveProperty}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-300"
                >
                  Save Property
                </button>
              </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {property.bedrooms && (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <span className="block font-semibold">{property.bedrooms} BHK</span>
                  <span className="text-gray-600">Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <span className="block font-semibold">{property.bathrooms}</span>
                  <span className="text-gray-600">Bathrooms</span>
                </div>
              )}
              <div className="text-center p-4 bg-gray-50 rounded">
                <span className="block font-semibold">{property.area}</span>
                <span className="text-gray-600">{property.areaUnit}</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <span className="block font-semibold">{property.propertyType}</span>
                <span className="text-gray-600">Property Type</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600 capitalize">
                        {amenity.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="mt-8">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300"
              >
                Contact Agent
              </button>
              {showContactForm && (
                <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded"
                      rows="4"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 