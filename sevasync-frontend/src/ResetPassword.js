import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added for safety
  const [status, setStatus] = useState({ type: '', msg: '' }); // Visual feedback
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    
    // 1. Validation check
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', msg: "❌ Passwords do not match!" });
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // 2. Hits the backend route you added
      await axios.post(`http://localhost:5000/api/auth/reset/${token}`, { password });
      
      setStatus({ type: 'success', msg: "✅ Password Updated! Redirecting to login..." });
      
      // 3. Wait 3 seconds so they can read the message, then go home
      setTimeout(() => {
        navigate('/'); 
      }, 3000);

    } catch (err) {
      setStatus({ type: 'error', msg: "❌ Reset failed. The link might be expired or invalid." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleReset} style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '10px' }}>Set New Password</h2>
        <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '14px' }}>Please enter and confirm your new secure password.</p>
        
        {/* Status Message Display */}
        {status.msg && (
          <div style={{ padding: '10px', borderRadius: '5px', marginBottom: '20px', backgroundColor: status.type === 'error' ? '#ff4d4d22' : '#2ecc7122', color: status.type === 'error' ? '#ff4d4d' : '#2ecc71', border: `1px solid ${status.type === 'error' ? '#ff4d4d' : '#2ecc71'}`, fontSize: '14px' }}>
            {status.msg}
          </div>
        )}

        <input 
          type="password" 
          placeholder="New Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', width: '100%', borderRadius: '5px', marginBottom: '15px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white', boxSizing: 'border-box' }}
          required 
        />

        <input 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ padding: '12px', width: '100%', borderRadius: '5px', marginBottom: '25px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white', boxSizing: 'border-box' }}
          required 
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ backgroundColor: loading ? '#444' : '#61dafb', color: 'black', padding: '12px', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px', transition: '0.3s' }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;