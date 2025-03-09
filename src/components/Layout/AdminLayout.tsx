import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Building, 
  CreditCard, 
  Settings2, 
  LogOut,
  UserCog,
  Link as LinkIcon,
  BarChart
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    // Ana sayfa için özel kontrol
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/'
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    }
    
    // Diğer sayfalar için tam eşleşme veya alt sayfa kontrolü
    return location.pathname === path || 
           (location.pathname.startsWith(path + '/') && path !== '/admin')
      ? 'bg-blue-50 text-blue-700' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold text-blue-600">
                Hotel Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 fixed h-[calc(100vh-4rem)] bg-white shadow-sm">
          <nav className="p-4 space-y-1">
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin')}`}
            >
              <BarChart className="h-4 w-4" />
              İstatistikler
            </Link>
            <Link 
              to="/admin/user-management" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/user-management')}`}
            >
              <UserCog className="h-4 w-4" />
              User Management
            </Link>
            <Link 
              to="/admin/hotels" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/hotels')}`}
            >
              <Building className="h-4 w-4" />
              Hotels
            </Link>
            <Link 
              to="/admin/hotel-assignments" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/hotel-assignments')}`}
            >
              <LinkIcon className="h-4 w-4" />
              Hotel Assignments
            </Link>
            <Link 
              to="/admin/financial" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/financial')}`}
            >
              <CreditCard className="h-4 w-4" />
              Financial
            </Link>
            <Link 
              to="/admin/settings" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/settings')}`}
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
