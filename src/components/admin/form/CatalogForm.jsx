import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export default function CatalogForm() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deposit, setDeposit] = useState('');
  const [price, setPrice] = useState('');
  
  // የቀን ማስገቢያ (በቀናት)
  const [deliveryDays, setDeliveryDays] = useState('');
  
  const [paymentDetail, setPaymentDetail] = useState(''); 
  const [measurements, setMeasurements] = useState({ chest: '', shoulder: '', length: '', sleeve: '', waist: '', trousersLength: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setPrice(product.price ? product.price.toString().replace(/[^0-9]/g, '') : '');
  };

  const remainingBalance = (Number(price) || 0) - (Number(deposit) || 0);

  // 👉 ቀኑን አሰልቶ ወደ ኢትዮጵያ አቆጣጠር (dd/mm/yy) የሚቀይር ብልጥ ፋንክሽን
  const getFormattedDeliveryDate = (days) => {
    if (!days || isNaN(days)) return '';
    const date = new Date();
    date.setDate(date.getDate() + Number(days)); 
    
    try {
      // ብሮውዘሩ ራሱ የኢትዮጵያን አቆጣጠር እንዲያሰላው ማዘዝ
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-ethiopic', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const parts = formatter.formatToParts(date);
      let d = '', m = '', y = '';
      
      parts.forEach(part => {
        if (part.type === 'day') d = part.value.padStart(2, '0');
        if (part.type === 'month') m = part.value.padStart(2, '0');
        if (part.type === 'year') y = part.value.slice(-2); // ለምሳሌ 2017 ከሆነ 17 ያደርገዋል
      });
      
      return `${d}/${m}/${y}`;
    } catch (error) {
      // ካልሰራ (ለማንኛውም) ወደ ተለመደው ይቀይራል
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = String(date.getFullYear()).slice(-2); 
      return `${d}/${m}/${y} (GC)`;
    }
  };

  const calculatedDate = getFormattedDeliveryDate(deliveryDays);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderCode = 'EYU-' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedOrderCode(orderCode); 
      
      let fullPriceDetail = price ? `${price} ብር` : 'ያልተገለጸ';
      if (deposit) {
        fullPriceDetail += ` (ቅድመ ክፍያ: ${deposit} ብር | ቀሪ: ${remainingBalance} ብር)`;
      }
      if (paymentDetail) {
        fullPriceDetail += ` - ማስታወሻ: ${paymentDetail}`;
      }

      const orderData = {
        order_code: orderCode, 
        customer_name: customerName, 
        phone: phone,
        product_name: `[የሱቅ ልብስ] ${selectedProduct.name}`,
        advance_payment: deposit ? `${deposit} ብር` : '0 ብር',
        price: fullPriceDetail,
        appointment_date: calculatedDate, // 👉 የተሰላው የኢትዮጵያ ቀን ወደ ዳታቤዝ ይገባል
        chest: measurements.chest,
        shoulder: measurements.shoulder,
        length: measurements.length,
        sleeve: measurements.sleeve,
        waist: measurements.waist,
        trousers_length: measurements.trousersLength, 
        status: 'ተረጋግጧል & ልኬት ገብቷል (Approved)'
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) {
        alert('❌ ዳታቤዝ ላይ ማስቀመጥ አልተቻለም: ' + error.message);
        return;
      }

      setShowSuccessModal(true);
      
    } catch (error) {
      alert('ስህተት ተፈጥሯል: ' + error.message);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <p className="text-sm font-bold text-blue-600 mb-6">👇 የትኛውን ልብስ ነው ያዘዙት? ከታች ይምረጡ</p>
        {loading ? <div className="text-center py-10 text-blue-600 font-bold">እየጫነ ነው...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} onClick={() => handleSelect(p)} className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-md transition">
                <img src={p.variants?.[0]?.images?.[0]} alt={p.name} className="h-32 w-full object-contain bg-gray-50 p-2" />
                <div className="p-3"><h3 className="font-bold text-xs text-gray-800 line-clamp-1">{p.name}</h3></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
          <div>
            <p className="text-xs text-blue-600 font-bold">የተመረጠው ልብስ:</p>
            <p className="text-lg font-black">{selectedProduct.name}</p>
          </div>
          <button type="button" onClick={() => setSelectedProduct(null)} className="text-sm text-red-500 font-bold hover:underline">ቀይር ✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ሙሉ ስም</label>
            <input type="text" placeholder="የደንበኛው ስም" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስልክ ቁጥር</label>
            <input type="text" placeholder="09..." required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስንት ቀን ይፈጃል? (በቀን)</label>
            <input 
              type="number" 
              placeholder="ለምሳሌ: 10" 
              required 
              value={deliveryDays} 
              onChange={(e) => setDeliveryDays(e.target.value)} 
              className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
            />
            {calculatedDate && (
              <p className="text-xs mt-2 font-bold text-orange-600">
                📅 የሚረከቡበት ቀን (በኢት): <span className="text-gray-900 font-extrabold">{calculatedDate}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-4">📐 ልኬቶች (Measurements)</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(measurements).map(key => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-600 mb-1 capitalize">{key}</label>
                <input type="text" placeholder="..." value={measurements[key]} onChange={(e) => setMeasurements({...measurements, [key]: e.target.value})} className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4">💳 የክፍያ መረጃ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">አጠቃላይ ዋጋ (ብር)</label>
              <input type="number" placeholder="አጠቃላይ ዋጋ..." required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">የተከፈለ ቅድመ ክፍያ (Deposit)</label>
              <input type="number" placeholder="የተከፈለው..." value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              
              {price && (
                <p className={`text-xs mt-2 font-bold ${remainingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {remainingBalance > 0 ? `ቀሪ ሂሳብ: ${remainingBalance} ብር` : 'ሂሳብ ሙሉ በሙሉ ተከፍሏል ✅'}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ተጨማሪ የክፍያ ማስታወሻ <span className="text-gray-400 font-normal">(አማራጭ)</span></label>
            <textarea placeholder="ስለ ክፍያው ሌላ የተለየ ነገር ካለ እዚህ ይጻፉ..." value={paymentDetail} onChange={(e) => setPaymentDetail(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition">
          ✅ ትዕዛዙን መዝግብ
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full transform transition-all scale-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">ተሳክቷል! 🎉</h2>
            <p className="text-gray-500 mb-5 text-sm font-medium">ትዕዛዙ በተሳካ ሁኔታ ተመዝግቧል</p>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
              <p className="text-xs text-blue-600 font-bold mb-1">የትዕዛዝ መለያ ቁጥር (ልብሱ ላይ ይጻፉ)</p>
              <p className="text-3xl font-black text-gray-900 tracking-wider">{generatedOrderCode}</p>
            </div>
            
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedProduct(null); 
                setCustomerName(''); 
                setPhone(''); 
                setDeliveryDays(''); 
                setDeposit(''); 
                setPrice(''); 
                setPaymentDetail(''); 
                setMeasurements({ chest: '', shoulder: '', length: '', sleeve: '', waist: '', trousersLength: '' });
                setGeneratedOrderCode('');
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              አሪፍ ነው!
            </button>
          </div>
        </div>
      )}
    </>
  );
}