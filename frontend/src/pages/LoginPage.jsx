import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sakshi@streamflix.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecaptchaDetail, setShowRecaptchaDetail] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result && result.success) {
      navigate('/');
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#131313] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      {/* Immersive Cinematic Vignette Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-25 grid grid-cols-3 gap-3 scale-105 filter blur-[1px]">
          <div className="flex flex-col gap-3">
            <div className="h-56 sm:h-72 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5b8iRXWQso2k5nmco0LBRke1uG7lBREdHBMnV6DNs5a53wU1WU6n5O6HeG4OqYDKNqorPpX3tZ9Huse9nfmsgj1gjc8NU18GtMr2OhNRP3-wqEE5X2qPRd0FQHagfw1gWF3kadMpJazX-ZbFNXv-5NLBUdMfDnnlUED6TCK9FGU9-GTUdd2S52ZEGKDiHgCzWhLbeO0nZKrqQU7MU_fIJd42kuwpKlVrhgroSQFWntKFnGzsVEjllug')" }}></div>
            <div className="h-64 sm:h-80 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBc8xTLCH0CO-UJGJzB1vmoEDvW0W9fR_aCz6hHIVYIAWSxBbhCrAOVtrAcztAGakgkLIiOsssRfk8AmodzICForaETlTIIfrJfVNdyMlVHvrA-Adsic1wYDdMuvyc0OT6F7_oPtsBXAABmkMAZORQuN23vL-DwYawRaOK99Qdi8EJgoWU4rguMXnIftQO_XTf07G130TrWkRxXlqTFwivLPqj9ekREZUvtNL4KCGVUuE3EAa5SlMDC_w')" }}></div>
          </div>
          <div className="flex flex-col gap-3 -translate-y-10">
            <div className="h-64 sm:h-80 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBstNs6TX4KXHss8lQK2qwznxeoutCew1G5RXvzR_RSEP9ngPOa5SkPph9r5J5GYiQ3rfznm9nIen-22ThWzOIw8GUuGM8MchhtwHMQqzG7BLzkl_eD0Sq7z7t7V9GWTcr7g-oDHHlO0OaQThX5UKFLei0U4eQsxIukB6Y1cc5p4K4Yk2A8XLoMHx78MTOYm3X-aAxKg0dbELSjgHqf_WbnIhA_Qa0cdRPTE2al-uzOLTcJ_2qySXOMgQ')" }}></div>
            <div className="h-56 sm:h-72 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNTYtYLuz0YmKknEeqy08JPVtvhE39EDtxILSxknr4zZ3mTUmK4wJ-9D1-EVtdgw_ADwlOANG1HeNA1J66E6ZUAmz_4x8kJATssoAZifL1no9L73B7Lj5HJWaV6knBdgfbtuTGxMbepOi0o8jS6G5vXIHyb8O6uM1hVyTyIOhS7kqk_f7B-Bx-UOW7o-aTZkLjC4fNh6ieaZCZm-jaD8E5DmojveuGHbPM4aER9egD3ecFx9KnBWHH-Q')" }}></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-60 sm:h-76 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkwBQt4Xfqwl3jVLexTcjdfdIqLoUcf9u4BGqPPPn3okufijviYgY9SBO5MZLSMA8x6_Z-pIc5yMPxBrY__YJJsIqJ-X2tmWdymz80eBpjo9kaqCygxr3zLGSIrizUi9zPpqPK0vBhoNPp3dPAqWZ-MXGHLBvPgsaGk5mPNGFgNW97K7jagZU5pcxZTHkBMbyHYK24m9WGgl1dwprJAD2HCVregl8qcQAgvlQe4T7J8FTDKjV1m1Xg2A')" }}></div>
            <div className="h-60 sm:h-76 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAu6-wb_Wk0bfTmWY3pu8IyNMf-7sfQCjxX1dcRILrs4UUI1vmQ194EhjCv2hnEpZ4JlNheFRQvacoNvYlP7cWvjaUq0izX2eKaBY-D1gGCsIkKYCflU_rlwAzixUsxluO240gdLu_lKXbPHxgrKIOQsPb3Dwe4srtl45vVUyawRejkz_Dt6WD3VqhK4UE4kYxoqTLFHGq3NDGBt9y6v0ozzuj-OgupiaLIZ70QYyFdLfhDWXKGrEo0_w')" }}></div>
          </div>
        </div>
        {/* Radial Scrim & Contrast Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/90 to-[#131313]/60"></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, transparent 10%, #131313 85%)' }}></div>
      </div>

      {/* Header Logo */}
      <header className="relative z-10 w-full max-w-lg flex justify-center items-center pt-4 pb-6">
        <svg className="h-12 w-auto drop-shadow-[0_4px_20px_rgba(229,9,20,0.5)] transition-transform duration-300 hover:scale-105" viewBox="0 0 160 44" fill="none">
          <path d="M12 4L12 40L20 40L20 20L34 40L42 40L42 4L34 4L34 24L20 4L12 4Z" fill="#E50914"/>
          <text x="48" y="32" fill="#E50914" fontFamily="'Bebas Neue', Arial, sans-serif" fontWeight="900" fontSize="30" letterSpacing="4">STREAMFLIX</text>
        </svg>
      </header>

      {/* EXPANDED & TALLER Main Authentication Card (Sakshi's feedback implemented) */}
      <main className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl my-auto">
        <div className="bg-[#0e0e0e]/90 backdrop-blur-2xl rounded-2xl p-8 sm:p-12 md:p-14 shadow-2xl border border-white/10 flex flex-col space-y-7">
          
          {/* Title & Live Status */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
                {isSignUpMode ? 'Sign Up' : 'Sign In'}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[#E50914] text-xs font-bold uppercase tracking-widest bg-[#E50914]/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
                Live
              </span>
            </div>
            <p className="text-sm text-[#A3A3A3]">
              {isSignUpMode ? 'Create your account to start your free 30-day trial.' : 'Enter your credentials to access your personalized cinema feed.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Email Field */}
            <div className="relative">
              <input
                id="userIdentifier"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 bg-[#201f1f] text-white px-4 pt-4 pb-1 rounded-xl border border-white/15 focus:border-white focus:outline-none transition-colors text-base"
              />
              <label 
                htmlFor="userIdentifier"
                className="absolute left-4 top-4 text-[#A3A3A3] text-sm pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#A3A3A3]"
              >
                Email or phone number
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                id="userPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 bg-[#201f1f] text-white px-4 pt-4 pb-1 pr-16 rounded-xl border border-white/15 focus:border-white focus:outline-none transition-colors text-base"
              />
              <label 
                htmlFor="userPassword"
                className="absolute left-4 top-4 text-[#A3A3A3] text-sm pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#A3A3A3]"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-xs font-bold text-[#A3A3A3] hover:text-white px-2 py-1 rounded"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#E50914] text-white rounded-xl font-bold text-base tracking-wider uppercase transition-all duration-200 hover:bg-[#b81d24] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-[#E50914]/40 hover:shadow-[#E50914]/60"
            >
              {isLoading ? (
                <span className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {isSignUpMode ? 'Start Membership' : 'Sign In'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center py-2">
              <div className="flex-grow h-px bg-white/10"></div>
              <span className="px-4 text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">OR</span>
              <div className="flex-grow h-px bg-white/10"></div>
            </div>

            {/* Secondary CTA */}
            <button
              type="button"
              onClick={() => showToast('A fast one-time sign-in code has been dispatched to your linked devices.')}
              className="w-full h-12 bg-[#454747]/60 text-white rounded-xl font-semibold text-sm transition-all hover:bg-[#454747] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-[#A3A3A3]">vpn_key</span>
              Use a Sign-In Code
            </button>

            {/* Auxiliary Navigation */}
            <div className="flex items-center justify-between pt-2 text-xs text-[#A3A3A3]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#E50914] rounded cursor-pointer" 
                />
                <span className="group-hover:text-white transition-colors">Remember me</span>
              </label>

              <button 
                type="button" 
                onClick={() => showToast('Contacting 24/7 Concierge Support...')} 
                className="hover:text-white hover:underline transition-colors"
              >
                Need help?
              </button>
            </div>
          </form>

          {/* Member Conversion Toggle */}
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
            <div className="flex items-baseline space-x-2 text-sm text-[#A3A3A3]">
              <span>{isSignUpMode ? 'Already have an account?' : 'New to StreamFlix?'}</span>
              <button 
                onClick={() => setIsSignUpMode(!isSignUpMode)}
                className="text-white font-bold hover:text-[#E50914] transition-colors underline underline-offset-4"
              >
                {isSignUpMode ? 'Sign in now.' : 'Sign up now.'}
              </button>
            </div>

            {/* Google reCAPTCHA Notice */}
            <div className="text-xs text-[#737373] space-y-1 leading-relaxed">
              <p>
                This page is protected by Google reCAPTCHA to ensure you are not a bot.
                <button 
                  type="button" 
                  onClick={() => setShowRecaptchaDetail(!showRecaptchaDetail)}
                  className="text-[#E50914] hover:underline font-medium ml-1"
                >
                  {showRecaptchaDetail ? 'Show less.' : 'Learn more.'}
                </button>
              </p>
              {showRecaptchaDetail && (
                <p className="pt-1 text-[#737373]/80 animate-fadeIn">
                  The information collected by Google reCAPTCHA is subject to the Google Privacy Policy and Terms of Service, and is used for security purposes.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-lg text-center pt-6 pb-2 text-xs text-[#737373]">
        Questions? Call <span className="text-[#A3A3A3]">1-800-STREAM-FLIX</span>
      </footer>
    </main>
  );
};
