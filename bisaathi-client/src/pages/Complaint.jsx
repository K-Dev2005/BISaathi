import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, FileText, Download, Copy, Send, CheckCircle, Award, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../utils/api';
import { POINTS, POINT_REASONS } from '../utils/points';

const Complaint = ({ user, onUpdatePoints }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [geo, setGeo] = useState({ lat: null, lng: null });
  const [timestamp] = useState(new Date().toLocaleString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/verify');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [product, navigate]);

  if (!product) return null;

  const complaintText = `To,
The Regional Officer,
Bureau of Indian Standards

Subject: Complaint regarding non-compliant product

I wish to report a product bearing CM/L Code ${product.cml_code} (${product.product_name}) 
that appears to be ${product.status === 'not_found' ? 'not registered' : product.status}.

Location of purchase/sighting: ${geo.lat ? `${geo.lat}, ${geo.lng}` : 'Waiting for GPS...'}
Date & Time: ${timestamp}

I request BIS to investigate this matter at the earliest.

Yours sincerely,
A Concerned Citizen`;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("BIS Saathi - Compliance Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 20, 30);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(complaintText, 170);
    doc.text(splitText, 20, 50);
    doc.save(`BIS_Complaint_${product.cml_code}.pdf`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    alert("Copied to clipboard!");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        cml_code: product.cml_code,
        product_name: product.product_name,
        issue_type: product.status === 'not_found' ? 'not_found' : product.status,
        complaint_text: complaintText,
        latitude: geo.lat,
        longitude: geo.lng,
        user_id: user?._id || user?.id || null
      };

      await api.post('/api/complaints', payload);
      setIsSubmitted(true);

      // Award points
      const awards = [
        { points: POINTS.SUBMIT_COMPLAINT, reason: POINT_REASONS.SUBMIT_COMPLAINT }
      ];
      
      const complaintCount = (JSON.parse(localStorage.getItem('bis_complaints')) || 0) + 1;
      if (complaintCount === 1) {
        awards.push({ points: POINTS.FIRST_COMPLAINT_BONUS, reason: POINT_REASONS.FIRST_COMPLAINT_BONUS });
      }

      onUpdatePoints(awards, false, true);

    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-[#021B79] mb-4">Complaint Submitted!</h2>
          <p className="text-gray-600 mb-8">
            You earned +50 pts. If BIS verifies this report, you'll earn +100 bonus pts! 🌟
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#021B79] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#032a9e] transition-all w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#021B79] mb-8">Generate Complaint Draft</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-[#021B79] flex items-center"><FileText className="h-4 w-4 mr-2" /> Complaint Body</span>
                <div className="flex space-x-2">
                  <button onClick={handleCopy} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600" title="Copy"><Copy className="h-4 w-4" /></button>
                  <button onClick={handleDownloadPDF} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600" title="Download PDF"><Download className="h-4 w-4" /></button>
                </div>
              </div>
              <textarea
                value={complaintText}
                readOnly
                className="w-full h-[400px] p-8 text-gray-700 bg-white leading-relaxed resize-none outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#021B79] mb-4">Verification Metadata</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Geo Location</p>
                    <p className="text-sm font-semibold">{geo.lat ? `${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : 'Detecting...'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Timestamp</p>
                    <p className="text-sm font-semibold">{timestamp}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-[#F5A623] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Target CM/L</p>
                    <p className="text-sm font-semibold text-[#021B79]">{product.cml_code}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
               <h3 className="font-bold text-green-800 mb-2 flex items-center">
                 <Award className="h-5 w-5 mr-2" /> Rewards Waiting
               </h3>
               <ul className="text-sm text-green-700 space-y-2">
                 <li>• +50 pts for submission</li>
                 <li>• +100 pts on BIS verification</li>
                 <li>• Quality Ambassador credit</li>
               </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#021B79] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-[#032a9e] transform transition-all hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-gray-400 px-4">By submitting, you agree that the details provided are accurate to your best knowledge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
