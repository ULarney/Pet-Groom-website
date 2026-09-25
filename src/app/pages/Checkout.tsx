import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCheckoutData() {
      try {
        const dbProducts = await api.products.getAll();
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');

        if (cartData.length === 0) {
          navigate('/cart');
          return;
        }

        const cartWithProducts = cartData.map((item: any) => ({
          ...item,
          product: dbProducts.find((p: any) => p.id === item.productId)
        }));
        setCart(cartWithProducts);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
      }
    }
    loadCheckoutData();
  }, [navigate]);

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user?.id) return;
    setError('');

    try {
      await api.orders.create({
        userId: user.id,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.product?.price || 0
        })),
        total,
        instructions
      });

      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('storage')); // clear cart badge
      navigate('/my-orders');
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err?.response?.data?.error || 'Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center py-3 border-b">
                <div className="flex-1">
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">R{item.product?.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>R{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-2xl font-bold mt-4">
              <span>Total</span>
              <span className="text-blue-600">R{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special instructions for your order..."
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            className="w-full px-6 py-4 bg-blue-600 text-white text-lg rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
          <p className="text-sm text-blue-800">
            This is a demo checkout. In a real application, you would enter payment and shipping information here.
          </p>
        </div>
      </div>
    </div>
  );
}
