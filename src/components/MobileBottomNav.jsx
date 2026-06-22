import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, ShoppingBag, Tag } from 'lucide-react';

export default function MobileBottomNav({ onTagsClick }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e) => {
      setIsMdUp(e.matches);
      if (e.matches) {
        // Creative hide animation on md+
        setIsVisible(false);
      } else {
        // Show on smaller screens
        setIsVisible(true);
      }
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 transition-all duration-500 ease-in-out ${
        isVisible && !isMdUp
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-full pointer-events-none'
      }`}
      style={{
        transformOrigin: 'bottom',
      }}
    >
      <div className="flex items-center justify-around py-2">
        <Link 
          to="/" 
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>
        <Link 
          to="/shop" 
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ShoppingBag size={20} />
          <span className="text-xs">Shop</span>
        </Link>
        <Link 
          to="/checkout" 
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 transition-colors relative"
        >
          <ShoppingCart size={20} />
          <span className="text-xs">Cart</span>
        </Link>
        <button 
          onClick={onTagsClick} 
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <Tag size={20} />
          <span className="text-xs">Tags</span>
        </button>
      </div>
    </nav>
  );
}