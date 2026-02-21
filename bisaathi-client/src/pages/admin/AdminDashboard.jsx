import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, 
  Award, Users, ChevronRight, TrendingUp 
} from 'lucide-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [byDay, setByDay] = useState([]);
  const [topValidators, setTopValidators] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, dRes, uRes, cRes] = await Promise.all([
          api.get('/api/complaints/stats'),
          api.get('/api/complaints/by-day'),
          api.get('/api/complaints/top-validators'),
          api.get('/api/complaints')
        ]);
        
        setStats(sRes.data);
        setByDay(dRes.data);
        setTopValidators(uRes.data);
        setRecentComplaints(cRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#070D19] flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  const issueTypeData = stats?.statsByType.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    count: s.count
  })) || [];

  const statusData = [
    { name: 'Pending', value: stats?.pending, color: '#94A3B8' },
    { name: 'Reviewing', value: stats?.reviewing, color: '#3B82F6' },
    { name: 'Resolved', value: stats?.resolved, color: '#10B981' },
    { name: 'Rejected', value: stats?.rejected, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-[#070D19] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Officer Dashboard</h1>
          <p className="text-gray-400">Bureau of Indian Standards — Central Monitoring System</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="text-right">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Status</p>
             <p className="text-green-500 font-black flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> SECURE</p>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        {[
          { label: 'Total Complaints', val: stats?.total, icon: <FileText />, color: 'blue' },
          { label: 'Pending Response', val: stats?.pending, icon: <Clock />, color: 'slate' },
          { label: 'Under Review', val: stats?.reviewing, icon: <AlertCircle />, color: 'yellow' },
          { label: 'Resolved', val: stats?.resolved, icon: <CheckCircle />, color: 'green' },
          { label: 'Rejected', val: stats?.rejected, icon: <XCircle />, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${s.color}-500/10 text-${s.color}-500`}>{s.icon}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight text-right">{s.label}</div>
             </div>
             <div className="text-3xl font-black">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8 flex items-center"><TrendingUp className="mr-2 text-blue-500" /> Complaints by Type</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8 flex items-center"><Clock className="mr-2 text-orange-500" /> Submission Volume (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#F5A623" strokeWidth={3} dot={{ fill: '#F5A623', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Recent Complaints</h3>
            <Link to="/admin/complaints" className="text-xs font-bold text-blue-400 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                 <tr className="text-left text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/10 pb-4">
                   <th className="pb-4">Product</th>
                   <th className="pb-4">Issue</th>
                   <th className="pb-4">Status</th>
                   <th className="pb-4">Action</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {recentComplaints.map(c => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="font-bold">{c.product_name}</div>
                        <div className="text-[10px] text-gray-500">{c.cml_code}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                          c.issue_type === 'expired' ? 'bg-amber-500/10 text-amber-500' : 
                          c.issue_type === 'suspended' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {c.issue_type}
                        </span>
                      </td>
                      <td className="py-4">
                         <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              c.status === 'pending' ? 'bg-slate-500' :
                              c.status === 'reviewing' ? 'bg-blue-500' :
                              c.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="capitalize">{c.status}</span>
                         </div>
                      </td>
                      <td className="py-4">
                         <Link to={`/admin/complaints/${c._id}`} className="text-blue-400 p-2 hover:bg-blue-400/10 rounded-lg transition-all">
                            <ChevronRight className="h-4 w-4" />
                         </Link>
                      </td>
                    </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>

        {/* Top Validators */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
           <h3 className="text-lg font-bold mb-8 flex items-center"><Award className="mr-2 text-yellow-500" /> Top Validators</h3>
           <div className="space-y-6">
              {topValidators.map((v, i) => (
                <div key={v._id} className="flex items-center justify-between">
                   <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mr-3 ${
                        i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'
                      }`}>{i + 1}</div>
                      <div>
                        <div className="font-bold text-sm">{v.name}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-black">{v.role}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-blue-400 font-black">{v.score}</div>
                      <div className="text-[8px] text-gray-600 uppercase font-bold">Points</div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-12 pt-8 border-t border-white/10 bg-gradient-to-b from-blue-500/5 to-transparent rounded-b-3xl -mx-8 -mb-8 p-8 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Community Incentives</p>
              <div className="text-2xl font-black">{stats?.resolved * 100} <span className="text-xs text-blue-500">PTS</span></div>
              <p className="text-xs text-gray-600 mt-1">Awarded via resolutions</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
