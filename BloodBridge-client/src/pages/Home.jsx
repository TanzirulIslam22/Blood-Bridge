import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
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

  return (
    <div>
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
            <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">Digital Blood Bank System</span>
          </div>
          <h1 className="text-[#F5E6E0] leading-none tracking-[2px]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 140px)' }}>
            GIVE<br/>
            <span className="text-[#D62828]" style={{ textShadow: '0 0 60px rgba(214, 40, 40, 0.5)' }}>BLOOD,</span><br/>
            <em className="not-italic text-[#B09090]" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.85em' }}>Save Lives</em>
          </h1>
          <p className="mt-7 text-base leading-relaxed text-[#B09090] max-w-lg">
            BloodBridge connects donors, patients, and hospitals in real-time. Find the right blood type, request a donation, and save a life — all in one platform.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Link 
              to="/register" 
              className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)', boxShadow: '0 0 30px rgba(214, 40, 40, 0.35)' }}
            >
              Register as Donor
            </Link>
            <Link 
              to="/blood-donation-requests" 
              className="text-[#B09090] text-sm font-medium tracking-[1.5px] uppercase flex items-center gap-2.5 hover:text-[#F5E6E0] transition-colors"
            >
              View Requests
              <span className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-xs">→</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden lg:flex absolute right-12 bottom-8 gap-8">
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              12<span className="text-[#D62828]">K+</span>
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">Registered Donors</div>
          </div>
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              4<span className="text-[#D62828]">K+</span>
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">Lives Saved</div>
          </div>
          <div className="text-right">
            <div className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1 }}>
              64
            </div>
            <div className="text-xs tracking-[2px] uppercase text-[#B09090]">Districts</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-[60px] bg-[#150A0A]" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">Process</span>
        </div>
        <h2 className="text-[#F5E6E0] mb-16" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
          How <em className="not-italic text-[#B09090]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>It Works</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-0">
            {[
              { num: '01', icon: '📝', name: 'Register as a Donor', desc: 'Create your profile with your blood group, district, and contact info. Join our network of life-saving donors across Bangladesh.' },
              { num: '02', icon: '🔍', name: 'Find or Post a Request', desc: 'Browse urgent blood requests near you, or post a request for a patient in need. Filter by blood group, district, and hospital.' },
              { num: '03', icon: '🩸', name: 'Donate & Save a Life', desc: 'Connect with the requester, confirm your donation, and mark it complete. Every drop counts — be a hero in someone\'s story.' },
            ].map((step, i) => (
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

          <div className="hidden md:flex items-center justify-center">
            <div className="w-[340px] h-[340px] rounded-full border border-[rgba(214,40,40,0.2)] flex items-center justify-center" style={{ 
              background: 'radial-gradient(circle at 40% 40%, rgba(214, 40, 40, 0.5) 0%, rgba(139, 0, 0, 0.3) 40%, rgba(20, 5, 5, 0.9) 75%, transparent 100%)',
              boxShadow: '0 0 80px rgba(139, 0, 0, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.5)' 
            }}>
              <div className="text-center">
                <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', lineHeight: 1, textShadow: '0 0 40px rgba(214, 40, 40, 0.35)' }}>🩸</div>
                <div className="text-xs tracking-[3px] uppercase text-[#B09090] mt-2">Save a Life Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Requests */}
      <section className="py-24 px-[60px] bg-[#150A0A]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#D62828]"></div>
              <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">Live Feed</span>
            </div>
            <h2 className="text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '2px' }}>
              Urgent <em className="not-italic text-[#B09090]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>Requests</em>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)]">
            <div className="w-2 h-2 rounded-full bg-[#D62828] animate-pulse"></div>
            <span className="text-xs font-semibold tracking-[2px] uppercase text-[#D62828]">Live Updates</span>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {requests.slice(0, 6).map((request) => (
              <Link key={request._id} to={`/blood-donation-requests/${request._id}`} className="block">
                <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-7 hover:border-[rgba(214,40,40,0.4)] hover:translate-y-[-3px] transition-all">
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1 }}>{request.bloodGroup}</div>
                    <span className="px-3 py-1 text-[10px] font-semibold tracking-[2px] uppercase bg-[rgba(214,40,40,0.15)] text-[#D62828] border border-[rgba(214,40,40,0.3)] rounded-full">{request.status}</span>
                  </div>
                  <div className="text-base font-semibold text-[#F5E6E0] mb-1.5">For: {request.recipientName}</div>
                  <div className="text-sm text-[#B09090]">{request.hospitalName}</div>
                  <div className="mt-5 flex gap-4 flex-wrap text-xs text-[#B09090]">
                    <span className="flex items-center gap-1.5">{request.district}</span>
                  </div>
                  <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
                    <span className="text-xs text-[#B09090]">{new Date(request.donationDate).toLocaleDateString()}</span>
                    <span className="text-[#D62828] text-xs font-semibold tracking-[1.5px] uppercase flex items-center gap-1.5">Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#B09090]">No pending blood requests at the moment</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/blood-donation-requests" 
            className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase inline-block hover:bg-[#FF2D2D] transition-all"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
          >
            View All Requests
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#D62828] py-14 px-[60px]">
        <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.15)]">
          {[
            { num: '12K+', label: 'Registered Donors' },
            { num: '4K+', label: 'Requests Fulfilled' },
            { num: '64', label: 'Districts Covered' },
            { num: '8', label: 'Blood Groups' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-5 px-5">
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
          BE A <span className="text-[#D62828]" style={{ textShadow: '0 0 60px rgba(214, 40, 40, 0.5)' }}>HERO</span><br/>TODAY
        </h2>
        <p className="text-[#B09090] relative z-10 max-w-md mx-auto mb-12">
          Join thousands of donors across Bangladesh. Your blood can be the difference between life and death for someone who needs it right now.
        </p>
        <div className="relative z-10 flex gap-5 justify-center flex-wrap">
          <Link 
            to="/register" 
            className="bg-[#D62828] text-white px-11 py-4 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-all"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
          >
            Register as Donor
          </Link>
          <Link 
            to="/blood-donation-requests" 
            className="px-10 py-4 text-sm font-semibold tracking-[2px] uppercase text-[#F5E6E0] border border-[rgba(255,255,255,0.2)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            Post a Request
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;