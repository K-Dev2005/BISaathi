import React from 'react';

export const BadgeChip = ({ type, awarded = false }) => {
  const BADGES = {
    first_scan: { label: "First Scan", icon: "🔰", color: "bg-blue-100 text-blue-700" },
    first_report: { label: "First Report", icon: "📋", color: "bg-orange-100 text-orange-700" },
    first_catch: { label: "First Catch", icon: "🎯", color: "bg-red-100 text-red-700" },
    five_scans: { label: "5 Scans", icon: "⚡", color: "bg-yellow-100 text-yellow-700" },
    ten_scans: { label: "10 Scans", icon: "🔟", color: "bg-purple-100 text-purple-700" },
    bis_verified: { label: "BIS Verified", icon: "✅", color: "bg-green-100 text-green-700" },
    inspector: { label: "Inspector", icon: "🔍", color: "bg-indigo-100 text-indigo-700" },
    sr_inspector: { label: "Sr. Inspector", icon: "🕵️", color: "bg-slate-100 text-slate-700" },
    ambassador: { label: "Ambassador", icon: "🌟", color: "bg-amber-100 text-amber-700" },
  };

  const badge = BADGES[type] || { label: type, icon: "🏅", color: "bg-gray-100 text-gray-700" };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${awarded ? badge.color + ' border-current' : 'bg-gray-50 text-gray-300 border-gray-200 grayscale'}`}>
      <span className="text-base">{badge.icon}</span>
      <span>{badge.label}</span>
    </div>
  );
};

export const MissionList = ({ missions = [] }) => {
  const ALL_MISSIONS = [
    { id: 'first_verify', label: 'Verify your first product', pts: 10 },
    { id: 'first_catch', label: 'Catch your first violation', pts: 'varies' },
    { id: 'first_complaint', label: 'File your first complaint', pts: 25 },
    { id: 'five_verifies', label: 'Verify 5 products', pts: 15 },
    { id: 'ten_verifies', label: 'Verify 10 products', pts: 25 },
    { id: 'bis_verified', label: 'Get a complaint verified by BIS', pts: 100 },
  ];

  return (
    <div className="space-y-3">
      {ALL_MISSIONS.map(m => {
        const isDone = missions.includes(m.id);
        return (
          <div key={m.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isDone ? 'bg-green-50 border-green-100 opacity-60' : 'bg-white border-gray-100 hover:border-[#F5A623]'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {isDone && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={`text-sm font-semibold ${isDone ? 'text-green-800 line-through' : 'text-[#021B79]'}`}>{m.label}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              +{m.pts} pts
            </span>
          </div>
        );
      })}
    </div>
  );
};
