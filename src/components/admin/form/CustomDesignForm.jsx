import { useState } from 'react';
import { supabase } from '../../../supabaseClient';

export default function CustomDesignForm() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState('');

  // የዲዛይን መረጃዎች
  const [clothingName, setClothingName] = useState('');
  const [designDetail, setDesignDetail] = useState('');
  const [designImage, setDesignImage] = useState(null);
  
  // 👉 የቀን ማስገቢያ (በቀናት)
  const [deliveryDays, setDeliveryDays] = useState('');
  
  const [deposit, setDeposit] = useState('');
  const [price, setPrice] = useState('');
  const [paymentDetail, setPaymentDetail] = useState('');
  
  // ዋጋው የማይታወቅ ከሆነ የሚበራ
  const [isPriceUnknown, setIsPriceUnknown] = useState(false);
  
  const [measurements, setMeasurements] = useState({ chest: '', shoulder: '', length: '', sleeve: '', waist: '', trousersLength: '' });

  // ቀሪ ሂሳብ ማስሊያ (ዋጋው ከታወቀ ብቻ የሚሰራ)
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
      if (designImage) {
        imageUrl = await convertFileToBase64(designImage);
      }

      const orderCode = 'EYU-' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedOrderCode(orderCode);
      
      // ዋጋውን እና የክፍያ ማብራሪያውን ማቀናጀት
      let fullPriceDetail = '';
      if (isPriceUnknown) {
        fullPriceDetail = 'ዋጋው አልታወቀም (በኋላ ይገለጻል)';
      } else {
        fullPriceDetail = price ? `${price} ብር` : 'ያልተገለጸ';
        if (deposit) {
          fullPriceDetail += ` (ቅድመ ክፍያ: ${deposit} ብር | ቀሪ: ${remainingBalance} ብር)`;
        }
        if (paymentDetail) {
          fullPriceDetail += ` - ማስታወሻ: ${paymentDetail}`;
        }
      }

      // የዲዛይኑን ስም እና ማብራሪያ ማቀናጀት
      let fullProductDetail = `[አዲስ ዲዛይን] ${clothingName}`;
      if (designDetail) {
        fullProductDetail += ` - ማብራሪያ: ${designDetail}`;
      }

      const orderData = {
        order_code: orderCode, 
        customer_name: customerName, 
        phone: phone,
        product_name: fullProductDetail,
        advance_payment: isPriceUnknown ? '0 ብር' : (deposit ? `${deposit} ብር` : '0 ብር'),
        price: fullPriceDetail,
        appointment_date: calculatedDate, // 👉 የተሰላው የኢትዮጵያ ቀን
        design_image: imageUrl, 
        chest: measurements.chest,
        shoulder: measurements.shoulder,
        length: measurements.length,
        sleeve: measurements.sleeve,
        waist: measurements.waist,
        trousers_length: measurements.trousersLength, 
        status: isPriceUnknown ? 'ትዕዛዝ ተቀብለናል (ዋጋ እየተሰላ ነው)' : 'ተረጋግጧል & ልኬት ገብቷል (Approved)'
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) {
        alert('❌ ዳታቤዝ ላይ ማስቀመጥ አልተቻለም: ' + error.message);
        console.error("Supabase Insert Error:", error);
        return;
      }

      // 👉 ፖፕ-አፑን ማሳየት
      setShowSuccessModal(true);
      
    } catch (error) {
      alert('ስህተት ተፈጥሯል: ' + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-lg font-black text-gray-900">✨ አዲስ የልብስ ስፌት መመዝገቢያ</h2>
          <p className="text-xs text-gray-500">ደንበኛው የራሱን ዲዛይን እና ፎቶ ይዞ ሲመጣ ይህንን ይጠቀሙ።</p>
        </div>

        {/* የደንበኛ መረጃ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ሙሉ ስም</label>
            <input type="text" placeholder="የደንበኛው ስም" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስልክ ቁጥር (ለ Text)</label>
            <input type="text" placeholder="09..." required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ስንት ቀን ይፈጃል? (በቀን)</label>
            <input 
              type="number" 
              placeholder="ለምሳሌ: 10" 
              required 
              value={deliveryDays} 
              onChange={(e) => setDeliveryDays(e.target.value)} 
              className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" 
            />
            {calculatedDate && (
              <p className="text-xs mt-2 font-bold text-blue-600">
                📅 የሚረከቡበት ቀን (በኢት): <span className="text-gray-900 font-extrabold">{calculatedDate}</span>
              </p>
            )}
          </div>
        </div>

        {/* የዲዛይን መረጃ */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">🎨 የዲዛይኑ ዝርዝር</h2>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">የዲዛይኑ ስም (ለምሳሌ: ልዩ የሰርግ ሱፍ)</label>
            <input type="text" placeholder="የልብሱ ስም..." required value={clothingName} onChange={(e) => setClothingName(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ስለ ዲዛይኑ ዝርዝር ማብራሪያ (Detail)</label>
              <textarea placeholder="ልብሱ እንዴት እንደሚሰፋ፣ የሚጨመርበት ወይም የሚቀነስበት ነገር ካለ..." required value={designDetail} onChange={(e) => setDesignDetail(e.target.value)} rows="4" className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">📸 የዲዛይኑን ፎቶ አስገባ (Image)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white h-[104px]">
                <input type="file" accept="image/*" onChange={(e) => setDesignImage(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
              </div>
              {designImage && <p className="text-[10px] text-green-600 mt-1 font-bold">ፎቶ ገብቷል: {designImage.name}</p>}
            </div>
          </div>
        </div>

        {/* ልኬቶች */}
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-4">📐 ልኬቶች (Measurements)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(measurements).map(key => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-600 mb-1 capitalize">{key}</label>
                <input type="text" placeholder="..." value={measurements[key]} onChange={(e) => setMeasurements({...measurements, [key]: e.target.value})} className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
              </div>
            ))}
          </div>
        </div>

        {/* የክፍያ መረጃ */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
            <h2 className="text-sm font-bold text-gray-800">💳 የክፍያ መረጃ</h2>
            
            <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition">
              <input 
                type="checkbox" 
                checked={isPriceUnknown} 
                onChange={(e) => { setIsPriceUnknown(e.target.checked); if (e.target.checked) { setPrice(''); setDeposit(''); } }}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-red-700">ዋጋው አሁን አይታወቅም</span>
            </label>
          </div>

          {!isPriceUnknown ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">አጠቃላይ ዋጋ (ብር)</label>
                  <input type="number" placeholder="አጠቃላይ ዋጋ..." required={!isPriceUnknown} value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">የተከፈለ ቅድመ ክፍያ (Deposit)</label>
                  <input type="number" placeholder="የተከፈለው..." value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
                  
                  {price && (
                    <p className={`text-xs mt-2 font-bold ${remainingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {remainingBalance > 0 ? `ቀሪ ሂሳብ: ${remainingBalance} ብር` : 'ሂሳብ ሙሉ በሙሉ ተከፍሏል ✅'}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ተጨማሪ የክፍያ ማስታወሻ <span className="text-gray-400 font-normal">(አማራጭ)</span></label>
                <textarea placeholder="ስለ ክፍያው ሌላ ማብራሪያ ካለ..." value={paymentDetail} onChange={(e) => setPaymentDetail(e.target.value)} className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" rows="2"></textarea>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg animate-fade-in text-center">
              <p className="text-sm font-bold text-orange-800 mb-1">⚠️ የትዕግስት መልዕክት ይላካል!</p>
              <p className="text-xs text-orange-700">ይህንን ፎርም ሲመዘግቡ ደንበኛው ትክክለኛው ዋጋ እስኪሰላ ድረስ በትዕግስት እንዲጠብቅ የሚጠይቅ SMS (Text) ከትዕዛዝ ቁጥሩ ጋር ይላክለታል።</p>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition">
          ✅ አዲሱን ትዕዛዝ መዝግብ
        </button>
      </form>

      {/* ውብ የሆነው የ Success Pop-up */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full transform transition-all scale-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">ተሳክቷል! 🎉</h2>
            
            {/* ዋጋው ካልታወቀ ለየት ያለ መልዕክት እናሳያለን */}
            {isPriceUnknown ? (
               <p className="text-orange-500 mb-5 text-sm font-bold bg-orange-50 p-2 rounded-lg">ትዕዛዙ ተመዝግቧል።<br/>(ዋጋው ሲታወቅ ለደንበኛው ይደወላል)</p>
            ) : (
               <p className="text-gray-500 mb-5 text-sm font-medium">አዲሱ ዲዛይን በተሳካ ሁኔታ ተመዝግቧል</p>
            )}

            {/* የትዕዛዝ መለያ ማሳያ (በ Slate ቀለም) */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
              <p className="text-xs text-slate-600 font-bold mb-1">የትዕዛዝ መለያ ቁጥር (ልብሱ ላይ ይጻፉ)</p>
              <p className="text-3xl font-black text-gray-900 tracking-wider">{generatedOrderCode}</p>
            </div>
            
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setCustomerName(''); setPhone(''); setClothingName(''); setDesignDetail(''); setDesignImage(null);
                setDeliveryDays(''); setDeposit(''); setPrice(''); setPaymentDetail(''); setIsPriceUnknown(false);
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