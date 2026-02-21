import React, { useState, useEffect } from 'react';

const PointsToast = ({ points, reason, onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500); // Wait for fade exit
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  const isBigGain = points >= 50;
  const isSaffronPulse = points === 100 && reason.includes("verified");

  return (
    <div className={`fixed top-5 right-5 z-[9999] transition-all duration-500 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`px-6 py-4 rounded-xl shadow-2xl border-2 flex flex-col items-end
        ${isSaffronPulse ? 'bg-[#FF9933] border-[#FF9933] animate-pulse' : 
          isBigGain ? 'bg-[#F5A623] border-[#F5A623]' : 'bg-[#021B79] border-white'} text-white`}>
        <div className="text-2xl font-black mb-1">+{points} pts 🎯</div>
        <div className="text-sm font-medium opacity-90">{reason}</div>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 p-5 space-y-3 z-[9999]">
      {toasts.map((toast, index) => (
        <PointsToast 
          key={toast.id} 
          points={toast.points} 
          reason={toast.reason} 
          onDone={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default PointsToast;
