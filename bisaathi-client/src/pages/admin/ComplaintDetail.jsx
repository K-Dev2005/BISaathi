import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, User, Shield, 
  ExternalLink, FileText, CheckCircle, Save, Loader2, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/api/complaints/${id}`);
        setComplaint(res.data);
        setStatus(res.data.status);
        setAdminNotes(res.data.admin_notes || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (status === 'resolved' && complaint.user_id && !complaint.points_awarded) {
      setShowConfirm(true);
      return;
    }
    await performUpdate();
  };

  const performUpdate = async () => {
    setUpdating(true);
    setShowConfirm(false);
    try {
      await api.patch(`/api/complaints/${id}`, { status, admin_notes: adminNotes });
      setComplaint({ ...complaint, status, admin_notes: adminNotes, points_awarded: status === 'resolved' ? true : complaint.points_awarded });
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#070D19] flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (!complaint) return <div className="p-8 text-white">Complaint not found.</div>;

  return (
    <div className="min-h-screen bg-[#070D19] text-white p-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin/complaints" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 space-y-4 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-black text-blue-400">{complaint.cml_code}</h1>
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                complaint.issue_type === 'expired' ? 'bg-amber-500/10 text-amber-500' : 
                complaint.issue_type === 'suspended' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
              }`}>
                {complaint.issue_type}
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Product: {complaint.product_name}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-xs font-black px-3 py-2 rounded-lg bg-white/5">
                <span className={`w-2 h-2 rounded-full ${
                  complaint.status === 'pending' ? 'bg-slate-500' :
                  complaint.status === 'reviewing' ? 'bg-blue-500' :
                  complaint.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="uppercase tracking-widest">{complaint.status}</span>
             </div>
             <div className="text-[10px] text-gray-500 uppercase font-black text-right">
                ID: {complaint._id.slice(-8)}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Complaint Info */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                 <h3 className="text-lg font-bold mb-6 flex items-center"><FileText className="mr-2 text-blue-400" /> Complaint Statement</h3>
                 <div className="bg-black/20 rounded-2xl p-6 text-gray-300 font-mono text-sm leading-loose border border-white/5">
                    {complaint.complaint_text}
                 </div>
              </div>

              {complaint.user_id && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                   <h3 className="text-lg font-bold mb-6 flex items-center"><User className="mr-2 text-purple-400" /> Reporter Information</h3>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 font-black text-xl">
                            {complaint.user_id.name.charAt(0)}
                         </div>
                         <div>
                            <div className="text-lg font-bold">{complaint.user_id.name}</div>
                            <div className="text-sm text-gray-500">{complaint.user_id.email}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-blue-400 font-black text-xl">{complaint.user_id.score} <span className="text-[10px] text-gray-500 uppercase">pts</span></div>
                         <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{complaint.user_id.role}</div>
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Right: Actions & Location */}
           <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                 <h3 className="text-lg font-bold mb-6 flex items-center"><Save className="mr-2 text-green-400" /> Officer Actions</h3>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Update Status</label>
                       <select 
                         value={status}
                         onChange={(e) => setStatus(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                       >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                       </select>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Internal Admin Notes</label>
                       <textarea 
                         value={adminNotes}
                         onChange={(e) => setAdminNotes(e.target.value)}
                         placeholder="Case findings and investigation details..."
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all h-32 resize-none"
                       />
                    </div>

                    <button
                      onClick={handleUpdateStatus}
                      disabled={updating}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Update Record</span>}
                    </button>
                    
                    {complaint.points_awarded && (
                       <div className="flex items-center justify-center space-x-2 text-green-400 text-xs font-bold uppercase tracking-widest py-2 bg-green-400/5 rounded-xl border border-green-400/20">
                          <CheckCircle className="h-4 w-4" />
                          <span>+100 Points Awarded</span>
                       </div>
                    )}
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                 <h3 className="text-lg font-bold mb-6 flex items-center"><MapPin className="mr-2 text-red-400" /> Sighting Location</h3>
                 {complaint.latitude ? (
                   <div className="space-y-4">
                      <div className="bg-black/40 rounded-2xl h-32 flex items-center justify-center border border-white/5 relative overflow-hidden">
                         <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm flex flex-col items-center justify-center">
                            <span className="text-xs uppercase font-black text-gray-500 mb-2">GPS COORDINATES</span>
                            <span className="font-bold text-sm tracking-widest">{complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}</span>
                         </div>
                      </div>
                      <a 
                        href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
                      >
                         <span>Open Google Maps</span>
                         <ExternalLink className="h-4 w-4" />
                      </a>
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500 italic text-sm">Location not provided</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                 <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-center mb-2">Award Bonus Points?</h3>
              <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                 Resolving this complaint will automatically award <span className="text-blue-400 font-bold">+100 pts</span> to <span className="text-white font-bold">{complaint.user_id.name}</span>. Confirm?
              </p>
              <div className="flex space-x-3">
                 <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold transition-all">Cancel</button>
                 <button onClick={performUpdate} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all">Confirm</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
