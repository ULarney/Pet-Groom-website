import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { api } from '../utils/api';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const dbProducts = await api.products.getAll();
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartWithProducts = cartData.map((item: any) => ({
        ...item,
        product: dbProducts.find((p: any) => p.id === item.productId)
      }));
      setCart(cartWithProducts);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartData.map((item: any) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    await loadCart();
  };

  const removeItem = async (productId: number) => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartData.filter((item: any) => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    await loadCart();
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subtotal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cart.map(item => (
                      <tr key={item.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={item.product?.image || ''}
                              alt={item.product?.name || ''}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="font-medium">{item.product?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">R{item.product?.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          R{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full px-6 py-4 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="block w-full px-6 py-4 bg-gray-200 text-gray-700 text-center rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
