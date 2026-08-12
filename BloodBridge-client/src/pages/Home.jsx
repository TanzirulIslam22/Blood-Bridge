import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/pending`);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <LoadingSpinner />;

  const features = [
    { icon: '⏱️', title: t('home.featureCooldownTitle'), desc: t('home.featureCooldownDesc'), link: '/dashboard/profile', cta: t('home.featureCooldownCta') },
    { icon: '🎯', title: t('home.featureSmartTitle'), desc: t('home.featureSmartDesc'), link: '/search-donors', cta: t('home.featureSmartCta') },
    { icon: '🩺', title: t('home.featureHealthTitle'), desc: t('home.featureHealthDesc'), link: '/health-check', cta: t('home.featureHealthCta') },
    { icon: '🏆', title: t('home.featureBadgesTitle'), desc: t('home.featureBadgesDesc'), link: '/dashboard/leaderboard', cta: t('home.featureBadgesCta') },
    { icon: '📜', title: t('home.featureCertTitle'), desc: t('home.featureCertDesc'), link: '/dashboard/profile', cta: t('home.featureCertCta') },
    { icon: '🚨', title: t('home.featureUrgentTitle'), desc: t('home.featureUrgentDesc'), link: '/blood-donation-requests', cta: t('home.featureUrgentCta') },
  ];

  const steps = [
    { num: '01', icon: '📝', name: t('home.step1Title'), desc: t('home.step1Desc') },
    { num: '02', icon: '🔍', name: t('home.step2Title'), desc: t('home.step2Desc') },
    { num: '03', icon: '🩸', name: t('home.step3Title'), desc: t('home.step3Desc') },
  ];

  const campItems = [
    { icon: '📅', title: t('home.camp1Title'), desc: t('home.camp1Desc') },
    { icon: '✍️', title: t('home.camp2Title'), desc: t('home.camp2Desc') },
    { icon: '🎖️', title: t('home.camp3Title'), desc: t('home.camp3Desc') },
  ];

  return (
    <div style={bnFont}>
      {/* Blood Ticker */}
      <div className="bg-[#D62828] py-3.5 overflow-hidden">
        <div className="whitespace-nowrap animate-[ticker_18s_linear_infinite]">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g, i) => (
            <span key={i} className="inline-block mx-8 text-white tracking-[4px]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px' }}>
              {g} <span className="opacity-40">◆</span>
            </span>
          ))}
          {[...Array(3)].flatMap((_, i) => (
            ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g, j) => (
              <span key={`${i}-${j}`} className="inline-block mx-8 text-white tracking-[4px]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px' }}>
                {g} <span className="opacity-40">◆</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-72px)] flex items-center py-16 px-6 md:px-12" style={{ 
        background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(139, 0, 0, 0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(214, 40, 40, 0.12) 0%, transparent 55%), linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' 
      }}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5 mb-7">
            <div className="w-10 h-0.5 bg-[#D62828]"></div>
            <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('home.tagline')}</span>
          </div>
          <h1 className="text-[#F5E6E0] leading-none tracking-[2px]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 140px)' }}>
            {t('home.heroTitle1')}<br/>
            <span className="text-[#D62828]" style={{ textShadow: '0 0 60px rgba(214, 40, 40, 0.5)' }}>{t('home.heroTitle2')}</span><br/>
            <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif", fontSize: '0.85em' }}>{t('home.heroTitle3')}</em>
          </h1>
          <p className="mt-7 text-base leading-relaxed text-[#B09090] max-w-lg">
            {t('home.heroDesc')}
          </p>
          <div className="flex flex-wrap gap-6 mt-12">
            <Link 
              to="/register" 
              className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)', boxShadow: '0 0 30px rgba(214, 40, 40, 0.35)' }}
            >
              {t('home.registerAsDonor')}
            </Link>
            <Link 
              to="/blood-donation-requests" 
              className="text-[#B09090] text-sm font-medium tracking-[1.5px] uppercase flex items-center gap-2.5 hover:text-[#F5E6E0] transition-colors"
            >
              {t('home.viewRequests')}
              <span className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-xs">→</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute hidden gap-8 lg:flex right-12 bottom-8">
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              12<span className="text-[#D62828]">K+</span>
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">{t('home.registeredDonors')}</div>
          </div>
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              4<span className="text-[#D62828]">K+</span>
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">{t('home.livesSaved')}</div>
          </div>
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              64
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">{t('home.districts')}</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-[60px] bg-[#150A0A]" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('home.process')}</span>
        </div>
        <h2 className="text-[#F5E6E0] mb-16" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
          {t('home.howItWorks')}
        </h2>

        <div className="grid gap-20 md:grid-cols-2">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-7 py-8 border-b border-[rgba(255,255,255,0.05)]">
                <div className="text-[rgba(255,255,255,0.06)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '60px', lineHeight: 1, minWidth: '60px', textAlign: 'right' }}>{step.num}</div>
                <div className="flex-1 pt-2">
                  <div className="w-11 h-11 rounded-lg bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)] flex items-center justify-center text-xl mb-3.5">{step.icon}</div>
                  <div className="text-base font-semibold text-[#F5E6E0] mb-2">{step.name}</div>
                  <div className="text-sm text-[#B09090] leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="items-center justify-center hidden md:flex">
            <div className="w-[340px] h-[340px] rounded-full border border-[rgba(214,40,40,0.2)] flex items-center justify-center" style={{ 
              background: 'radial-gradient(circle at 40% 40%, rgba(214, 40, 40, 0.5) 0%, rgba(139, 0, 0, 0.3) 40%, rgba(20, 5, 5, 0.9) 75%, transparent 100%)',
              boxShadow: '0 0 80px rgba(139, 0, 0, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.5)' 
            }}>
              <div className="text-center">
                <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', lineHeight: 1, textShadow: '0 0 40px rgba(214, 40, 40, 0.35)' }}>🩸</div>
                <div className="text-xs tracking-[3px] uppercase text-[#B09090] mt-2">{t('home.saveALife')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-[60px]" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('home.featuresLabel')}</span>
        </div>
        <h2 className="text-[#F5E6E0] mb-16" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
          {t('home.featuresTitle1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif", fontStyle: 'italic' }}>{t('home.featuresTitle2')}</em>
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <Link key={i} to={feature.link} className="group">
              <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-7 h-full hover:border-[rgba(214,40,40,0.4)] hover:translate-y-[-3px] transition-all">
                <div className="w-12 h-12 rounded-lg bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)] flex items-center justify-center text-2xl mb-5">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#F5E6E0] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#B09090] leading-relaxed mb-5">{feature.desc}</p>
                <span className="text-xs font-semibold tracking-[1.5px] uppercase text-[#D62828] flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  {feature.cta} <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Urgent Requests */}
      <section className="py-24 px-[60px] bg-[#150A0A]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#D62828]"></div>
              <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('home.liveFeed')}</span>
            </div>
            <h2 className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
              {t('home.urgentSection')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif", fontStyle: 'italic' }}>{t('home.liveUpdates')}</em>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)]">
            <div className="w-2 h-2 rounded-full bg-[#D62828] animate-pulse"></div>
            <span className="text-xs font-semibold tracking-[2px] uppercase text-[#D62828]">{t('home.liveUpdates')}</span>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {requests.slice(0, 6).map((request) => (
              <Link key={request._id} to={`/blood-donation-requests/${request._id}`} className="block">
                <div className={`bg-[#1E0E0E] border p-7 hover:translate-y-[-3px] transition-all ${request.urgent ? 'border-[#D62828]' : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(214,40,40,0.4)]'}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1 }}>{request.bloodGroup}</div>
                      {request.urgent && (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[2px] uppercase bg-[#D62828] text-white rounded-full animate-pulse">🚨 {t('home.urgentLabel')}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 text-[10px] font-semibold tracking-[2px] uppercase bg-[rgba(214,40,40,0.15)] text-[#D62828] border border-[rgba(214,40,40,0.3)] rounded-full">{request.status}</span>
                  </div>
                  <div className="text-base font-semibold text-[#F5E6E0] mb-1.5">{t('home.for')} {request.recipientName}</div>
                  <div className="text-sm text-[#B09090]">{request.hospitalName}</div>
                  <div className="mt-5 flex gap-4 flex-wrap text-xs text-[#B09090]">
                    <span className="flex items-center gap-1.5">{request.district}</span>
                  </div>
                  <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
                    <span className="text-xs text-[#B09090]">{new Date(request.donationDate).toLocaleDateString()}</span>
                    <span className="text-[#D62828] text-xs font-semibold tracking-[1.5px] uppercase flex items-center gap-1.5">{t('home.details')} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[#B09090]">{t('home.noPendingRequests')}</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            to="/blood-donation-requests" 
            className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase inline-block hover:bg-[#FF2D2D] transition-all"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
          >
            {t('home.viewAllRequests')}
          </Link>
        </div>
      </section>

      {/* Donation Camps */}
      <section className="py-24 px-[60px]" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 70%), #0A0505' }}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#D62828]"></div>
              <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('home.campsLabel')}</span>
            </div>
            <h2 className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
              {t('home.campsTitle1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif", fontStyle: 'italic' }}>{t('home.campsTitle2')}</em>
            </h2>
          </div>
          <Link
            to="/donation-camps"
            className="hidden md:block bg-[#D62828] text-white px-9 py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all"
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            {t('home.viewAllCamps')}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {campItems.map((item, i) => (
            <div key={i} className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-7 hover:border-[rgba(214,40,40,0.4)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)] flex items-center justify-center text-2xl mb-5">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[#F5E6E0] mb-2">{item.title}</h3>
              <p className="text-sm text-[#B09090] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center md:hidden mt-8">
          <Link
            to="/donation-camps"
            className="bg-[#D62828] text-white px-9 py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all inline-block"
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            {t('home.viewAllCamps')}
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#D62828] py-14 px-[60px]">
        <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.15)]">
          {[
            { num: '12K+', label: t('home.registeredDonors') },
            { num: '4K+', label: t('home.requestsFulfilled') },
            { num: '64', label: t('home.districts') },
            { num: '8', label: t('home.bloodGroups') },
          ].map((stat, i) => (
            <div key={i} className="px-5 py-5 text-center">
              <div className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px', lineHeight: 1 }}>{stat.num}</div>
              <div className="text-sm font-medium tracking-[2px] uppercase text-white/70 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-[60px] text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #150A0A 0%, #1E0E0A 100%)' }}>
        <div className="absolute inset-0 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" style={{ background: 'radial-gradient(ellipse, rgba(139, 0, 0, 0.3) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }}></div>
        <h2 className="text-[#F5E6E0] relative z-10 mb-7" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 100px)', letterSpacing: '2px' }}>
          {t('home.beAHero')} <span className="text-[#D62828]" style={{ textShadow: '0 0 60px rgba(214, 40, 40, 0.5)' }}>{t('home.hero')}</span><br/>{t('home.today')}
        </h2>
        <p className="text-[#B09090] relative z-10 max-w-md mx-auto mb-12">
          {t('home.ctaDesc')}
        </p>
        <div className="relative z-10 flex flex-wrap justify-center gap-5">
          <Link 
            to="/register" 
            className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
          >
            {t('home.registerAsDonor')}
          </Link>
          <Link 
            to="/blood-donation-requests" 
            className="px-10 py-4 text-sm font-semibold tracking-[2px] uppercase text-[#F5E6E0] border border-[rgba(255,255,255,0.2)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            {t('home.postARequest')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
