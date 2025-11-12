import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-md w-full space-y-8 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-3xl text-white font-bold">E</span>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
            EduMate
          </h2>
          <div className="mt-2 text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Login Portal
          </div>
          <p className="mt-4 text-purple-200 font-medium">
            Parent-Teacher Engagement System
          </p>
        </div>
        <form className="mt-8 space-y-6 backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden" onSubmit={handleSubmit}>
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl"></div>
          <div className="relative z-10">
            {error && (
              <div className="backdrop-blur-sm bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl font-medium">
                ⚠️ {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-purple-300 text-xl">📧</span>
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-3 py-4 backdrop-blur-sm bg-white/20 border border-white/30 placeholder-purple-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-sm font-medium"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-purple-300 text-xl">🔒</span>
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-3 py-4 backdrop-blur-sm bg-white/20 border border-white/30 placeholder-purple-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-sm font-medium"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-black rounded-xl text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>{loading ? '⏳' : '✨'}</span>
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                <span>{loading ? '' : '✨'}</span>
              </span>
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;