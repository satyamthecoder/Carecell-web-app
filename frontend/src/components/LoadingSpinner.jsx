import React from 'react';

export default function LoadingSpinner({ fullScreen, size = 'md', text }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className={`${sizes.lg} border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4`} />
        <p className="text-gray-500 font-medium">लोड हो रहा है... Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className={`${sizes[size]} border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}
