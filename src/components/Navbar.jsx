import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isHome = location.pathname === '/';

  // ዌብሳይቱ ላይ ወደ ታች (Scroll) ሲደረግ ለማወቅ
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ማንኛውም ሊንክ ሲነካ ሜኑአችን ራሱ በራስ-ሰር እንዲዘጋ
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 fixed top-0 left-0 ${
      isHome && !scrolled 
        ? 'bg-transparent text-white' 
        : 'bg-gray-900 text-white shadow-lg backdrop-blur-md bg-gray-900/95'
    }`}>
      <div className="flex justify-between items-center px-6 md:px-16 py-4 md:py-6">
        
        {/* በግራ በኩል: ሎጎ እና ስም (በጥቁር አኑል / Shadow የታገዘ) */}
        <div className="text-xl md:text-2xl font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <Link to="/" className="hover:text-blue-300 transition text-white">Eyu Tailor</Link>
        </div>
        
        {/* የኮምፒውተር (Desktop) ሜኑ */}
        <ul className="hidden md:flex space-x-8 text-sm font-semibold items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          <li><Link to="/" className="hover:text-blue-300 transition">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-300 transition">About</Link></li>
          <li><Link to="/offerings" className="hover:text-blue-300 transition">Offerings</Link></li>
          <li><Link to="/shop" className="hover:text-blue-300 transition">Shop</Link></li>
          <li><Link to="/contact" className="hover:text-blue-300 transition">Contact</Link></li>
        </ul>

        {/* የኮምፒውተር Button */}
        <div className="hidden md:block">
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-bold transition shadow-lg">
            Book Your Layout
          </Link>
        </div>

        {/* በስተቀኝ በኩል: የሞባይል ሜኑ መክፈቻ (3 ሰረዝ ☰) */}
        <button 
          className="md:hidden text-white focus:outline-none p-2.5 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700 active:scale-95 transition shadow-xl" 
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 3ቱ ሰረዝ ሲነካ ከታች በኩል ተዘርግቶ የሚወጣው የሞባይል ሜኑ (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-xl text-white absolute top-full left-0 w-full shadow-2xl flex flex-col space-y-3 px-6 py-6 animate-fade-in border-t border-gray-800 z-50">
          <Link to="/" className="hover:text-blue-400 font-semibold transition text-base py-2 border-b border-gray-800">Home</Link>
          <Link to="/about" className="hover:text-blue-400 font-semibold transition text-base py-2 border-b border-gray-800">About</Link>
          <Link to="/offerings" className="hover:text-blue-400 font-semibold transition text-base py-2 border-b border-gray-800">Offerings</Link>
          <Link to="/shop" className="hover:text-blue-400 font-semibold transition text-base py-2 border-b border-gray-800">Shop</Link>
          <Link to="/contact" className="hover:text-blue-400 font-semibold transition text-base py-2 border-b border-gray-800">Contact</Link>
          
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg text-center mt-2">
            Book Your Layout
          </Link>
        </div>
      )}
    </nav>
  );
}