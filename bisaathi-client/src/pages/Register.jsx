import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Register = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/user/register', formData);
      onLoginSuccess(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Shield className="h-10 w-10 text-[#021B79]" />
            <span className="text-3xl font-black text-[#021B79]">BIS Saathi</span>
          </Link>
          <h2 className="text-4xl font-black text-[#021B79]">Join the Mission</h2>
          <p className="text-gray-500 mt-2">Become a Quality Ambassador today</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-50 focus:border-[#021B79] outline-none transition-all font-bold text-[#021B79]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-50 focus:border-[#021B79] outline-none transition-all font-bold text-[#021B79]"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-50 focus:border-[#021B79] outline-none transition-all font-bold text-[#021B79]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-50 focus:border-[#021B79] outline-none transition-all font-bold text-[#021B79]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-50 text-red-600 rounded-xl text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#021B79] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-[#032a9e] transition-all flex items-center justify-center space-x-2 mt-4"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-bold">Already part of Saathi?</p>
            <Link to="/login" className="text-[#F5A623] font-black text-lg hover:underline mt-1 inline-block">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
