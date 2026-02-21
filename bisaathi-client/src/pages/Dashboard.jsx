import React, { useState, useEffect } from 'react';
import { Award, Zap, Shield, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { getRoleFromPoints } from '../utils/points';
import { BadgeChip, MissionList } from '../components/BadgeChip';
import api from '../utils/api';

const Dashboard = ({ user, userData = {} }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = userData || {
    score: 0,
    scans: 0,
    violations_caught: 0,
    complaints_filed: 0,
    complaints_verified: 0,
    badges: [],
    missions_done: [],
    pending_notifications: []
  };

  const role = getRoleFromPoints(stats.score);
  const progress = role.next ? ((stats.score - role.threshold) / (role.next - role.threshold)) * 100 : 100;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/complaints/top-validators');
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-black text-[#021B79]">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-500">You are currently a <span className="font-bold text-[#F5A623]">{role.name}</span></p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Rank</p>
              <p className="text-xl font-black text-[#021B79]">#1,245</p>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role Badge</p>
              <span className="text-2xl">{role.badge}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {stats.pending_notifications?.filter(n => !n.seen).map((notif, i) => (
          <div key={i} className="mb-6 bg-[#F5A623] text-[#021B79] p-4 rounded-xl font-bold flex items-center justify-between animate-pulse">
            <div className="flex items-center">
              <span className="text-2xl mr-4">🌟</span>
              <p>{notif.message}</p>
            </div>
            <button className="text-xs uppercase tracking-widest bg-[#021B79] text-white px-3 py-1 rounded-lg">Got it</button>
          </div>
        ))}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Progress & Stats */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Score Card */}
            <div className="bg-[#021B79] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div>
                     <p className="text-white/60 font-bold text-sm uppercase tracking-widest mb-1">Total Impact Score</p>
                     <p className="text-6xl font-black">{stats.score} <span className="text-xl text-[#F5A623] opacity-80 uppercase tracking-tighter">pts</span></p>
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                     <TrendingUp className="h-8 w-8 text-[#F5A623]" />
                   </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Rank: {role.name}</span>
                    <span>{role.next ? `${role.next} pts for next rank` : 'Max Rank Reached!'}</span>
                  </div>
                  <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-[#F5A623] to-[#FFD200] h-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
                   {[
                     { label: "Scans", val: stats.scans, icon: <Zap className="h-4 w-4" /> },
                     { label: "Catches", val: stats.violations_caught, icon: <Shield className="h-4 w-4" /> },
                     { label: "Filed", val: stats.complaints_filed, icon: <CheckCircle className="h-4 w-4" /> },
                     { label: "Verified", val: stats.complaints_verified, icon: <Award className="h-4 w-4" /> },
                   ].map((s, i) => (
                     <div key={i} className="flex flex-col">
                       <span className="text-[10px] font-bold text-white/40 uppercase mb-1 flex items-center">{s.icon} <span className="ml-1">{s.label}</span></span>
                       <span className="text-xl font-bold">{s.val}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Missions List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#021B79] mb-6 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-[#F5A623]" /> Micro-Missions
              </h2>
              <MissionList missions={stats.missions_done} />
            </div>
          </div>

          {/* Right: Badges & Leaderboard */}
          <div className="space-y-8">
            
            {/* Badges Grid */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <h2 className="text-xl font-black text-[#021B79] mb-6">Earned Badges</h2>
               <div className="grid grid-cols-2 gap-3">
                 {['first_scan', 'first_report', 'first_catch', 'five_scans', 'ten_scans', 'bis_verified', 'inspector', 'sr_inspector', 'ambassador'].map(bt => (
                   <BadgeChip key={bt} type={bt} awarded={stats.badges?.includes(bt)} />
                 ))}
               </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
               <h2 className="text-xl font-black text-[#021B79] mb-6 flex items-center">
                 <Users className="h-5 w-5 mr-3 text-blue-500" /> Leaderboard
               </h2>
               <div className="space-y-4">
                 {loading ? (
                   <div className="animate-pulse flex flex-col space-y-4">
                     {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
                   </div>
                 ) : leaderboard.map((l, i) => (
                   <div key={l._id} className={`flex items-center justify-between p-3 rounded-xl ${l._id === user?.id ? 'bg-[#F5A623]/10 border border-[#F5A623]' : 'hover:bg-gray-50'}`}>
                     <div className="flex items-center space-x-3">
                       <span className={`w-6 h-6 flex items-center justify-center font-black text-xs rounded-full ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-orange-300 text-white' : 'text-gray-400'}`}>{i + 1}</span>
                       <div className="flex flex-col">
                         <span className="text-sm font-bold text-[#021B79]">{l.name}</span>
                         <span className="text-[10px] text-gray-400 uppercase font-black">{l.role}</span>
                       </div>
                     </div>
                     <div className="text-right">
                        <span className="text-sm font-black text-[#021B79]">{l.score}</span>
                        <span className="block text-[8px] font-bold text-[#F5A623] uppercase">pts</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Verified Catches Counter */}
            <div className="bg-green-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10 text-center">
                 <p className="text-white/60 font-bold text-xs uppercase mb-4">Quality Contribution</p>
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                 </div>
                 <h3 className="text-4xl font-black mb-1">{stats.complaints_verified}</h3>
                 <p className="font-bold text-white/90">Verified Catches</p>
                 <p className="text-[10px] mt-4 opacity-50">Complaints you filed that were verified and resolved by BIS officers.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
