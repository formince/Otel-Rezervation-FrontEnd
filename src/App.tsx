import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import AdminLayout from './components/Layout/AdminLayout';

import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import HotelOwnerPanel from './pages/HotelOwnerPanel';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AdminPanelUser from './pages/AdminPanel/UserManagement';
import AdminPanelHotel from './pages/AdminPanel/HotelsOverview';
import AdminPanelFinancial from './pages/AdminPanel/FinancialOverview';

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Main Layout for regular users */}
        <Route path="/*"  element={<Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/hotel-owner" element={<HotelOwnerPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
  );
}

export default App;