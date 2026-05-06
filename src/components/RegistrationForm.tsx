import { useState } from 'react';
import { savePlayer, isRegistrationOpen } from '../store';
import { Player } from '../types';

interface RegistrationFormProps {
  onRegistrationComplete: () => void;
  slotsLeft: number;
}

const FIELDS_STEP1 = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', icon: '👤' },
  { name: 'username', label: 'Game Username (eFootball ID)', type: 'text', placeholder: 'Your in-game name', icon: '🎮' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '09XXXXXXXX or 07XXXXXXXX', icon: '📱' },
  { name: 'telegram', label: 'Telegram Username', type: 'text', placeholder: '@yourusername', icon: '✈️' },
];

export default function RegistrationForm({ onRegistrationComplete, slotsLeft }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    telegram: '',
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const convertScreenshotToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Game username is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(09|07)\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid Ethiopian phone number (09/07XXXXXXXX)';
    }
    if (!formData.telegram.trim()) newErrors.telegram = 'Telegram username is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    if (!formData.transactionId.trim()) {
      setErrors({ transactionId: 'Transaction ID is required' });
      return;
    }

    const open = await isRegistrationOpen();
    if (!open) {
      setErrors({ general: 'Registration is full!' });
      return;
    }

    setLoading(true);
    try {
      let screenshotData = '';
      if (screenshot) screenshotData = await convertScreenshotToBase64(screenshot);

      const player: Player = {
        id: crypto.randomUUID(),
        ...formData,
        screenshotName: screenshot?.name,
        screenshotData,
        registeredAt: new Date().toISOString(),
        paymentStatus: 'pending',
      };

      const result = await savePlayer(player);
      setLoading(false);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => onRegistrationComplete(), 4000);
      } else {
        setErrors({ general: result.message });
      }
    } catch {
      setLoading(false);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 hero-gradient bg-grid">
        <div className="glass-card rounded-3xl neon-border-green p-10 max-w-lg w-full text-center animate-winner-reveal">
          <div className="w-20 h-20 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="font-orbitron text-2xl font-bold text-neon-green mb-2">
            You're In!
          </h2>
          <p className="text-gray-400 font-rajdhani text-lg mb-6">
            Welcome to the tournament,{' '}
            <span className="text-neon-blue font-bold">{formData.username}</span>!
          </p>
          <div className="bg-dark-700/80 rounded-2xl p-5 mb-6 text-left space-y-2 border border-white/5">
            <p className="text-neon-yellow font-rajdhani font-bold text-sm uppercase tracking-wider">📌 Next Steps:</p>
            <p className="text-gray-300 text-sm font-rajdhani">
              1. Report your payment on Telegram:{' '}
              <a href="https://t.me/NULLDNF" className="text-neon-blue hover:underline font-bold">@NULLDNF</a>
            </p>
            <p className="text-gray-300 text-sm font-rajdhani">
              2. Your payment is <span className="text-neon-yellow font-semibold">Pending</span> — it will be confirmed shortly.
            </p>
            <p className="text-gray-300 text-sm font-rajdhani">
              3. Join the tournament channel for match schedules.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-rajdhani">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            Redirecting to home...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pt-24 pb-16 hero-gradient bg-grid">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-neon-blue font-rajdhani font-semibold text-sm uppercase tracking-widest">
            Join the Battle
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black text-white mt-2 mb-2">
            Player{' '}
            <span className="text-gradient">Registration</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mt-4 rounded-full" />
          <p className="text-gray-400 font-rajdhani mt-4">
            {slotsLeft > 0 ? (
              <>Only <span className="text-neon-pink font-bold">{slotsLeft}</span> slots remaining. Secure yours now!</>
            ) : (
              <span className="text-red-400 font-bold">Tournament is full! Registration closed.</span>
            )}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2.5 transition-all duration-300 ${step >= s ? 'text-neon-blue' : 'text-gray-600'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-orbitron transition-all duration-300 ${
                  step > s
                    ? 'bg-neon-green border border-neon-green text-white'
                    : step === s
                    ? 'bg-neon-blue/20 border-2 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                    : 'bg-dark-700 border border-gray-700 text-gray-600'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className="font-rajdhani font-semibold text-sm hidden sm:block">
                  {s === 1 ? 'Personal Info' : 'Payment'}
                </span>
              </div>
              {s < 2 && (
                <div className={`w-16 h-0.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-neon-blue' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {slotsLeft <= 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center neon-border">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="font-orbitron text-xl font-bold text-red-400 mb-2">Registration Closed</h3>
            <p className="text-gray-400 font-rajdhani">All 32 slots have been filled. Stay tuned for the next tournament!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl neon-border overflow-hidden">

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="p-6 sm:p-8 space-y-5 animate-slide-up">
                <div className="mb-6">
                  <h3 className="font-orbitron text-lg font-bold text-white">Personal Information</h3>
                  <p className="text-gray-500 font-rajdhani text-sm mt-1">Fill in your details to secure your spot.</p>
                </div>

                {FIELDS_STEP1.map(field => (
                  <div key={field.name}>
                    <label className="block text-gray-300 font-rajdhani font-semibold text-sm mb-2">
                      {field.icon} {field.label} *
                    </label>
                    <input
                      id={`field-${field.name}`}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3.5 bg-dark-700/80 border rounded-xl text-white placeholder-gray-600 font-rajdhani focus:outline-none input-glow transition-all duration-200 ${
                        errors[field.name]
                          ? 'border-red-500/60 bg-red-500/5'
                          : 'border-white/8 hover:border-white/15 focus:border-neon-blue/50'
                      }`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-400 text-xs font-rajdhani mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="p-6 sm:p-8 space-y-5 animate-slide-up">
                <div className="mb-2">
                  <h3 className="font-orbitron text-lg font-bold text-white">Payment & Confirmation</h3>
                  <p className="text-gray-500 font-rajdhani text-sm mt-1">Complete your payment to finalize registration.</p>
                </div>

                {/* Payment Instructions */}
                <div className="relative rounded-2xl overflow-hidden border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📱</span>
                      <h4 className="font-rajdhani font-bold text-neon-blue text-base">Payment via Telebirr</h4>
                    </div>
                    <div className="space-y-2.5 font-rajdhani text-sm">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-neon-blue/20 text-neon-blue text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                        <p className="text-gray-300">Open <span className="text-neon-green font-semibold">Telebirr</span> on your phone</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-neon-blue/20 text-neon-blue text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                        <p className="text-gray-300">
                          Send payment to:{' '}
                          <button
                            type="button"
                            onClick={() => navigator.clipboard?.writeText('0917630143')}
                            className="text-neon-blue font-bold text-lg hover:text-white transition-colors cursor-pointer"
                            title="Click to copy"
                          >
                            0917630143
                          </button>
                          <span className="text-gray-500 text-xs ml-1">(tap to copy)</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-neon-blue/20 text-neon-blue text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                        <p className="text-gray-300">Copy the Transaction ID from your receipt</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-neon-blue/20 text-neon-blue text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">4</span>
                        <p className="text-gray-300">Enter the Transaction ID below and submit</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-neon-yellow/5 rounded-xl border border-neon-yellow/20">
                      <p className="text-neon-yellow/90 text-xs font-rajdhani font-semibold">
                        ⚠️ After payment, report on Telegram:{' '}
                        <a href="https://t.me/NULLDNF" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">@NULLDNF</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-gray-300 font-rajdhani font-semibold text-sm mb-2">
                    🧾 Transaction ID *
                  </label>
                  <input
                    id="field-transactionId"
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter your Telebirr transaction ID"
                    className={`w-full px-4 py-3.5 bg-dark-700/80 border rounded-xl text-white placeholder-gray-600 font-rajdhani focus:outline-none input-glow transition-all ${
                      errors.transactionId ? 'border-red-500/60' : 'border-white/8 hover:border-white/15 focus:border-neon-blue/50'
                    }`}
                  />
                  {errors.transactionId && (
                    <p className="text-red-400 text-xs font-rajdhani mt-1.5">⚠️ {errors.transactionId}</p>
                  )}
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-gray-300 font-rajdhani font-semibold text-sm mb-2">
                    📸 Payment Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshot}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex flex-col items-center justify-center w-full h-36 bg-dark-700/80 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-neon-blue/40 hover:bg-neon-blue/5 transition-all duration-200"
                  >
                    {screenshotPreview ? (
                      <div className="flex items-center gap-3">
                        <img src={screenshotPreview} alt="preview" className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                        <div>
                          <p className="text-neon-green font-rajdhani font-semibold text-sm">✅ {screenshot?.name}</p>
                          <p className="text-gray-500 text-xs font-rajdhani">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-gray-500 text-4xl block mb-2">📸</span>
                        <p className="text-gray-500 font-rajdhani text-sm">Click to upload payment screenshot</p>
                        <p className="text-gray-600 text-xs font-rajdhani mt-1">PNG, JPG, WEBP — Max 5MB</p>
                      </div>
                    )}
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-neon-blue font-rajdhani text-sm font-semibold hover:text-neon-purple transition-colors flex items-center gap-1"
                >
                  ← Back to personal info
                </button>
              </div>
            )}

            {/* Global Error */}
            {errors.general && (
              <div className="px-6 sm:px-8 pb-2">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 font-rajdhani text-sm flex items-center gap-2">
                  <span>⚠️</span> {errors.general}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="p-6 sm:p-8 pt-2">
              <button
                id="form-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-orbitron font-bold text-white text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-neon-blue to-neon-purple btn-glow"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting Registration...
                  </span>
                ) : step === 1 ? '📋 Continue to Payment →' : '🎮 Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
