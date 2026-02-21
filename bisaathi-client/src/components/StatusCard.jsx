import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Ban, ArrowRight } from 'lucide-react';

const StatusCard = ({ result, onFileComplaint }) => {
  if (!result) return null;

  const config = {
    valid: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      title: 'Valid Product',
      points: '+5 pts awarded'
    },
    invalid: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: <XCircle className="h-10 w-10 text-red-500" />,
      title: 'Invalid / Fake Product',
      points: '+5 + +20 pts awarded'
    },
    expired: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
      title: 'Expired Certification',
      points: '+5 + +25 pts awarded'
    },
    suspended: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: <Ban className="h-10 w-10 text-red-500" />,
      title: 'Suspended Certification',
      points: '+5 + +35 pts awarded'
    }
  };

  const c = config[result.status] || config.invalid;

  return (
    <div className={`mt-8 p-6 rounded-2xl border-2 ${c.bg} ${c.border} shadow-sm overflow-hidden relative`}>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          {c.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`text-xl font-bold ${c.text}`}>{c.title}</h3>
            <span className="text-xs font-bold px-2 py-0.5 bg-white/50 rounded-full border border-current">{c.points}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
            <div className="flex justify-between border-b border-black/5 pb-1">
              <span className="text-gray-500">CM/L Code:</span>
              <span className="font-bold text-[#021B79]">{result.cml_code}</span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-1">
              <span className="text-gray-500">Product:</span>
              <span className="font-bold text-[#021B79]">{result.product_name}</span>
            </div>
            {result.manufacturer && (
              <div className="flex justify-between border-b border-black/5 pb-1">
                <span className="text-gray-500">Manufacturer:</span>
                <span className="font-bold text-[#021B79]">{result.manufacturer}</span>
              </div>
            )}
            {result.expiry && (
              <div className="flex justify-between border-b border-black/5 pb-1">
                <span className="text-gray-500">Expiry:</span>
                <span className="font-bold text-[#021B79]">{result.expiry}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {result.status !== 'valid' && (
        <div className="mt-6 pt-6 border-t border-black/5 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="max-w-md">
            <p className="font-bold text-[#021B79]">🎯 You caught a violation!</p>
            <p className="text-sm text-gray-600">File a formal complaint to earn +50 more pts and up to +100 pts if BIS verifies your report.</p>
          </div>
          <button
            onClick={() => onFileComplaint(result)}
            className="flex items-center justify-center space-x-2 bg-[#021B79] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#032a9e] transition-all shadow-lg"
          >
            <span>Generate Complaint</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
