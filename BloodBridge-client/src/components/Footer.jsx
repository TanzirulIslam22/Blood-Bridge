import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050202] py-10 px-[60px]" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#D62828] flex items-center justify-center text-white" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)' }}>
              B
            </div>
            <span className="text-xl font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Blood<span className="text-[#D62828]">Bridge</span>
            </span>
          </Link>
          <p className="text-sm text-[#B09090] mt-4 leading-relaxed">Connecting blood donors, patients, and hospitals across Bangladesh to save lives.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[2px] uppercase text-[#D62828] mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-[#B09090]">
            <li><Link to="/" className="hover:text-[#F5E6E0] transition-colors">Home</Link></li>
            <li><Link to="/blood-donation-requests" className="hover:text-[#F5E6E0] transition-colors">Blood Requests</Link></li>
            <li><Link to="/search-donors" className="hover:text-[#F5E6E0] transition-colors">Find Donors</Link></li>
            <li><Link to="/blog" className="hover:text-[#F5E6E0] transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[2px] uppercase text-[#D62828] mb-4">Contact</h4>
          <p className="text-sm text-[#B09090]">Email: info@bloodbridge.com</p>
          <p className="text-sm text-[#B09090] mt-2">Phone: +880-XXX-XXXXXX</p>
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.04)] mt-8 pt-8 text-center text-sm text-[rgba(255,255,255,0.2)]">
        <p>&copy; 2025 BloodBridge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;