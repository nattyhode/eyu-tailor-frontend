import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div 
      className="relative w-full h-screen flex flex-col justify-center items-center text-center text-white"
      style={{
        /* የጀርባ ፎቶ እና ከላይ የሚለበስ ጠቆር ያለ ቀለም (Overlay) ጽሁፉ ጎልቶ እንዲታይ */
        backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=2000')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl px-6 mt-16">
        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm md:text-base mb-4 block">
          Premium Custom Tailoring
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          የእርስዎን ምርጥ ገጽታ <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-100">
            በእኛ ዲዛይን ያግኙ
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl mb-10 text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          ለእርስዎ ብቻ የተሰፉ፣ ከየትኛውም ቦታ ጎልተው እንዲታዩ የሚያደርጉ ዘመናዊ እና የባህል ልብሶች ጥበብ።
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-4">
          <Link 
            to="/shop" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:-translate-y-1"
          >
            አሁን ይዘዙ (Book Layout)
          </Link>
          
          <Link 
            to="/offerings" 
            className="bg-transparent border-2 border-gray-300 hover:bg-white hover:text-gray-900 text-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:-translate-y-1"
          >
            ስራዎቻችንን ይመልከቱ
          </Link>
        </div>
      </div>
    </div>
  );
}