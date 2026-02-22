import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './utils/api';
import { getLocalData, saveLocalData, clearLocalData } from './utils/storage';
import { ToastContainer } from './components/PointsToast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Verify from './pages/Verify';
import Complaint from './pages/Complaint';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ComplaintList from './pages/admin/ComplaintList';
import ComplaintDetail from './pages/admin/ComplaintDetail';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(getLocalData());
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('bis_user_token');
    const adminToken = localStorage.getItem('bis_admin_token');

    if (token) {
      fetchUserProfile();
    } else if (adminToken) {
      setIsAdmin(true);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/api/auth/user/me');
      setUser(res.data);
      setUserData({
        score: res.data.score || 0,
        scans: res.data.scans || 0,
        violations: res.data.violations_caught || 0,
        complaints: res.data.complaints_filed || 0,
        badges: res.data.badges || [],
        missions: res.data.missions_done || []
      });
      // Update local storage with live data
      saveLocalData({
        score: res.data.score,
        scans: res.data.scans,
        violations: res.data.violations_caught,
        complaints: res.data.complaints_filed,
        badges: res.data.badges,
        missions: res.data.missions_done
      });
    } catch (err) {
      localStorage.removeItem('bis_user_token');
    }
  };

  const handleLoginSuccess = (token, userObj, type = 'user') => {
    if (type === 'admin') {
      localStorage.setItem('bis_admin_token', token);
      setIsAdmin(true);
    } else {
      localStorage.setItem('bis_user_token', token);
      setUser(userObj);
      mergeGuestData(userObj);
    }
  };

  const mergeGuestData = async (userObj) => {
    const guestData = getLocalData();
    // Simple merge: add guest points to user
    if (guestData.score > 0) {
      try {
        const res = await api.patch('/api/auth/user/me', {
          score: (userObj.score || 0) + guestData.score,
          scans: (userObj.scans || 0) + guestData.scans,
          violations_caught: (userObj.violations_caught || 0) + guestData.violations,
          complaints_filed: (userObj.complaints_filed || 0) + guestData.complaints,
          badges: [...new Set([...(userObj.badges || []), ...(guestData.badges || [])])],
          missions_done: [...new Set([...(userObj.missions_done || []), ...(guestData.missions || [])])]
        });
        const updated = {
          score: res.data.score,
          scans: res.data.scans,
          violations: res.data.violations_caught,
          complaints: res.data.complaints_filed,
          badges: res.data.badges,
          missions: res.data.missions_done
        };
        setUserData(updated);
        setUser(res.data);
        saveLocalData(updated);
      } catch (err) {
        console.error("Merge error:", err);
      }
    } else {
      setUserData({
        score: userObj.score || 0,
        scans: userObj.scans || 0,
        violations: userObj.violations_caught || 0,
        complaints: userObj.complaints_filed || 0,
        badges: userObj.badges || [],
        missions: userObj.missions_done || []
      });
    }
  };

  const handleLogout = () => {
    clearLocalData();
    setUser(null);
    setIsAdmin(false);
    setUserData(getLocalData());
    window.location.href = '/';
  };

  const addToast = (points, reason) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, points, reason }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updatePoints = async (awards, isViolation = false, isComplaint = false) => {
    let totalPoints = 0;
    awards.forEach(a => {
      totalPoints += a.points;
      addToast(a.points, a.reason);
    });

    const newData = {
      score: userData.score + totalPoints,
      scans: userData.scans + (isComplaint ? 0 : 1),
      violations: userData.violations + (isViolation ? 1 : 0),
      complaints: userData.complaints + (isComplaint ? 1 : 0),
      badges: [...userData.badges],
      missions: [...userData.missions]
    };

    // Mission checks
    if (newData.scans === 1 && !newData.missions.includes('first_verify')) {
      newData.missions.push('first_verify');
      newData.badges.push('first_scan');
    }
    if (isViolation && !newData.missions.includes('first_catch')) {
      newData.missions.push('first_catch');
      newData.badges.push('first_catch');
    }
    if (isComplaint && !newData.missions.includes('first_complaint')) {
      newData.missions.push('first_complaint');
      newData.badges.push('first_report');
    }
    if (newData.scans === 5 && !newData.missions.includes('five_verifies')) {
      newData.missions.push('five_verifies');
      newData.badges.push('five_scans');
    }
    if (newData.scans === 10 && !newData.missions.includes('ten_verifies')) {
      newData.missions.push('ten_verifies');
      newData.badges.push('ten_scans');
    }

    // Role checks
    if (newData.score >= 1000 && !newData.badges.includes('ambassador')) newData.badges.push('ambassador');
    else if (newData.score >= 500 && !newData.badges.includes('sr_inspector')) newData.badges.push('sr_inspector');
    else if (newData.score >= 150 && !newData.badges.includes('inspector')) newData.badges.push('inspector');

    setUserData(newData);
    saveLocalData(newData);

    if (user) {
      try {
        const res = await api.patch('/api/auth/user/me', {
          score: newData.score,
          scans: newData.scans,
          violations_caught: newData.violations,
          complaints_filed: newData.complaints,
          badges: newData.badges,
          missions_done: newData.missions
        });
        setUser(res.data);
      } catch (err) {
        console.error("Sync error:", err);
      }
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar score={userData.score} user={user} onLogout={handleLogout} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify user={user} score={userData.score} onUpdatePoints={updatePoints} />} />
            <Route path="/complaint" element={<Complaint user={user} onUpdatePoints={updatePoints} />} />
            <Route path="/dashboard" element={<Dashboard user={user} userData={userData} />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin onLoginSuccess={(t, a) => handleLoginSuccess(t, a, 'admin')} />} />
            
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<ComplaintList />} />
              <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
