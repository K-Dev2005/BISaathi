import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/admin/login', { email, password });
      onLoginSuccess(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 mb-8 bg-white/5 p-4 rounded-3xl border border-white/10">
            <Shield className="h-10 w-10 text-blue-400" />
            <span className="text-3xl font-black text-white">BIS <span className="text-blue-400">Admin</span></span>
          </div>
          <h2 className="text-3xl font-black text-white">Officer Authentication</h2>
          <p className="text-gray-400 mt-2">Access the compliance management dashboard</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Officer Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border-2 border-white/10 focus:border-blue-500 outline-none transition-all font-bold text-white"
                  placeholder="admin@bis.gov.in"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border-2 border-white/10 focus:border-blue-500 outline-none transition-all font-bold text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <span>Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-gray-600 uppercase font-black tracking-widest leading-loose">
            This is a restricted access portal.<br/>All actions are logged and audited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
