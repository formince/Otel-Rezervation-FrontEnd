import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import AdminLayout from './components/Layout/AdminLayout';

import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import HotelOwnerPanel from './pages/HotelOwnerPanel';
import AddHotel from './pages/AddHotel';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AdminPanelUser from './pages/AdminPanel/UserManagement';
import AdminPanelHotel from './pages/AdminPanel/HotelsOverview';
import AdminPanelFinancial from './pages/AdminPanel/FinancialOverview';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Reservations from './pages/Reservations';

function App() {
  console.log('App component rendered')
  return (
    <>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Main Layout for regular users */}
        <Route path="/*" element={<Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/hotel-owner" element={<HotelOwnerPanel />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/rezervasyonlarim" element={<Reservations />} />
          </Routes>
        </Layout>} />

        {/* Admin Layout for admin routes */}
        <Route path="/admin/*" element={<AdminLayout>
          <Routes>
            <Route path="/" element={<AdminPanel />} />
            <Route path="/users" element={<AdminPanelUser />} />
            <Route path="/hotels" element={<AdminPanelHotel />} />
            <Route path="/financial" element={<AdminPanelFinancial />} />
            <Route path="/settings" element={<AdminPanel />} />
          </Routes>
        </AdminLayout>} />
      </Routes>
    </>
  )
}

export default App;