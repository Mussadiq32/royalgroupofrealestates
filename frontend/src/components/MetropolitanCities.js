import React from 'react';
import styled from 'styled-components';

const CityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const CityCard = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CityImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CityInfo = styled.div`
  padding: 1rem;
  background: white;
`;

const CityName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const MetropolitanCities = () => {
  const cities = [
    {
      name: 'Pune',
      image: './images/pune.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1558383817-6a5d00b668b9?auto=format&fit=crop&w=800'
    },
    {
      name: 'Hyderabad',
      image: './images/hyderabad.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1563506644863-444710df1e03?auto=format&fit=crop&w=800'
    },
    {
      name: 'Ahmedabad',
      image: './images/ahmedabad.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800'
    }
  ];

  const handleImageError = (e, fallbackImage) => {
    e.target.src = fallbackImage;
  };

  return (
    <section>
      <h2>Metropolitan Cities</h2>
      <CityContainer>
        {cities.map((city) => (
          <CityCard key={city.name}>
            <CityImage
              src={city.image}
              alt={`${city.name} properties`}
              onError={(e) => handleImageError(e, city.fallbackImage)}
            />
            <CityInfo>
              <CityName>{city.name}</CityName>
            </CityInfo>
          </CityCard>
        ))}
      </CityContainer>
    </section>
  );
};

export default MetropolitanCities;