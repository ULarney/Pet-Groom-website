import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#4A7FC7] to-[#5B9BD5] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">🐾</span>
              Pet &amp; Groom
            </h3>
            <p className="text-white/80 leading-relaxed">Professional pet grooming &amp; quality products for your beloved pets. Founded in 2026, proudly serving Cape Town.</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FFD966]">Contact</h4>
            <p className="text-white/90 mb-2">📧 info@petandgroom.co.za</p>
            <p className="text-white/90 mb-2">📞 +27 21 555 0182</p>
            <p className="text-white/90">📍 14 Kloof Street, Gardens, Cape Town, 8001</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FF9D5C]">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/90">&copy; 2026 Pet &amp; Groom. All rights reserved. Made with ❤️ for pets &mdash; Cape Town, South Africa.</p>
        </div>
      </div>
    </footer>
  );
}
