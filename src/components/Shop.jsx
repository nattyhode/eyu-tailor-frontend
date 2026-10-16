import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  const [activeCategory, setActiveCategory] = useState('ሁሉም');

  // የማዘዣ ፎርም States
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('3:00 ጠዋት');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowOrderForm(false);
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      if (firstVariant.images && firstVariant.images.length > 0) {
        setActiveImage(firstVariant.images[0]);
      }
    }
  };

  const handleColorChange = (variant) => {
    setSelectedVariant(variant);
    if (variant.images && variant.images.length > 0) {
      setActiveImage(variant.images[0]);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      let screenshotUrl = '';
      if (paymentScreenshot) {
        screenshotUrl = await convertFileToBase64(paymentScreenshot);
      }

      const uniqueId = 'EYU-' + Math.floor(1000 + Math.random() * 9000);

      const orderData = {
        order_code: uniqueId,
        customer_name: customerName,
        phone: phone,
        product_name: selectedProduct.name,
        selected_color: selectedVariant.color,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        advance_payment: '500 ብር',
        payment_screenshot: screenshotUrl,
        status: 'ክፍያ ተጠባበቂ (Pending)'
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;

      alert(`ትዕዛዞ በተሳካ ሁኔታ ተልኳል! 🎉\nየእርስዎ መለያ ቁጥር: ${uniqueId}\nአድሚኑ ክፍያውን ሲያረጋግጥ (Approve ሲያደርግ) ማረጋገጫ ይደርስዎታል።`);
      
      setShowOrderForm(false);
      setSelectedProduct(null);
      setCustomerName('');
      setPhone('');
      setAppointmentDate('');
      setAppointmentTime('3:00 ጠዋት');
      setPaymentScreenshot(null);
    } catch (error) {
      alert('ትዕዛዝ መላክ አልተቻለም: ' + error.message);
    }
  };

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'ሁሉም') return true;
    return product.gender === activeCategory;
  });

  return (
    <div className="bg-gray-50 py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">የእኛ ዲዛይኖች</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            የሚፈልጉትን ዲዛይን ይምረጡና ፎቶውን በመንካት ዝርዝር መረጃውን እና የቀለም አማራጮቹን ይመልከቱ!
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {['ሁሉም', 'የወንዶች', 'የሴቶች'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-semibold">በዚህ ካታጎሪ የተገኘ ልብስ የለም። 😢</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredProducts.map(product => {
                  const firstImage = product.variants?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1594938298593-70f56bc0ca14?q=80&w=800';
                  return (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col animate-fade-in"
                      onClick={() => openModal(product)}
                    >
                      <div className="relative h-80 bg-gray-50 flex items-center justify-center overflow-hidden p-2">
                        <img 
                          src={firstImage} 
                          alt={product.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex gap-1">
                          <span>{product.gender}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                            ዝርዝሩን እይ 👀
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1 tracking-wider uppercase">{product.product_code}</p>
                          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        </div>
                        <p className="text-blue-600 font-black text-lg">{product.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {selectedProduct && selectedVariant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col md:flex-row relative">
            <button 
              onClick={() => { setSelectedProduct(null); setShowOrderForm(false); }}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors z-10"
            >✕</button>

            <div className="md:w-1/2 p-6 flex flex-col">
              <div className="w-full h-[400px] rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
                <img 
                  src={activeImage} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-contain transition-opacity duration-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {selectedVariant.images?.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 object-cover rounded-lg cursor-pointer border-2 transition-all bg-gray-100 ${
                      activeImage === img ? 'border-blue-600 opacity-100 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-gray-50 border-l border-gray-100">
              
              {!showOrderForm ? (
                <div>
                  <div className="mb-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedProduct.gender}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedProduct.name}</h2>
                  <p className="text-2xl font-black text-blue-600 mb-6 border-b border-gray-200 pb-4">{selectedProduct.price}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{selectedProduct.description}</p>

                  <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                      🎨 የሚፈልጉትን ከለር ይምረጡ፡
                    </h4>
                    <div className="flex gap-4 flex-wrap">
                      {selectedProduct.variants?.map((variant, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorChange(variant)}
                          className={`w-12 h-12 rounded-full border-4 shadow-sm transition-all duration-200 ${
                            selectedVariant.color === variant.color 
                              ? 'border-blue-500 scale-110 shadow-md' 
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: variant.color }}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowOrderForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 text-lg flex justify-center items-center gap-2"
                  >
                    ✂️ ይዘዙ (500 ብር ቅድመ ክፍያ)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="animate-fade-in">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">📝 የማዘዣ እና የክፍያ ፎርም</h3>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">💳 የባንክ አካውንቶች (ለ 500 ብር ቅድመ ክፍያ):</p>
                    <p>• ንግድ ባንክ (CBE): <b>1000123456789</b></p>
                    <p>• ቴሌብር (Telebirr): <b>0911223344</b></p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ሙሉ ስም</label>
                      <input 
                        type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="ስምዎን ያስገቡ" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ስልክ ቁጥር</label>
                      <input 
                        type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="09..." className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none"
                      />
                    </div>

                    {/* ቀኑ እና ሰዓቱ ጎን ለጎን በግልጽ እንዲታዩ ተደርጓል */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">📅 ቀጠሮ ቀን (Date)</label>
                        <input 
                          type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">⏰ ቀጠሮ ሰዓት (Time)</label>
                        <select 
                          value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white outline-none"
                        >
                          <option value="3:00 ጠዋት">3:00 ጠዋት</option>
                          <option value="4:00 ጠዋት">4:00 ጠዋት</option>
                          <option value="5:00 ጠዋት">5:00 ጠዋት</option>
                          <option value="6:00 ቀትር">6:00 ቀትር</option>
                          <option value="8:00 ከሰዓት">8:00 ከሰዓት</option>
                          <option value="9:00 ከሰዓት">9:00 ከሰዓት</option>
                          <option value="10:00 ከሰዓት">10:00 ከሰዓት</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">📸 የክፍያ ማረጋገጫ ስክሪንሾት (Screenshot)</label>
                      <input 
                        type="file" accept="image/*" required onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition text-xs">
                      ✅ ትዕዛዙን ላክ (Submit Order)
                    </button>
                    <button type="button" onClick={() => setShowOrderForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-2.5 rounded-xl transition text-xs">
                      ተመለስ
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}