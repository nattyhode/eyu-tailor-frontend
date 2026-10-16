import { useState } from 'react';
import { supabase } from '../../../supabaseClient';

export default function AlterationForm() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState('');
  
  // 👉 አዲሱ የቀን ማስገቢያ (በቀናት)
  const [deliveryDays, setDeliveryDays] = useState('');
  
  // የማስተካከያ ዝርዝር
  const [clothingName, setClothingName] = useState('');
  const [alterationNote, setAlterationNote] = useState('');
  const [alterationImage, setAlterationImage] = useState(null);
  
  // የክፍያ መረጃዎች
  const [deposit, setDeposit] = useState('');
  const [price, setPrice] = useState('');
  const [paymentDetail, setPaymentDetail] = useState('');
  
  const [measurements, setMeasurements] = useState({ chest: '', shoulder: '', length: '', sleeve: '', waist: '', trousersLength: '' });

  // ቀሪ ሂሳብ ማስሊያ
  const remainingBalance = (Number(price) || 0) - (Number(deposit) || 0);

  // ፎቶውን ወደ ቴክስት (Base64) ለመቀየር
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // 👉 ቀኑን አሰልቶ ወደ ኢትዮጵያ አቆጣጠር (dd/mm/yy) የሚቀይር ፋንክሽን
  const getFormattedDeliveryDate = (days) => {
    if (!days || isNaN(days)) return '';
    const date = new Date();
    date.setDate(date.getDate() + Number(days)); 
    
    try {
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
        if (part.type === 'year') y = part.value.slice(-2); 
      });
      
      return `${d}/${m}/${y}`;
    } catch (error) {
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
      let imageUrl = '';
      if (alterationImage) {
        imageUrl = await convertFileToBase64(alterationImage);
      }

      // ኮዱን መፍጠር እና ለፖፕ-አፑ መስጠት
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
        product_name: `[ማስተካከያ] ${clothingName} - ${alterationNote}`,
        advance_payment: deposit ? `${deposit} ብር` : '0 ብር',
        price: fullPriceDetail,
        appointment_date: calculatedDate, // 👉 የተሰላው የኢትዮጵያ ቀን
        alteration_image: imageUrl, 
        chest: measurements.chest,
        shoulder: measurements.shoulder,
        length: measurements.length,
        sleeve: measurements.sleeve,
        waist: measurements.waist,
        trousers_length: measurements.trousersLength, 
        status: 'ተረጋግጧል (Alteration Approved)'
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

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-lg font-black text-gray-900">✂️ የልብስ ማስተካከያ (Alteration)</h2>
          <p className="text-xs text-gray-500">ለማጥበብ፣ ለማሳጠር ወይም ለማስተካከል ለሚመጡ ልብሶች ይህንን ይጠቀሙ።</p>
        </div>

        {/* የደንበኛ መረጃ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ሙሉ ስም</label>
            <input type="text" placeholder="የደንበኛው ስም" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስልክ ቁጥር</label>
            <input type="text" placeholder="09..." required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስንት ቀን ይፈጃል? (በቀን)</label>
            <input 
              type="number" 
              placeholder="ለምሳሌ: 10" 
              required 
              value={deliveryDays} 
              onChange={(e) => setDeliveryDays(e.target.value)} 
              className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
            />
            {calculatedDate && (
              <p className="text-xs mt-2 font-bold text-orange-600">
                📅 የሚረከቡበት ቀን (በኢት): <span className="text-gray-900 font-extrabold">{calculatedDate}</span>
              </p>
            )}
          </div>
        </div>

        {/* የማስተካከያው ዝርዝር */}
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 mb-6">
          <h2 className="text-sm font-bold text-orange-900 mb-4">🔧 ምን ይስተካከል?</h2>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">የልብሱ ዓይነት (ለምሳሌ: ሱሪ / ጃኬት)</label>
            <input type="text" placeholder="ምኑ ነው የሚስተካከለው?" required value={clothingName} onChange={(e) => setClothingName(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ምን ይስተካከል? (ማብራሪያ)</label>
              <textarea placeholder="ለምሳሌ: እጅጌ 2 ኢንች ማሳጠር፣ ወገብ ማጥበብ..." required value={alterationNote} onChange={(e) => setAlterationNote(e.target.value)} rows="4" className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">📸 የሚስተካከለውን ልብስ ፎቶ አስገባ (አማራጭ)</label>
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white h-[104px]">
                <input type="file" accept="image/*" onChange={(e) => setAlterationImage(e.target.files[0])} className="w-full text-xs text-orange-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200" />
              </div>
              {alterationImage && <p className="text-[10px] text-green-600 mt-1 font-bold">ፎቶ ገብቷል: {alterationImage.name}</p>}
            </div>
          </div>
        </div>

        {/* ልኬቶች */}
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-4">📐 አዲስ ልኬቶች (ካስፈለገ ብቻ)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(measurements).map(key => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-600 mb-1 capitalize">{key}</label>
                <input type="text" placeholder="..." value={measurements[key]} onChange={(e) => setMeasurements({...measurements, [key]: e.target.value})} className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            ))}
          </div>
        </div>

        {/* የክፍያ መረጃ */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4">💳 የክፍያ መረጃ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">አጠቃላይ ዋጋ (ብር)</label>
              <input type="number" placeholder="የማስተካከያው ዋጋ..." required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">የተከፈለ ቅድመ ክፍያ (Deposit)</label>
              <input type="number" placeholder="የተከፈለው..." value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              
              {price && (
                <p className={`text-xs mt-2 font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingBalance > 0 ? `ቀሪ ሂሳብ: ${remainingBalance} ብር` : 'ሂሳብ ሙሉ በሙሉ ተከፍሏል ✅'}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ተጨማሪ የክፍያ ማስታወሻ <span className="text-gray-400 font-normal">(አማራጭ)</span></label>
            <textarea placeholder="ስለ ክፍያው ሌላ ማብራሪያ ካለ..." value={paymentDetail} onChange={(e) => setPaymentDetail(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" rows="2"></textarea>
          </div>
        </div>

        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition">
          ✅ የማስተካከያ ትዕዛዙን መዝግብ
        </button>
      </form>

      {/* የ Success Pop-up */}
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
            
            {/* የትዕዛዝ መለያ ማሳያ (በብርቱካናማ ቀለም) */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
              <p className="text-xs text-orange-600 font-bold mb-1">የትዕዛዝ መለያ ቁጥር (ልብሱ ላይ ይጻፉ)</p>
              <p className="text-3xl font-black text-gray-900 tracking-wider">{generatedOrderCode}</p>
            </div>
            
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setCustomerName(''); setPhone(''); 
                setDeliveryDays(''); 
                setClothingName(''); setAlterationNote(''); setAlterationImage(null);
                setDeposit(''); setPrice(''); setPaymentDetail('');
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