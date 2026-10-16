import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // ሊንክ ሲነካ ማውጫው ራሱን በራስ-ሰር እንዲዘጋ 
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          
          {/* 1. በግራ በኩል: ሎጎ እና ስም */}
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-black p-2 rounded-xl text-md shadow-md">ET</span>
            <div>
              <h1 className="font-extrabold text-base tracking-wider text-white">EYU TAILOR</h1>
              <p className="text-[10px] text-blue-400 font-medium">የአድሚን ፓነል</p>
            </div>
          </div>

          {/* 2. በስተቀኝ በኩል: የሞባይል ሜኑ መክፈቻ (3 ሰረዝ ☰) */}
          <div className="md:hidden">
            <button 
              className="text-gray-300 hover:text-white focus:outline-none p-2 bg-gray-800 rounded-xl border border-gray-700 active:scale-95 transition" 
              onClick={toggleMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 3. የኮምፒውተር (Desktop) ማውጫ ሊንኮች */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/admin" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              📊 ዳሽቦርድ
            </Link>
            <Link to="/admin/products" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin/products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              👕 ልብሶች
            </Link>
            <Link to="/admin/add" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin/add' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              📏 አዲስ ልኬት
            </Link>
            <Link to="/admin/orders" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin/orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              📦 ትዕዛዞች
            </Link>
            <Link to="/" className="bg-gray-800 hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-all ml-2">
              🌐 ዌብሳይት
            </Link>
          </div>
        </div>
      </nav>

      {/* ጥቁር ብዥታ (Overlay) - ከጀርባ ያለውን ፔጅ ለማጨለም */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity" 
          onClick={toggleMenu}
        ></div>
      )}

      {/* ከግራ በኩል ተንሸራትቶ የሚወጣው የሞባይል ሜኑ (Drawer) */}
      <div className={`md:hidden fixed inset-y-0 left-0 w-72 bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* የማውጫው ራስ (Header) */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-950/50">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-black p-2 rounded-xl text-sm">ET</span>
            <div>
              <span className="font-extrabold text-base text-white block">EYU TAILOR</span>
              <span className="text-[10px] text-blue-400 font-medium">የአድሚን ፓነል</span>
            </div>
          </div>
          <button onClick={toggleMenu} className="text-gray-400 hover:text-white p-2 rounded-xl bg-gray-800 border border-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* የሊንኮች ዝርዝር */}
        <div className="flex flex-col p-4 gap-2.5 overflow-y-auto flex-grow">
          <Link to="/admin" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-300 hover:bg-gray-800'}`}>
            <span className="text-lg">📊</span> ዳሽቦርድ
          </Link>

          <Link to="/admin/products" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/admin/products' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-300 hover:bg-gray-800'}`}>
            <span className="text-lg">👕</span> የሱቅ ልብሶች
          </Link>

          <Link to="/admin/add" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/admin/add' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-300 hover:bg-gray-800'}`}>
            <span className="text-lg">📏</span> አዲስ ልኬት
          </Link>

          <Link to="/admin/orders" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/admin/orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-300 hover:bg-gray-800'}`}>
            <span className="text-lg">📦</span> ትዕዛዞች
          </Link>
        </div>

        {/* ወደ ዌብሳይት መመለሻ */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/30">
          <Link to="/" className="flex items-center justify-center gap-2.5 w-full bg-gray-800 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-gray-700 px-4 py-3.5 rounded-xl text-sm font-bold transition-all">
            <span className="text-base">🌐</span> ወደ ዌብሳይት ተመለስ
          </Link>
        </div>

      </div>
    </>
  );
}