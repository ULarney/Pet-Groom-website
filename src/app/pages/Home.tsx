import { Link } from 'react-router';
import { Calendar, ShoppingBag, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';

const featuredProducts = [
  { id: 1, name: 'Premium Dog Shampoo', price: 349.99, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400' },
  { id: 2, name: 'Cat Grooming Kit', price: 499.99, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400' },
  { id: 3, name: 'Pet Nail Clippers', price: 189.99, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400' }
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5B9BD5] to-[#4A7FC7] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Professional Pet Grooming & Quality Products</h1>
          <p className="text-xl mb-8 text-blue-100">Give your pet the care they deserve</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#5B9BD5] rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Book a Groom
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 px-8 py-4 bg-[#FF9D5C] text-white border-2 border-white rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
            <Link
              to={isAuthenticated ? "/my-pets" : "/login"}
              className="flex items-center gap-2 px-8 py-4 bg-[#FFD966] text-gray-800 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <PawPrint className="w-5 h-5" />
              My Pets
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">About Pet & Groom</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] mx-auto mb-8 rounded-full"></div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Pet & Groom, we believe every pet deserves the best care and attention.
              Our mission is to provide professional grooming services and quality products
              that keep your furry friends happy, healthy, and looking their best.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              With years of experience and a genuine love for animals, our team is dedicated
              to creating a safe, comfortable, and enjoyable grooming experience for pets of all
              sizes and breeds. We're not just groomers—we're pet lovers who care about your
              companions as much as you do.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-gradient-to-br from-[#A8D5F2] to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4">🐕</div>
                <h3 className="text-xl font-bold mb-2 text-[#4A7FC7]">Expert Care</h3>
                <p className="text-gray-600">Professional groomers with years of experience</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#FFE5D9] to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-xl font-bold mb-2 text-[#E88A48]">Love & Care</h3>
                <p className="text-gray-600">Treating every pet like family</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#FFD966]/30 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-bold mb-2 text-[#5B9BD5]">Quality Products</h3>
                <p className="text-gray-600">Premium supplies for your pet's needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-[#A8D5F2]/20 to-[#FFE5D9]/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 gradient-text">How It Works</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] mx-auto mb-12 rounded-full"></div>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Getting your pet groomed has never been easier! Follow these simple steps to book your appointment.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5B9BD5] to-[#4A7FC7] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 text-[#4A7FC7]">Create Account</h3>
                  <p className="text-gray-600 text-center">Sign up and add your pet's details to get started</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-[#FFD966]">
                  →
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF9D5C] to-[#E88A48] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 text-[#E88A48]">Choose Service</h3>
                  <p className="text-gray-600 text-center">Browse our grooming services and select what your pet needs</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-[#FFD966]">
                  →
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD966] to-[#FFC933] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 text-[#D4A017]">Book Appointment</h3>
                  <p className="text-gray-600 text-center">Pick a convenient date and time that works for you</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-[#FFD966]">
                  →
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 text-[#059669]">Enjoy the Results</h3>
                  <p className="text-gray-600 text-center">Bring your pet in and watch them transform!</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] text-white rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Get Started Today
                <PawPrint className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 gradient-text">Featured Products</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] mx-auto mb-12 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl text-[#5B9BD5] font-bold mb-4">R{product.price.toFixed(2)}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-center px-4 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#4A7FC7] text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#5B9BD5] to-[#4A7FC7] text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gradient-to-br from-[#F8FAFC] to-[#A8D5F2]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 gradient-text">Our Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] mx-auto mb-12 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#A8D5F2] to-[#5B9BD5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#4A7FC7]">Basic Grooming</h3>
              <p className="text-gray-600 mb-4">Complete bath, brush, and nail trim</p>
              <p className="text-3xl text-[#5B9BD5] font-bold">R650</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFE5D9] to-[#FF9D5C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#E88A48]">Full Grooming</h3>
              <p className="text-gray-600 mb-4">Bath, haircut, styling, and more</p>
              <p className="text-3xl text-[#FF9D5C] font-bold">R1,095</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFD966] to-[#FFC933] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#D4A017]">Premium Spa</h3>
              <p className="text-gray-600 mb-4">Luxury treatment with massage</p>
              <p className="text-3xl text-[#FFD966] font-bold">R1,750</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] text-white rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
