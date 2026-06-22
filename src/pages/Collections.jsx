import React from "react";
import MountReveal from '../components/MountReveal'
import Footer from "../pages/Footer"

const Collections = () => {
  return (
    <>
      <MountReveal className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500">Collections</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Our Collections</h2>
            <p className="text-sm text-gray-600 mt-2">Hand-picked selections designed for style and comfort</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-8 bg-white text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">Track</div>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-8 bg-white text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">Pants</div>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-8 bg-white text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">Caps</div>
              <p className="text-sm text-gray-600">Browse our cap collection</p>
            </div>
          </div>
        </div>
      </MountReveal>
      <Footer />
    </>
  );
};

export default Collections;
