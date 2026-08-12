import { useState } from 'react';
import axios from 'axios';
import { districts, bloodGroups } from '../data/bangladesh';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const SearchDonors = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
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

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/donors?${params}&smart=1&includeCompatible=1`);
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
      <div className="max-w-4xl mx-auto" style={bnFont}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('search.label')}</span>
        </div>
        <h1 className="text-[#F5E6E0] mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '2px' }}>
          {t('search.title1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>{t('search.title2')}</em>
        </h1>

        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('search.bloodGroup')}</label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
              >
                <option value="" className="bg-[#150A0A]">{t('search.allBloodGroups')}</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg} className="bg-[#150A0A]">{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('search.district')}</label>
              <select
                name="district"
                value={filters.district}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
              >
                <option value="" className="bg-[#150A0A]">{t('search.allDistricts')}</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name} className="bg-[#150A0A]">{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('search.upazila')}</label>
              <select
                name="upazila"
                value={filters.upazila}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
                disabled={!filters.district}
              >
                <option value="" className="bg-[#150A0A]">{t('search.allUpazilas')}</option>
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
            {t('search.searchDonors')}
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : donors.length > 0 ? (
          <>
            {filters.bloodGroup && (
              <div className="mb-6 p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                <p className="text-sm text-[#B09090]">
                  {donors.some(d => d.compatibility === 'exact') ? (
                    <>
                      {t('search.donorsFound')} <span className="text-[#F5E6E0] font-semibold">{donors.filter(d => d.compatibility === 'exact').length} {donors.filter(d => d.compatibility === 'exact').length === 1 ? t('search.exact') : t('search.exactPlural')}</span> {filters.bloodGroup}{donors.some(d => d.compatibility === 'compatible') && <> + <span className="text-yellow-400 font-semibold">{donors.filter(d => d.compatibility === 'compatible').length} {t('search.compatible')}</span></>}
                    </>
                  ) : (
                    <>{t('search.noExact')} <span className="text-[#F5E6E0] font-semibold">{filters.bloodGroup}</span> {t('search.showing')} <span className="text-yellow-400 font-semibold">{t('search.compatibleTypes')}</span> {t('search.instead')}</>
                  )}
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {donors.map((donor) => (
              <div key={donor._id} className={`bg-[#1E0E0E] border p-5 transition-colors ${donor.available ? 'border-[rgba(34,197,94,0.3)] hover:border-[rgba(34,197,94,0.6)]' : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(214,40,40,0.4)]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={donor.avatar || 'https://via.placeholder.com/60'}
                      alt={donor.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#D62828]"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-[#F5E6E0]">{donor.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-0.5 rounded text-xs font-semibold">
                          {donor.bloodGroup}
                        </span>
                        {donor.isUniversalDonor && (
                          <span className="bg-[rgba(139,92,246,0.2)] text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase" title="Universal donor">
                            ⭐ {t('search.universal')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {donor.score !== undefined && (
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-[#D62828]">{donor.score}</p>
                      <p className="text-[10px] text-[#B09090] uppercase tracking-[1px]">{t('search.matchScore')}</p>
                    </div>
                  )}
                </div>

                {donor.compatibility === 'compatible' && (
                  <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[rgba(234,179,8,0.15)] text-yellow-400">
                    {t('search.compatibleType')}
                  </span>
                )}

                <div className="mt-4 text-sm text-[#B09090]">
                  <p className="mb-1"><span className="text-[#F5E6E0]">{t('search.location')}:</span> {donor.district}, {donor.upazila}</p>
                  <p className="mb-2"><span className="text-[#F5E6E0]">{t('search.email')}:</span> {donor.email}</p>
                </div>

                {donor.available !== undefined && (
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded ${donor.available ? 'bg-[rgba(34,197,94,0.12)] text-green-400' : 'bg-[rgba(234,179,8,0.12)] text-yellow-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${donor.available ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                    {donor.available ? t('search.availableNow') : donor.nextEligibleDate ? `${t('search.eligibleOn')} ${new Date(donor.nextEligibleDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : t('search.inCooldown')}
                  </div>
                )}

                {donor.matchReasons && donor.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {donor.matchReasons.map((reason, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#B09090] rounded">
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

                {(donor.donationCount || 0) > 0 && (
                  <p className="mt-3 text-xs text-[#B09090]">🩸 {donor.donationCount} {donor.donationCount > 1 ? t('search.donationsPlural') : t('search.donations')} · {donor.points || 0} {t('search.pts')}</p>
                )}
              </div>
            ))}
            </div>
          </>
        ) : hasSearched ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#B09090]">{t('search.noDonors')}</p>
            <p className="text-sm text-[#B09090]/60 mt-2">{t('search.tryDifferent')}</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#B09090]">{t('search.searchPrompt')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;