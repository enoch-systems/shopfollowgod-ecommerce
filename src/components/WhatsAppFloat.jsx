import React from 'react';

const whatsapp = 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776704/bcalxyyqwnisx5vrpxih.gif';

export default function WhatsAppFloat() {
  return (
    <div
      className="fixed z-50 mb-20"
      style={{ right: 20, bottom: 20 }}
    >
      <a
        href="https://wa.me/2349031161058?text=Reaching%20out%20from%20folllowgod%20website%20"
        target="_blank"
        rel="noopener noreferrer"
        className="block shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ lineHeight: 0 }}
        aria-label="Open WhatsApp"
      >
        <img 
          src={whatsapp} 
          alt="WhatsApp" 
          className="w-12 h-12 rounded-full shadow-xl ring-2 ring-green-500/30" 
        />
      </a>
    </div>
  );
}
