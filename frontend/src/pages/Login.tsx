import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/sales');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const { dark, toggle } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${dark ? 'bg-gray-950' : 'bg-gradient-to-br from-[#FF9D6F] to-[#FF7B47]'}`}>
      <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors ${dark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col items-center mb-8">
          <img
            src="/heencoffee.png"
            alt="Heen Coffee Logo"
            className="w-20 h-20 object-contain rounded-full mb-4 shadow"
            style={{ background: dark ? 'rgba(31,41,55,0.6)' : 'rgba(255,255,255,0.12)' }}
          />
          <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Heen Coffee</h1>
          <p className={`mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Chom Chao Center</p>
          <button
            type="button"
            onClick={toggle}
            className={`mt-4 text-xs px-3 py-2 rounded-lg transition-colors ${dark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent transition-colors ${dark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300'}`}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent transition-colors ${dark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300'}`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={`mt-8 pt-6 border-t ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-sm text-center ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Powered by Keimhean Dev</p>
        </div>
      </div>
    </div>
  );
}
