import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // ሪኩዌስቱን Render ላይ ወዳለው አዲሱ ባክኤንድ ሰርቨራችን መላክ
      const response = await fetch('https://eyu-tailor-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ትክክል ከሆነ ወደ አድሚን ዳሽቦርድ ውሰደው
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        // የተሳሳተ መረጃ ከሆነ የኤረር መልዕክቱን አሳይ
        setErrorMsg(data.message || 'የተሳሳተ ዩዘርናም ወይም ፓስወርድ ነው! እባክዎ እንደገና ይሞክሩ።');
      }
    } catch (err) {
      setErrorMsg('ከሰርቨር ጋር መገናኘት አልተቻለም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
        
        {/* ሎጎ እና ርዕስ */}
        <div className="text-center mb-8">
          <span className="bg-blue-600 text-white font-black p-3 rounded-2xl text-xl inline-block shadow-lg mb-3">ET</span>
          <h1 className="text-2xl font-black text-white tracking-wider">EYU TAILOR ADMIN</h1>
          <p className="text-xs text-blue-400 font-medium mt-1">እባክዎ ለመግባት መረጃዎትን ያስገቡ</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold mb-6 text-center">
            {errorMsg}
          </div>
        )}

        {/* የሎጊን ፎርም */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="አድሚን ዩዘርናም ያስገቡ"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'በማጣራት ላይ...' : 'ግባ (Login)'}
          </button>
        </form>

      </div>
    </div>
  );
}