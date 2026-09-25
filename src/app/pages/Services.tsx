import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Clock, Search, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const services = [
  { id: 1, name: 'Basic Grooming', description: 'Complete bath, brush, and nail trim for your pet', duration: '1 hour', price: 650 },
  { id: 2, name: 'Full Grooming', description: 'Bath, haircut, styling, ear cleaning, and nail trim', duration: '2 hours', price: 1095 },
  { id: 3, name: 'Premium Spa', description: 'Luxury treatment including massage, aromatherapy, and premium products', duration: '3 hours', price: 1750 },
  { id: 4, name: 'Teeth Cleaning', description: 'Professional dental cleaning and oral hygiene', duration: '45 minutes', price: 875 },
  { id: 5, name: 'De-shedding Treatment', description: 'Special treatment to reduce shedding', duration: '1.5 hours', price: 805 },
  { id: 6, name: 'Flea & Tick Treatment', description: 'Comprehensive flea and tick removal and prevention', duration: '1 hour', price: 725 },
  { id: 7, name: 'Puppy First Groom', description: 'Gentle introductory grooming experience designed especially for puppies under 6 months. Includes a soft bath, blow-dry, light trim, and nail file to get your pup comfortable with grooming.', duration: '1 hour', price: 550 },
  { id: 8, name: 'Senior Pet Pamper', description: 'Tailored grooming session for older pets with sensitive skin and joints. Uses warm water, gentle products, and extra-slow handling to ensure a stress-free experience for your senior companion.', duration: '1.5 hours', price: 795 },
  { id: 9, name: 'Breed-Specific Styling', description: 'Expert scissor and clipper styling matched to your breed\'s standard cut — from Poodle and Bichon topknots to Schnauzer trims and Cocker Spaniel feathering. Show-ready results at salon prices.', duration: '2.5 hours', price: 1350 },
  { id: 10, name: 'Paw & Nail Care', description: 'Full paw treatment including nail clipping, filing, paw pad moisturising balm application, and inter-digital fur trimming. Keeps your pet comfortable on all surfaces.', duration: '30 minutes', price: 395 },
  { id: 11, name: 'Blueberry Facial', description: 'A soothing blueberry-infused facial scrub and rinse that brightens the facial fur, removes tear stains, and leaves your pet smelling fresh. Safe for eyes and nose — dogs love it!', duration: '20 minutes', price: 295 },
  { id: 12, name: 'Full-Body Dematting', description: 'Careful removal of mats and tangles using specialist tools and conditioning sprays without unnecessary shaving. Our groomers work patiently to preserve your pet\'s coat length wherever possible.', duration: '2 hours', price: 980 }
];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookNow = (serviceId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking?service_id=${serviceId}`, message: 'Please login to book' } });
    } else {
      navigate(`/booking?service_id=${serviceId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#A8D5F2]/10 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4 gradient-text">Our Grooming Services</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] mx-auto mb-4 rounded-full"></div>
        <p className="text-center text-gray-600 mb-8 text-lg">Professional care for your beloved pets</p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B9BD5] to-[#FF9D5C] rounded-full flex items-center justify-center mb-4">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#4A7FC7]">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5 text-[#FF9D5C]" />
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] bg-clip-text text-transparent">
                      R{service.price}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBookNow(service.id)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#5B9BD5] to-[#FF9D5C] text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
