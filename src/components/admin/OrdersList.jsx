import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const OrderCard = ({ order }) => {
  let typeBadge = '';
  let badgeColor = '';
  
  // የትዕዛዝ አይነቶችን በስም መለያቸው (Tag) እንለያለን
  if (order.product_name?.includes('[የሱቅ ልብስ]')) {
    typeBadge = '👕 የሱቅ ካታሎግ';
    badgeColor = 'bg-blue-100 text-blue-800';
  } else if (order.product_name?.includes('[አዲስ ዲዛይን]')) {
    typeBadge = '✨ አዲስ ዲዛይን';
    badgeColor = 'bg-purple-100 text-purple-800';
  } else if (order.product_name?.includes('[ማስተካከያ]')) {
    typeBadge = '✂️ ማስተካከያ';
    badgeColor = 'bg-orange-100 text-orange-800';
  } else {
    // ከላይ ያሉት ሦስቱ መለያዎች ከሌሉት፣ ኦንላይን የመጣ ትዕዛዝ ነው ማለት ነው
    typeBadge = '📱 ኦንላይን ትዕዛዝ';
    badgeColor = 'bg-teal-100 text-teal-800';
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{order.customer_name}</h3>
            <p className="text-xs text-gray-500">{order.phone}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}`}>
            {typeBadge}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 line-clamp-2">{order.product_name}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">📅 ቀጠሮ: {order.appointment_date || 'አልተሰጠም'}</p>
            <p className="text-xs text-gray-400 font-mono">🔑 {order.order_code}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-auto">
        <p className="text-sm font-black text-gray-900">{order.price}</p>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md text-right">
          {order.status}
        </span>
      </div>
    </div>
  );
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      alert('ስህተት ተፈጥሯል: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ትዕዛዞቹን በየምድባቸው ማጣራት
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'catalog') return order.product_name?.includes('[የሱቅ ልብስ]');
    if (activeTab === 'custom') return order.product_name?.includes('[አዲስ ዲዛይን]');
    if (activeTab === 'alteration') return order.product_name?.includes('[ማስተካከያ]');
    if (activeTab === 'online') {
      // ሦስቱም የሱቅ ውስጥ መለያዎች ከሌሉት ኦንላይን ነው ብሎ ይለየዋል
      return !order.product_name?.includes('[የሱቅ ልብስ]') && 
             !order.product_name?.includes('[አዲስ ዲዛይን]') && 
             !order.product_name?.includes('[ማስተካከያ]');
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-extrabold text-gray-900">📦 የትዕዛዞች ዝርዝር</h1>
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100">
          የትዕዛዝ ብዛት: {filteredOrders.length} (አጠቃላይ: {orders.length})
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          🌐 ሁሉም
        </button>
        <button 
          onClick={() => setActiveTab('online')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'online' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          📱 ኦንላይን
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'catalog' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          👕 የሱቅ ልብስ
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'custom' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          ✨ አዲስ ዲዛይን
        </button>
        <button 
          onClick={() => setActiveTab('alteration')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'alteration' ? 'bg-white text-orange-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          ✂️ ማስተካከያ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-bold text-lg">በዚህ ምድብ የተመዘገበ ትዕዛዝ የለም።</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}