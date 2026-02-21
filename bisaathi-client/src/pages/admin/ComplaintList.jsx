import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';
import api from '../../utils/api';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'All', issue_type: 'All', has_user: 'All' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/api/complaints?${query}`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.cml_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070D19] text-white p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2">Complaint Management</h1>
        <p className="text-gray-400">Review and resolve community-flagged violations</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search CM/L or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select 
            value={filters.issue_type}
            onChange={(e) => setFilters({...filters, issue_type: e.target.value})}
            className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Issues</option>
            <option value="not_found">Not Registered</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>

          <select 
            value={filters.has_user}
            onChange={(e) => setFilters({...filters, has_user: e.target.value})}
            className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Users</option>
            <option value="Logged-in user">Verified Users</option>
            <option value="Anonymous">Anonymous</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-white/10">
                  <th className="px-8 py-6">CM/L Code</th>
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Issue Type</th>
                  <th className="px-8 py-6">User</th>
                  <th className="px-8 py-6">Submitted At</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="7" className="px-8 py-6 h-16 bg-white/5 border-b border-white/5"></td>
                    </tr>
                  ))
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center text-gray-500 font-bold italic">No complaints found matching filters</td>
                  </tr>
                ) : filteredComplaints.map(c => (
                  <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 font-black text-blue-400">{c.cml_code}</td>
                    <td className="px-8 py-6">
                       <div className="font-bold">{c.product_name}</div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          c.issue_type === 'expired' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                          c.issue_type === 'suspended' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        }`}>
                          {c.issue_type}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="font-bold">{c.user_id?.name || 'Anonymous'}</div>
                       <div className="text-[10px] text-gray-500">{c.user_id?.email || 'Guest Session'}</div>
                    </td>
                    <td className="px-8 py-6 text-gray-400">
                       {new Date(c.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                       <span className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold w-fit ${
                          c.status === 'pending' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                          c.status === 'reviewing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          c.status === 'resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                       }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             c.status === 'pending' ? 'bg-slate-500' :
                             c.status === 'reviewing' ? 'bg-blue-500' :
                             c.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className="capitalize">{c.status}</span>
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <Link to={`/admin/complaints/${c._id}`} className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 transition-all border border-white/5">
                          <Eye className="h-4 w-4" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
         </div>
         
         <div className="p-8 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-500">
            <div>Showing {filteredComplaints.length} of {complaints.length} results</div>
            <div className="flex space-x-2">
               <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
               <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
               <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50" disabled><ChevronRight className="h-4 w-4" /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ComplaintList;
