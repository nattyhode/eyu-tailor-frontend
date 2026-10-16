import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // 👈 በትክክል ሶስት ዶቶች መሆናቸውን አረጋግጥ

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [productCode, setProductCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ሱፍ');
  const [gender, setGender] = useState('የወንዶች');
  const [description, setDescription] = useState('');
  
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  
  const [colorHex, setColorHex] = useState('#000000');

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
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    resetForm();
    const randomCode = 'EYU-' + Math.floor(1000 + Math.random() * 9000);
    setProductCode(randomCode);
    setShowForm(true);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrls = [];

      if (image1) imageUrls.push(await convertFileToBase64(image1));
      if (image2) imageUrls.push(await convertFileToBase64(image2));
      if (image3) imageUrls.push(await convertFileToBase64(image3));

      if (imageUrls.length === 0) {
        const existingProduct = products.find(p => p.id === currentId);
        imageUrls = existingProduct?.variants?.[0]?.images || ['https://images.unsplash.com/photo-1594938298593-70f56bc0ca14?q=80&w=800'];
      }
      
      const formattedVariants = [
        {
          color: colorHex,
          images: imageUrls
        }
      ];

      const productData = {
        product_code: productCode,
        name,
        price,
        category,
        gender,
        description,
        variants: formattedVariants
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentId);

        if (error) throw error;
        alert('ልብሱ በተሳካ ሁኔታ ተስተካክሏል! ✅');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('አዲስ ልብስ በፎቶዎቹ ተጨምሮ ወደ ሱቁ ገብቷል! 🎉');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert('ስህተት ተፈጥሯል: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ይህንን ልብስ ማጥፋት ትፈልጋለህ?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(products.filter(p => p.id !== id));
        alert('ልብሱ ጠፍቷል! 🗑️');
      } catch (error) {
        alert('ማጥፋት አልተቻለም: ' + error.message);
      }
    }
  };

  const handleEditSetup = (product) => {
    setIsEditing(true);
    setShowForm(true);
    setCurrentId(product.id);
    setProductCode(product.product_code);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setGender(product.gender);
    setDescription(product.description);
    if (product.variants && product.variants.length > 0) {
      setColorHex(product.variants[0].color || '#000000');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setCurrentId(null);
    setProductCode('');
    setName('');
    setPrice('');
    setCategory('ሱፍ');
    setGender('የወንዶች');
    setDescription('');
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setColorHex('#000000');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">🛠️ የልብስ መቆጣጠሪያ ፓነል</h1>
          <p className="text-gray-500 text-sm mt-1">አዳዲስ ልብሶችን ከፋይል ፎቶዎች ጋር ያስተዳድሩ።</p>
        </div>

        {!showForm && (
          <button 
            onClick={handleOpenAddForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <span>➕</span> አዲስ ልብስ ጨምር (Add Product)
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? '✏️ ልብሱን ማስተካከል (Edit Product)' : '➕ አዲስ ልብስ ማስገቢያ ፎርም'}
            </h2>
            <button 
              type="button" 
              onClick={resetForm}
              className="text-gray-400 hover:text-red-600 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">የልብስ ኮድ (በራሱ የተሞላ)</label>
              <input 
                type="text" required value={productCode} readOnly
                className="w-full border border-gray-200 bg-gray-100 rounded-lg p-3 text-gray-500 font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">የልብሱ ስም (Name)</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ለምሳሌ: የወንዶች የሰርግ ሱፍ" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ዋጋ (Price)</label>
              <input 
                type="text" required value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="ለምሳሌ: 5,000 ብር" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ካታጎሪ (Category)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                <option value="ሱፍ">ሱፍ</option>
                <option value="የባህል ልብስ">የባህል ልብስ</option>
                <option value="ሸሚዝ">ሸሚዝ</option>
                <option value="የሰርግ ልብስ">የሰርግ ልብስ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ፆታ (Gender)</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                <option value="የወንዶች">የወንዶች</option>
                <option value="የሴቶች">የሴቶች</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🎨 የቀለም ምርጫ (Color)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-sm font-mono text-gray-600">{colorHex}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">📸 የልብስ ፎቶዎች (የተለዩ 3 ፎቶዎች)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ዋና ፎቶ (Image 1)</label>
                <input 
                  type="file" accept="image/*" onChange={(e) => setImage1(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ሁለተኛ ፎቶ (Image 2)</label>
                <input 
                  type="file" accept="image/*" onChange={(e) => setImage2(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ሶስተኛ ፎቶ (Image 3)</label>
                <input 
                  type="file" accept="image/*" onChange={(e) => setImage3(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">ማብራሪያ (Description)</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
              placeholder="ስለ ልብሱ አጭር ማብራሪያ..." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition">
              {isEditing ? 'ለውጦችን መዝግብ (Update)' : 'ልብሱን አስገባ (Save Product)'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl transition">
              ሰርዝ (Cancel)
            </button>
          </div>
        </form>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 የልብስ ዝርዝሮች ({products.length})</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                <th className="p-4">ፎቶ</th>
                <th className="p-4">ኮድ & ስም</th>
                <th className="p-4">ካታጎሪ / ፆታ</th>
                <th className="p-4">ዋጋ</th>
                <th className="p-4 text-center">እርምጃዎች (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => {
                const firstImage = product.variants?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1594938298593-70f56bc0ca14?q=80&w=800';
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <img 
                        src={firstImage} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      />
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-400 font-bold">{product.product_code}</p>
                      <p className="font-bold text-gray-900">{product.name}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {product.category} ({product.gender})
                      </span>
                    </td>
                    <td className="p-4 font-black text-blue-600">{product.price}</td>
                    <td className="p-4 text-center space-x-3">
                      <button 
                        onClick={() => handleEditSetup(product)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-4 py-2 rounded-lg text-xs transition"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-lg text-xs transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}