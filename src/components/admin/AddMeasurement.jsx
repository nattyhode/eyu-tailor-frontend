import { useState } from 'react';
import CatalogForm from './form/CatalogForm';
import CustomDesignForm from './form/CustomDesignForm';
import AlterationForm from './form/AlterationForm';

export default function AddMeasurement() {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mb-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">አዲስ ትዕዛዝ እና ልኬት ማስገቢያ</h1>
      
      {/* 3ቱ ዋና ዋና አማራጮች ማጫወቻ (Tabs) */}
      <div className="flex flex-wrap gap-3 mb-8 p-1.5 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          👕 ከሱቅ ካታሎግ ምረጥ
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'custom' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          ✨ አዲስ ዲዛይን (ስፌት)
        </button>
        <button 
          onClick={() => setActiveTab('alteration')}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'alteration' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          ✂️ ማስተካከያ (Alteration)
        </button>
      </div>

      {/* የተመረጠውን ፎርም ብቻ እዚህ ያሳያል */}
      <div className="mt-4">
        {activeTab === 'catalog' && <CatalogForm />}
        {activeTab === 'custom' && <CustomDesignForm />}
        {activeTab === 'alteration' && <AlterationForm />}
      </div>

    </div>
  );
}