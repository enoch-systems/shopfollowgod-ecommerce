import React from 'react';

const whatsapp = 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776704/bcalxyyqwnisx5vrpxih.gif';

export default function WhatsAppFloat() {
  return (
    <div
      className="block fixed z-50"
      style={{ left: 20, bottom: 20 }}
    >
      <a
        href="https://wa.me/2349031161058?text=Reaching%20out%20from%20folllowgod%20website%20"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Open WhatsApp"
      >
        <img src={whatsapp} alt="WhatsApp" className="w-10 h-10" />
      </a>
    </div>
  );
}