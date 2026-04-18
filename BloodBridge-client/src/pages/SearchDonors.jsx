import { useState } from 'react';
import axios from 'axios';
import { districts, bloodGroups } from '../data/bangladesh';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchDonors = () => {
  const [filters, setFilters] = useState({
    bloodGroup: '',
    district: '',
    upazila: ''
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedDistrict = districts.find(d => d.name === filters.district);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'district') {
      setFilters(prev => ({ ...prev, upazila: '' }));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.district) params.append('district', filters.district);
      if (filters.upazila) params.append('upazila', filters.upazila);

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/donors?${params}`);
      setDonors(response.data);
    } catch (error) {
      console.error('Error searching donors:', error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">Search</span>
        </div>
        <h1 className="text-[#F5E6E0] mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '2px' }}>
          Find <em className="not-italic text-[#B09090]" style={{ fontFamily: "'DM Serif Display', serif" }}>Blood Donors</em>
        </h1>

        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Blood Group</label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
              >
                <option value="" className="bg-[#150A0A]">All Blood Groups</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg} className="bg-[#150A0A]">{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">District</label>
              <select
                name="district"
                value={filters.district}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
              >
                <option value="" className="bg-[#150A0A]">All Districts</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name} className="bg-[#150A0A]">{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Upazila</label>
              <select
                name="upazila"
                value={filters.upazila}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
                disabled={!filters.district}
              >
                <option value="" className="bg-[#150A0A]">All Upazilas</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u} value={u} className="bg-[#150A0A]">{u}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full mt-4 bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Search Donors
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : donors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {donors.map((donor) => (
              <div key={donor._id} className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(214,40,40,0.4)] transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={donor.avatar || 'https://via.placeholder.com/60'}
                    alt={donor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D62828]"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-[#F5E6E0]">{donor.name}</h3>
                    <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-0.5 rounded text-xs font-semibold">
                      {donor.bloodGroup}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-[#B09090]">
                  <p className="mb-1"><span className="text-[#F5E6E0]">Location:</span> {donor.district}, {donor.upazila}</p>
                  <p><span className="text-[#F5E6E0]">Email:</span> {donor.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#B09090]">No donors found matching your criteria</p>
            <p className="text-sm text-[#B09090]/60 mt-2">Try different filters</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#B09090]">Search for blood donors using the filters above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;