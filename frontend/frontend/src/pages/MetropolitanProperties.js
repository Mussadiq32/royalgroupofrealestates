import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Sample data for metropolitan properties
const metropolitanProperties = [
  {
    id: 1,
    title: 'Luxury Apartment in South Mumbai',
    city: 'Mumbai',
    propertyType: 'Residential',
    price: 25000000,
    coordinates: { lat: 18.9387, lng: 72.8353 },
    imageUrl: '/assets/mumbai-apartment.jpg',
    description: 'Premium 3BHK apartment with sea view in Worli'
  },
  {
    id: 2,
    title: 'Commercial Space in Cyber City',
    city: 'Delhi',
    propertyType: 'Commercial',
    price: 35000000,
    coordinates: { lat: 28.4595, lng: 77.0266 },
    imageUrl: '/assets/delhi-office.jpg',
    description: 'Modern office space in Gurugram's prime location'
  },
  // Add more sample properties for other cities
];

const MetropolitanProperties = () => {
  const [properties, setProperties] = useState(metropolitanProperties);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Filter and sort properties
  useEffect(() => {
    let filteredProperties = [...metropolitanProperties];

    // Apply filters
    if (filters.city) {
      filteredProperties = filteredProperties.filter(p => p.city === filters.city);
    }
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    // Apply sorting
    filteredProperties.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setProperties(filteredProperties);
  }, [filters, sortBy]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Properties in Top Metropolitan Cities in India</h1>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>

            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            >
              <option value="">All Property Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>

            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            />

            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="mt-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto p-3 border rounded"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Listings */}
          <div className="space-y-6">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                onMouseEnter={() => setSelectedProperty(property)}
                onMouseLeave={() => setSelectedProperty(null)}
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={property.imageUrl}
                      alt={property.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                      {property.city} - {property.propertyType}
                    </div>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                      {property.title}
                    </h2>
                    <p className="mt-2 text-gray-500">{property.description}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="sticky top-24 h-[calc(100vh-6rem)]">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg shadow-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {properties.map(property => (
                <Marker
                  key={property.id}
                  position={[property.coordinates.lat, property.coordinates.lng]}
                  eventHandlers={{
                    mouseover: () => setSelectedProperty(property),
                    mouseout: () => setSelectedProperty(null)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p>{formatPrice(property.price)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetropolitanProperties;