import React, { useState } from 'react';
import { PhoneCall, Briefcase } from 'lucide-react';
import bgImage from './assets/bg.png';

const App: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const phoneNumber = '+905319158427';
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
      </div>
      
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-16 text-left">
        {/* Modern Logo */}
        <div className="relative">
          <div className="inline-block">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 blur-2xl opacity-50 animate-pulse"></div>
            
            <div className="relative">
              {/* Main logo text */}
              <div className="flex items-baseline space-x-2">
                <span className="text-7xl md:text-8xl font-black text-white tracking-tight">bi</span>
                <span className="text-6xl md:text-7xl font-thin text-purple-400/50">—</span>
                <span className="text-7xl md:text-8xl font-black text-white tracking-tight">alo</span>
                <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent ml-2 animate-gradient">.de</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Buttons */}
        <div className="space-y-4">
          {/* ALO Button - Glassmorphism style */}
          <div className="relative group inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur-lg group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 transform transition-all duration-500 hover:scale-110 hover:bg-white/20"
            >
              <PhoneCall className="w-7 h-7" />
              
              {/* Animated dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
            </a>
          </div>

          {/* Portfolio Button - Outline style */}
          <div className="relative">
            <button
              onClick={() => window.location.href = '/profile'}
              className="relative group inline-flex items-center space-x-3 px-10 py-4 bg-transparent text-white rounded-xl border-2 border-purple-500/50 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-purple-400"
            >
              {/* Gradient fill on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <Briefcase className="relative w-5 h-5" />
              <span className="relative text-lg font-bold tracking-wider uppercase">PORTFOLIO</span>
            </button>
          </div>
        </div>

      </div>

      {/* Corner accents - minimal and modern */}
      <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-purple-600/50 to-transparent"></div>
      <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-purple-600/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-purple-600/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-purple-600/50 to-transparent"></div>
    </div>
  );
};

export default App;