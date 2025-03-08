import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import AdminLayout from './components/Layout/AdminLayout';

import SearchResults from './pages/SearchResults';
import Home from './pages/Home';
import HotelDetail from './pages/HotelDetail';
import HotelOwnerPanel from './pages/HotelOwnerPanel';
import AddHotel from './pages/AddHotel';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AdminPanelUser from './pages/AdminPanel/UserManagement';
import AdminPanelHotel from './pages/AdminPanel/HotelsOverview';
import AdminPanelFinancial from './pages/AdminPanel/FinancialOverview';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Reservations from './pages/Reservations';
import AdminHotelAdd from './pages/AdminPanel/AddHotel';
import AdminHotelEdit from './pages/AdminPanel/EditHotel';
import UserList from './pages/AdminPanel/UserList';
import UserForm from './pages/AdminPanel/UserForm';
import UserView from './pages/AdminPanel/UserView';

function App() {
  console.log('App component rendered')
  return (
    <>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
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
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="" element={<AdminPanel />} />
          <Route path="hotels" element={<AdminPanelHotel />} />
          <Route path="add-hotel" element={<AdminHotelAdd />} />
          <Route path="edit-hotel/:id" element={<AdminHotelEdit />} />
          <Route path="financial" element={<AdminPanelFinancial />} />
          <Route path="settings" element={<AdminPanel />} />
          
          {/* Kullanıcı yönetimi sayfaları */}
          <Route path="user-management" element={<UserList />} />
          <Route path="user-management/new" element={<UserForm />} />
          <Route path="user-management/:userId/edit" element={<UserForm />} />
          <Route path="user-management/:userId/view" element={<UserView />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;