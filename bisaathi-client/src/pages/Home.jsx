import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Zap, CheckCircle, Search, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#021B79] text-white py-20 px-4 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F5A623]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 pt-10">
          <div className="inline-block border border-white/30 rounded-full px-4 py-1 mb-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">⚡ VERIFIED INDIAN QUALITY</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            Trust But <span className="text-[#F5A623] italic">Verify.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Every product you use should meet the gold standard of safety. 
            Join thousands of Quality Ambassadors in ensuring compliance across the nation.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/verify" 
              className="bg-[#F5A623] text-[#021B79] px-8 py-4 rounded-xl font-black text-lg hover:bg-white hover:text-[#021B79] transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Start Verifying Now
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              { icon: <Shield className="h-8 w-8 text-[#021B79]" />, num: "50,000+", label: "PRODUCTS MONITORED" },
              { icon: <Award className="h-8 w-8 text-[#021B79]" />, num: "12,400+", label: "ACTIVE VALIDATORS" },
              { icon: <Zap className="h-8 w-8 text-[#021B79]" />, num: "3,200+", label: "CASES RESOLVED" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl transform transition-all hover:scale-105">
                <div className="bg-[#021B79]/10 p-4 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-[#021B79] mb-1">{stat.num}</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How You Earn Points */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-[#021B79] mb-4">How You Earn Points</h2>
          <p className="text-gray-500">Your effort to maintain quality is rewarded at every step.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Scan any product", pts: "+5", icon: <Search className="h-6 w-6" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "Catch expired", pts: "+25", icon: <Zap className="h-6 w-6" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "Catch suspended", pts: "+35", icon: <Shield className="h-6 w-6" />, color: "bg-red-50 text-red-600 border-red-100" },
            { label: "File complaint", pts: "+50", icon: <FileText className="h-6 w-6" />, color: "bg-orange-50 text-orange-600 border-orange-100" },
            { label: "BIS verifies catch", pts: "+100", icon: <CheckCircle className="h-6 w-6" />, color: "bg-green-50 text-green-600 border-green-100" },
          ].map((item, i) => (
            <div key={i} className={`p-6 rounded-2xl border-2 ${item.color} flex flex-col items-center text-center shadow-sm`}>
              <div className="mb-4">{item.icon}</div>
              <div className="text-2xl font-black mb-1">{item.pts}</div>
              <div className="text-xs font-bold uppercase tracking-tight">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Step Flow */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Scan", desc: "Use your camera to scan the CM/L code on any ISI marked product." },
              { step: "02", title: "Catch", desc: "Our system instantly checks the BIS registry to verify the certification status." },
              { step: "03", title: "Report", desc: "If you find a violation, report it instantly and earn rewards once verified." },
            ].map((s, i) => (
              <div key={i} className="relative pt-12">
                <div className="text-8xl font-black text-gray-100 absolute top-0 left-0 z-0 select-none">{s.step}</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-[#021B79] mb-4">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#F5A623] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#021B79] mb-8">Ready to protect Indian Quality?</h2>
          <Link 
            to="/register" 
            className="bg-[#021B79] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#032a9e] transition-all inline-block shadow-2xl"
          >
            Create Your Account
          </Link>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link 
              to="/admin/login" 
              className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>BIS Officer Access</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-white/50 py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4 justify-center md:justify-start">
              <Shield className="h-6 w-6 text-[#F5A623]" />
              <span className="text-xl font-bold">BIS Saathi</span>
            </div>
            <p className="max-w-xs text-sm">Empowering citizens to verify quality and ensure consumer safety across India.</p>
          </div>
          <div className="flex space-x-12 text-sm font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/verify" className="hover:text-white transition-colors">Verify</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-white/5 text-center text-xs">
          © 2026 BIS Saathi Portal. Registered under Indian Quality Assurance Bureau.
        </div>
      </footer>
    </div>
  );
};

export default Home;
