import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, Info, Loader2 } from 'lucide-react';
import products from '../data/products.json';
import ScanModal from '../components/ScanModal';
import StatusCard from '../components/StatusCard';
import { calculateAwardedPoints } from '../utils/points';

const Verify = ({ user, score, onUpdatePoints }) => {
  const [cmlCode, setCmlCode] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (codeToVerify) => {
    const code = codeToVerify || cmlCode;
    if (!code) return;

    setIsSearching(true);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      const foundProduct = products.find(p => p.cml_code.toLowerCase() === code.toLowerCase());
      
      const res = foundProduct || {
        cml_code: code.toUpperCase(),
        product_name: "Unknown Product",
        status: "not_found"
      };

      setResult(res);
      setIsSearching(false);

      // Award points
      const awards = calculateAwardedPoints({
        result: res.status,
        isFirstScan: score === 0,
        scanCount: (JSON.parse(localStorage.getItem('bis_scans')) || 0) + 1
      });

      onUpdatePoints(awards, res.status !== 'valid');
    }, 1000);
  };

  const handleDetected = (code) => {
    setCmlCode(code);
    handleVerify(code);
  };

  const fileComplaint = (product) => {
    navigate('/complaint', { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#021B79] pt-20 pb-40 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-4">Verify Certification</h1>
          <p className="text-white/70">Enter the CM/L code or scan the product label to check its validity.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto -mt-24 px-4 w-full pb-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter CM/L Code e.g. CM/L-1234567"
                  value={cmlCode}
                  onChange={(e) => setCmlCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#F5A623] outline-none transition-all font-bold text-[#021B79]"
                />
              </div>
              <button
                onClick={() => handleVerify()}
                disabled={isSearching}
                className="bg-[#021B79] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#032a9e] transition-all flex items-center justify-center space-x-2"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Verify</span>}
              </button>
              <button
                onClick={() => setShowScanModal(true)}
                className="bg-[#F5A623] text-[#021B79] px-6 py-4 rounded-xl font-bold hover:bg-[#FFB84D] transition-all flex items-center justify-center"
              >
                <Camera className="h-6 w-6" />
                <span className="ml-2 md:hidden lg:inline">Scan Label</span>
              </button>
            </div>

            <div className="mt-6 flex items-start space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Info className="h-4 w-4 text-gray-400 shrink-0" />
              <p>The CM/L (Certification Marks Licence) code is typically found near the ISI mark on the product packaging.</p>
            </div>
            
            {!user && (
              <div className="mt-6 bg-[#021B79]/5 border border-[#021B79]/10 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-[#021B79]">🔒 Login to save your points permanently</span>
                <button onClick={() => navigate('/login')} className="text-sm font-bold text-[#F5A623] hover:underline">Login Now</button>
              </div>
            )}
          </div>

          {result && <StatusCard result={result} onFileComplaint={fileComplaint} />}
        </div>

        {/* Recent Activity Mini-Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
           <h3 className="font-bold text-[#021B79] mb-4">Tips for Verification</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-[#F5A623] uppercase mb-1">Look for the Mark</p>
                <p className="text-sm text-gray-600">The ISI mark is always accompanied by a 7 or 10 digit CM/L code starting with CM/L.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-[#F5A623] uppercase mb-1">Check Quality</p>
                <p className="text-sm text-gray-600">Blurred marks or spelling mistakes on labels are clear signs of non-compliance.</p>
              </div>
           </div>
        </div>
      </div>

      <ScanModal 
        isOpen={showScanModal} 
        onClose={() => setShowScanModal(false)} 
        onDetected={handleDetected} 
      />
    </div>
  );
};

export default Verify;
