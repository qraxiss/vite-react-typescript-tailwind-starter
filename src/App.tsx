import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const App: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const phoneNumber = '+905319158427';
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-black"></div>
      
      <div className="relative z-10 max-w-lg w-full space-y-16 text-center">
        {/* Logo */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-2xl inline-block transform hover:scale-105 transition-transform duration-300">
            <div className="relative group cursor-pointer">
              <div className="inline-flex items-baseline space-x-0.5">
                <span className="text-5xl font-black text-black">bi</span>
                <span className="text-5xl font-extralight text-gray-300">-</span>
                <span className="text-5xl font-black text-black">alo</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent ml-1">.de</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 delay-100"></div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-400 font-extralight tracking-widest uppercase">bi alo desen yeter</p>
        </div>

        {/* ALO Button - White style matching logo */}
        <div className="relative group">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-16 py-5 bg-white text-black font-black text-3xl tracking-wider uppercase rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Phone className="w-8 h-8 mr-4 relative z-10 group-hover:text-white transition-colors duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">ALO</span>
          </a>
          {/* Floating dots on hover */}
          <div className="absolute -top-3 -right-3 w-5 h-5 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500"></div>
          <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 delay-100"></div>
        </div>

        {/* Phone Number - Clean white box */}
        <div className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-lg inline-block">
          <p className="text-gray-300 text-lg font-mono tracking-wider">{phoneNumber}</p>
        </div>

        {/* Demo Button - Minimalist style */}
        <div className="pt-8 relative">
          <button
            onClick={() => setShowComingSoon(true)}
            onMouseLeave={() => setShowComingSoon(false)}
            className="relative px-10 py-3 text-white font-extralight tracking-[0.3em] uppercase border border-white/30 rounded-lg hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
          >
            DEMO
          </button>
          
          {/* Coming Soon Message */}
          {showComingSoon && (
            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 font-medium tracking-wide uppercase text-sm rounded-lg shadow-2xl">
              Coming Soon
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Minimal corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/20 rounded-tl-lg"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/20 rounded-br-lg"></div>
      
      {/* Floating gradient orbs for subtle effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default App;