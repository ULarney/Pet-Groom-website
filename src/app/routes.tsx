import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import MyPets from './pages/MyPets';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminProducts from './pages/AdminProducts';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'services', Component: Services },
      { path: 'shop', Component: Shop },
      { path: 'product/:id', Component: Product },
      {
        path: 'booking',
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-pets',
        element: (
          <ProtectedRoute>
            <MyPets />
          </ProtectedRoute>
        )
      },
      {
        path: 'add-pet',
        element: (
          <ProtectedRoute>
            <AddPet />
          </ProtectedRoute>
        )
      },
      {
        path: 'edit-pet/:id',
        element: (
          <ProtectedRoute>
            <EditPet />
          </ProtectedRoute>
        )
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-orders',
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/products',
        element: (
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        )
      },
      { path: '*', Component: NotFound }
    ]
  }
]);
