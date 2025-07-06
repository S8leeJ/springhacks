import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Sign in failed');
    }

    setLoading(false);

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-pink-400">Welcome Back!</h1>

        <h2 className="text-1xl mb-6 text-center text-gray-500">Sign In to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Sign In
          </button>
          <p className="text-center text-gray-500">Don't have an account? <Link to="/signup" className="text-pink-400 hover:text-pink-500">Sign Up</Link></p>

        </form>
      </div>
    </div>
  );
} 