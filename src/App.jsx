import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Shop from './components/Shop';
import AboutStory from './components/AboutStory';
import Testimonial from './components/Testimonial';

import AdminNavbar from './components/admin/AdminNavbar';
import OrdersList from './components/admin/OrdersList';
import AddMeasurement from './components/admin/AddMeasurement';
import ManageProducts from './components/admin/ManageProducts';

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      
      {/* አድሚን ገጽ ላይ ካለ የአድሚኑን፣ ካልሆነ የደንበኛውን ማውጫ ያሳያል */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      
      <div className="flex-grow relative">
        <Routes>
          {/* የደንበኞች ዌብሳይት ገጾች */}
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<AboutStory />} />
          <Route path="/offerings" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Testimonial />} />

          {/* የአድሚን ገጾች */}
          <Route path="/admin" element={<OrdersList />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/add" element={<AddMeasurement />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;