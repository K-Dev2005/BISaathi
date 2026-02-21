import React from 'react';
import { Shield, Search, Zap, FileText, CheckCircle, Info } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-[#021B79] text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-black mb-4">How It Works</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Understanding the BIS ecosystem and how you can help maintain the gold standard of safety.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-black text-[#021B79] mb-8">The Identification Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-6">
                ISI mark is a standards-compliance mark for industrial products in India since 1955. The mark certifies that a product conforms to an Indian standard (IS) developed by the Bureau of Indian Standards (BIS).
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#021B79]">7-digit CM/L Code</h4>
                    <p className="text-sm text-gray-500">Every valid license has a unique identification number.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#021B79]">IS Number</h4>
                    <p className="text-sm text-gray-500">Specifies the standard the product adheres to (e.g., IS: 1234).</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
               <div className="aspect-square bg-[#021B79]/5 rounded-xl flex items-center justify-center relative group overflow-hidden">
                  <div className="text-center">
                    <Shield className="h-24 w-24 text-[#021B79]/20 group-hover:scale-110 transition-transform duraiton-500" />
                    <p className="mt-4 text-[10px] font-black text-[#021B79]/40 uppercase tracking-widest">Mock ISI Diagram</p>
                  </div>
                  <div className="absolute top-4 left-4 p-2 bg-white rounded shadow-sm border border-gray-100 text-[10px] font-bold">IS: [Standard No]</div>
                  <div className="absolute bottom-4 right-4 p-2 bg-white rounded shadow-sm border border-gray-100 text-[10px] font-bold">CM/L: [7 Digits]</div>
               </div>
               <p className="text-[10px] text-center text-gray-400 mt-4 italic">Locate these marks on the bottom or back of packaging.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-[#021B79] mb-12 text-center">3 Steps to Quality</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
             { title: "Scan", icon: <Search />, desc: "Use the Verify page to enter or scan the CM/L code. Tesseract AI will extract text from your labels instantly." },
             { title: "Catch", icon: <Zap />, desc: "We check the live registry. If a product is expired, suspended, or not found, we alert you immediately." },
             { title: "Report", icon: <FileText />, desc: "File a complaint through our auto-generator. We capture your GPS location to help BIS officers take action." },
           ].map((s, i) => (
             <div key={i} className="text-center px-6">
                <div className="w-16 h-16 bg-[#021B79] text-[#F5A623] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl rotate-3 hover:rotate-0 transition-all">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-[#021B79] mb-4">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
             </div>
           ))}
        </div>

        <div className="bg-gray-50 rounded-3xl p-12">
          <h2 className="text-3xl font-black text-[#021B79] mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
             {[
               { q: "What if my product isn't found?", a: "If a CM/L code isn't in our registry, it's likely a fake ISI mark. You should report this immediately as it poses a safety risk." },
               { q: "What happens to my complaint?", a: "It goes to the respective BIS Regional Office. Officers review the evidence and may visit the location for enforcement." },
               { q: "When do I get the +100 bonus points?", a: "Once a BIS officer marks your complaint as 'Resolved', the points are automatically added to your profile." },
               { q: "Is registration mandatory?", a: "No, but unregistered users cannot save their progress or earn badges permanently. We recommend creating an account." },
             ].map((f, i) => (
               <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-[#021B79] mb-2">{f.q}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
