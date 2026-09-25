import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, User, LogOut, ChevronDown, PawPrint, Calendar, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getCartCount(): number {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return (cart as any[]).reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
  } catch {
    return 0;
  }
}

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(getCartCount);

  useEffect(() => {
    // Refresh badge whenever localStorage changes (from this tab or others)
    const handleStorage = () => setCartCount(getCartCount());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#5B9BD5]/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#5B9BD5] hover:scale-110 transition-all duration-300 flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            Pet & Groom
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-gray-700 hover:text-[#5B9BD5] font-medium transition-all duration-300 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5B9BD5] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-[#FF9D5C] font-medium transition-all duration-300 relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF9D5C] group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/products" className="text-gray-700 hover:text-[#10B981] font-medium transition-all duration-300 relative group">
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link to="/cart" className="relative text-gray-700 hover:text-[#FF9D5C] hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#FF9D5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A8D5F2]/30 to-[#FFE5D9]/30 rounded-lg hover:from-[#A8D5F2]/40 hover:to-[#FFE5D9]/40 transition-all duration-300"
                >
                  <User className="w-5 h-5 text-[#5B9BD5]" />
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-[#5B9BD5]/20 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <Link
                          to="/my-pets"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#A8D5F2]/20 hover:to-[#FFE5D9]/20 rounded-lg transition-all duration-300 group"
                        >
                          <PawPrint className="w-5 h-5 text-[#FFD966] group-hover:scale-110 transition-transform" />
                          <span className="font-medium">My Pets</span>
                        </Link>
                        <Link
                          to="/my-bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#A8D5F2]/20 hover:to-[#FFE5D9]/20 rounded-lg transition-all duration-300 group"
                        >
                          <Calendar className="w-5 h-5 text-[#5B9BD5] group-hover:scale-110 transition-transform" />
                          <span className="font-medium">My Bookings</span>
                        </Link>
                        <Link
                          to="/my-orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#A8D5F2]/20 hover:to-[#FFE5D9]/20 rounded-lg transition-all duration-300 group"
                        >
                          <Package className="w-5 h-5 text-[#FF9D5C] group-hover:scale-110 transition-transform" />
                          <span className="font-medium">My Orders</span>
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                        >
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#5B9BD5] border-2 border-[#5B9BD5] rounded-lg hover:bg-[#A8D5F2]/20 hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
