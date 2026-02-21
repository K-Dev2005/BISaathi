import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Search } from 'lucide-react';
import { performOCR } from '../utils/ocr';

const ScanModal = ({ isOpen, onClose, onDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(true);
    setError(null);

    const code = await performOCR(file);
    setIsScanning(false);

    if (code) {
      onDetected(code);
      onClose();
    } else {
      setError("Could not read a CM/L code. Please try a clearer image or type manually.");
    }
  };

  const startCamera = async () => {
    setUseCamera(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied or not available.");
      setUseCamera(false);
    }
  };

  const captureAndScan = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setUseCamera(false);
    
    canvas.toBlob(async (blob) => {
      setPreviewUrl(URL.createObjectURL(blob));
      setIsScanning(true);
      const code = await performOCR(blob);
      setIsScanning(false);
      if (code) {
        onDetected(code);
        onClose();
      } else {
        setError("Could not read code from capture. Try again.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#021B79] mb-2">Scan Product Label</h2>
          <p className="text-gray-500 mb-8">Scan the CM/L code (e.g. CM/L-1234567) on the product packaging.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isScanning || useCamera}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#F5A623] hover:bg-[#F5A623]/5 transition-all group"
            >
              <Upload className="h-10 w-10 text-gray-400 group-hover:text-[#F5A623] mb-2" />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-[#021B79]">Upload Image</span>
            </button>

            <button
              onClick={startCamera}
              disabled={isScanning || useCamera}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#F5A623] hover:bg-[#F5A623]/5 transition-all group"
            >
              <Camera className="h-10 w-10 text-gray-400 group-hover:text-[#F5A623] mb-2" />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-[#021B79]">Use Camera</span>
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {useCamera && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-6">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button
                onClick={captureAndScan}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#F5A623] text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Capture & Scan</span>
              </button>
            </div>
          )}

          {isScanning && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-[#F5A623] animate-spin mb-4" />
              <p className="text-lg font-bold text-[#021B79]">Reading label...</p>
              <p className="text-sm text-gray-500">Extracting CM/L code using AI</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start space-x-2 mb-6">
              <span className="shrink-0">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {previewUrl && !isScanning && !useCamera && (
            <div className="relative rounded-xl overflow-hidden h-48 bg-gray-100 mb-6">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
