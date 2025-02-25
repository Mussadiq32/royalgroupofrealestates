import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchForm from '../components/SearchForm';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties/featured');
      setFeaturedProperties(response.data);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6">
            Experience the Pinnacle of Real Estate
          </h1>
          <p className="text-xl mb-8">
            Discover your dream property in Jammu & Kashmir with world-class luxury and innovation
          </p>
          <SearchForm />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-xl">
                        ₹{property.price.toLocaleString()}
                      </span>
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
      </section>

      {/* CEO Message Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Message from Our CEO</h2>
          <div className="mb-8">
            <img
              src="https://iili.io/2mPtMsR.jpg"
              alt="CEO"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">Basit Mashkoor</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Royal Group of Real Estates. Since 2012, we have been committed to providing
            exceptional real estate services in Jammu & Kashmir. Our passion for excellence and
            dedication to customer satisfaction drives everything we do.
          </p>
        </div>
      </section>
      {/* Major Cities Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Major Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              'Mumbai', 'Delhi', 'Bangalore', 'Chandigarh', 'Chennai',
              'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur',
              'Srinagar', 'Jammu', 'Lucknow', 'Indore', 'Bhopal'
            ].map((city) => (
              <Link
                key={city}
                to={`/properties?city=${city}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 text-center group"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">{city}</h3>
                <p className="text-sm text-gray-500 mt-1">View Properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;