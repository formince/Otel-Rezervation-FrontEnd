import React from 'react';

const FontExamples = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Sans Fonts */}
      <div className="font-sans text-4xl font-bold">
        Viatora (Sans Default)
      </div>
      <div className="font-mono text-4xl font-bold">
        Viatora (Monospace)
      </div>
      <div className="font-serif text-4xl font-bold">
        Viatora (Serif)
      </div>
      
      {/* Modern Sans Alternatives */}
      <div className="text-4xl font-bold" style={{ fontFamily: 'system-ui' }}>
        Viatora (System UI)
      </div>
      <div className="text-4xl font-bold" style={{ fontFamily: '-apple-system' }}>
        Viatora (Apple System)
      </div>
      <div className="text-4xl font-bold" style={{ fontFamily: 'Segoe UI' }}>
        Viatora (Segoe UI)
      </div>
      <div className="text-4xl font-bold" style={{ fontFamily: 'Roboto' }}>
        Viatora (Roboto)
      </div>
      <div className="text-4xl font-bold" style={{ fontFamily: 'Inter' }}>
        Viatora (Inter)
      </div>

      {/* Decorative Styles */}
      <div className="text-4xl font-extrabold uppercase tracking-widest">
        Viatora (Wide Tracked)
      </div>
      <div className="text-4xl font-black uppercase tracking-tight">
        Viatora (Tight Tracked)
      </div>
      <div className="text-4xl font-extrabold italic">
        Viatora (Italic)
      </div>
      
      {/* With Different Gradients */}
      <div className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Viatora (Gradient 1)
      </div>
      <div className="text-4xl font-black bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-600 text-transparent bg-clip-text">
        Viatora (Gradient 2)
      </div>
      <div className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 text-transparent bg-clip-text">
        Viatora (Gradient 3)
      </div>
    </div>
  );
};

export default FontExamples;
