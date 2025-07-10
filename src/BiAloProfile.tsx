import React from 'react';
import logoBg from './assets/logo-bg.png';

const BiAloProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <div className="space-y-8">
        {/* Profile Photo Version */}
        <div className="relative">
          <div className="w-64 h-64 bg-black rounded-full flex items-center justify-center shadow-2xl">
            <div className="bg-white px-6 py-3 rounded-lg">
              <div className="inline-flex items-baseline space-x-1">
                <span className="text-2xl font-black text-black">bi</span>
                <span className="text-2xl font-thin text-gray-400">-</span>
                <span className="text-2xl font-black text-black">alo</span>
                <span className="text-lg font-bold text-purple-600">.de</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">264x264px</p>
        </div>

        {/* Larger Version for Better Preview */}
        <div className="relative">
          <div className="w-96 h-96 bg-black rounded-full flex items-center justify-center shadow-2xl">
            <div className="bg-white px-8 py-4 rounded-xl">
              <div className="inline-flex items-baseline space-x-1">
                <span className="text-4xl font-black text-black">bi</span>
                <span className="text-4xl font-thin text-gray-400">-</span>
                <span className="text-4xl font-black text-black">alo</span>
                <span className="text-2xl font-bold text-purple-600">.de</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">384x384px</p>
        </div>

        {/* Square Version (for platforms that require square) */}
        <div className="relative">
          <div className="w-64 h-64 flex items-center justify-center shadow-2xl overflow-hidden relative">
            <img src={logoBg} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="bg-white px-4 py-2 transform -skew-x-12 relative z-10">
              <div className="inline-flex items-baseline space-x-1 transform skew-x-12">
                <span className="text-2xl font-black text-black">bi</span>
                <span className="text-2xl font-thin text-gray-400">-</span>
                <span className="text-2xl font-black text-black">alo</span>
                <span className="text-lg font-bold text-purple-600">.de</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">Square Version - Skewed</p>
        </div>

        {/* Alternative Skew Angles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="w-48 h-48 flex items-center justify-center shadow-2xl overflow-hidden relative">
              <img src={logoBg} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
              <div className="bg-white px-3 py-1.5 transform -skew-x-6 relative z-10">
                <div className="inline-flex items-baseline space-x-0.5 transform skew-x-6">
                  <span className="text-xl font-black text-black">bi</span>
                  <span className="text-xl font-thin text-gray-400">-</span>
                  <span className="text-xl font-black text-black">alo</span>
                  <span className="text-base font-bold text-purple-600">.de</span>
                </div>
              </div>
            </div>
            <p className="text-center mt-2 text-gray-600 text-sm">Less Skew</p>
          </div>

          <div className="relative">
            <div className="w-48 h-48 flex items-center justify-center shadow-2xl overflow-hidden relative">
              <img src={logoBg} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
              <div className="bg-white px-3 py-1.5 transform skew-x-12 relative z-10">
                <div className="inline-flex items-baseline space-x-0.5 transform -skew-x-12">
                  <span className="text-xl font-black text-black">bi</span>
                  <span className="text-xl font-thin text-gray-400">-</span>
                  <span className="text-xl font-black text-black">alo</span>
                  <span className="text-base font-bold text-purple-600">.de</span>
                </div>
              </div>
            </div>
            <p className="text-center mt-2 text-gray-600 text-sm">Opposite Skew</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiAloProfile;