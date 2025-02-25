import React from 'react';

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Royal Group of Real Estates</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Royal Group of Real Estates is a leading real estate company with years of experience in the property market.
              We specialize in both residential and commercial properties across major metropolitan areas.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to provide exceptional real estate services to our clients, helping them find their perfect
              property while ensuring a smooth and transparent transaction process.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
              <li>Integrity and transparency in all our dealings</li>
              <li>Excellence in customer service</li>
              <li>Professional expertise and market knowledge</li>
              <li>Innovation in property solutions</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Experience</h2>
            <p className="text-lg text-gray-700 mb-6">
              With over a decade of experience in the real estate industry, we have successfully helped thousands of
              clients find their dream properties and make sound investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;