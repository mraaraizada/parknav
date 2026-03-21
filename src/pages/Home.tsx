import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Navigation, Zap, CreditCard, ChevronRight,
  Star, Menu, X, ArrowRight, Car, BarChart3, Shield,
  CheckCircle2, ChevronLeft, Smartphone, Map
} from 'lucide-react';
import { testimonials } from '../data/mockParkingData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ParkNav Logo" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-xl font-bold text-slate-800">ParkNav</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
          {['Features', 'How it Works', 'Pricing', 'About'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="hover:text-blue-500 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-blue-500 transition-colors">
            Login
          </button>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300"
          >
            Sign Up
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 px-6 pb-4"
          >
            {['Features', 'How it Works', 'Pricing', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="block py-3 text-slate-700 font-medium border-b border-slate-50 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-2.5 border border-blue-500 text-blue-500 rounded-xl font-medium text-sm">
                Login
              </button>
              <Link
                to="/dashboard"
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium text-sm text-center"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Floating background elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-10 bg-blue-400"
          style={{
            width: 60 + i * 40,
            height: 60 + i * 40,
            left: `${5 + i * 16}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live parking available across Delhi
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Find Parking{' '}
              <span className="text-blue-500">Instantly</span>
              <br />
              <span className="text-3xl lg:text-4xl text-slate-600 font-semibold">
                Park Smarter, Not Harder
              </span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Real-time parking availability across Delhi. Navigate, reserve, and park
              with confidence using AI-powered smart routing.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
              >
                <Search size={18} />
                Find Parking
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 border border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5"
              >
                <Map size={18} />
                Explore Map
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { label: 'Parking Spots', value: '500+' },
                { label: 'Happy Drivers', value: '50K+' },
                { label: 'Cities', value: '12' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Map card */}
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100">
                {/* Fake map */}
                <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                  {/* Grid lines */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full border-t border-blue-200/50"
                      style={{ top: `${i * 20}%` }}
                    />
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full border-l border-blue-200/50"
                      style={{ left: `${i * 14}%` }}
                    />
                  ))}

                  {/* Roads */}
                  <div className="absolute w-full h-3 bg-white/60 top-1/2 -translate-y-1/2" />
                  <div className="absolute h-full w-3 bg-white/60 left-1/3" />
                  <div className="absolute h-full w-3 bg-white/60 left-2/3" />

                  {/* Parking pins */}
                  {[
                    { left: '25%', top: '30%', status: 'available', label: '45' },
                    { left: '55%', top: '55%', status: 'limited', label: '8' },
                    { left: '70%', top: '25%', status: 'full', label: '0' },
                    { left: '40%', top: '70%', status: 'available', label: '62' },
                  ].map((pin, i) => (
                    <motion.div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{ left: pin.left, top: pin.top }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                          pin.status === 'available'
                            ? 'bg-green-500'
                            : pin.status === 'limited'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {pin.label}
                      </div>
                      <div className={`w-2 h-2 rotate-45 -mt-1 ${
                        pin.status === 'available' ? 'bg-green-500' : pin.status === 'limited' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </motion.div>
                  ))}

                  {/* User location */}
                  <motion.div
                    className="absolute"
                    style={{ left: '48%', top: '48%' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-50" />
                  </motion.div>
                </div>

                {/* Info card */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Car size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">Connaught Place</div>
                    <div className="text-xs text-slate-500">45 spots available · ₹60/hr</div>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg">
                    Book
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-slate-100"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Spot Reserved!</div>
                  <div className="text-xs text-slate-400">0.8 km away</div>
                </div>
              </motion.div>

              {/* Live badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-slate-100"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="text-xs font-semibold text-slate-700">Live Updates</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Search,
      color: 'bg-blue-100 text-blue-600',
      title: 'Smart Search',
      desc: 'Find nearby parking instantly with AI-powered recommendations based on your destination.',
    },
    {
      icon: Navigation,
      color: 'bg-indigo-100 text-indigo-600',
      title: 'Live Map Navigation',
      desc: 'Interactive map with real-time parking markers and turn-by-turn directions.',
    },
    {
      icon: Zap,
      color: 'bg-amber-100 text-amber-600',
      title: 'Real-time Availability',
      desc: 'Live parking status updates every 30 seconds so you always have accurate information.',
    },
    {
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
      title: 'Easy Booking',
      desc: 'Reserve and pay instantly with UPI, cards, or digital wallets. QR entry included.',
    },
    {
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      title: 'Smart Analytics',
      desc: 'Parking heatmaps and demand forecasting help you plan your trips better.',
    },
    {
      icon: Shield,
      color: 'bg-rose-100 text-rose-600',
      title: 'Safe & Secure',
      desc: 'All listed parking lots are verified with CCTV and security coverage details.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-bold text-slate-800 mt-3">Everything you need to park smarter</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            ParkNav combines real-time data, smart routing, and seamless booking into one powerful app.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59,130,246,0.12)' }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-default"
            >
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Open ParkNav', desc: 'Launch the app and allow location access for personalized results.' },
    { num: '02', title: 'Search Destination', desc: 'Type your destination or choose from suggested locations near you.' },
    { num: '03', title: 'Choose Parking Spot', desc: 'Browse available spots with prices, distance and amenities info.' },
    { num: '04', title: 'Book Instantly', desc: 'Reserve your spot in one tap with instant payment confirmation.' },
    { num: '05', title: 'Navigate & Park', desc: 'Follow turn-by-turn directions and use QR code for entry.' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <Smartphone size={40} className="mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Download ParkNav</h3>
              <p className="text-blue-100 mb-6 relative z-10">
                Available for iOS and Android. Join 50,000+ drivers who park smarter every day.
              </p>

              {/* Fake phone UI */}
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/30 rounded-xl flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 h-8 bg-white/20 rounded-lg flex items-center px-3">
                    <span className="text-xs text-white/70">Search parking near Connaught Place...</span>
                  </div>
                </div>
                {[
                  { name: 'CP Parking A', price: '₹60/hr', spots: '45 spots', color: 'bg-green-400' },
                  { name: 'Palika Bazaar', price: '₹80/hr', spots: '8 spots', color: 'bg-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                    <div className={`w-3 h-3 ${item.color} rounded-full`} />
                    <span className="text-xs text-white flex-1">{item.name}</span>
                    <span className="text-xs text-white/70">{item.price}</span>
                    <span className="text-xs text-white/50">{item.spots}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right steps */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">How It Works</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-3">Park in 5 simple steps</h2>
            </motion.div>

            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-5 items-start"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-200"
              >
                Try Demo <ArrowRight size={16} />
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  const stats = [
    { label: 'Avg. Time Saved', value: '15 min', sub: 'Per parking search', color: 'text-blue-500' },
    { label: 'Parking Spots', value: '500+', sub: 'Across 12 cities', color: 'text-green-500' },
    { label: 'Success Rate', value: '94%', sub: 'Booking accuracy', color: 'text-amber-500' },
    { label: 'Active Users', value: '50K+', sub: 'Daily drivers', color: 'text-indigo-500' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Intelligence</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-6">Smart Parking Intelligence</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              ParkNav analyzes city parking patterns to show you the fastest available spots.
              Our AI predicts demand so you always find a spot when you need it.
            </p>
            <div className="space-y-3">
              {['Traffic aware routing', 'Live availability updates', 'Smart spot recommendations', 'EV charging station finder'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-slate-800 font-semibold text-sm">{stat.label}</div>
                <div className="text-slate-400 text-xs mt-1">{stat.sub}</div>
              </motion.div>
            ))}

            {/* Parking heatmap preview */}
            <div className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Parking Demand Heatmap</span>
                <span className="text-xs text-slate-400">Live</span>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {[...Array(32)].map((_, i) => {
                  const heat = Math.random();
                  return (
                    <div
                      key={i}
                      className="h-5 rounded"
                      style={{
                        backgroundColor:
                          heat > 0.7 ? '#EF4444' : heat > 0.4 ? '#F59E0B' : '#10B981',
                        opacity: 0.6 + heat * 0.4,
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded inline-block" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded inline-block" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded inline-block" /> High</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActiveIndex(i => (i + 1) % testimonials.length);

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-bold text-slate-800 mt-3">Loved by drivers across Delhi</h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xl text-slate-700 leading-relaxed mb-8 max-w-2xl mx-auto">
                "{testimonials[activeIndex].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[activeIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">{testimonials[activeIndex].name}</div>
                  <div className="text-sm text-slate-500">{testimonials[activeIndex].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all ${
                    i === activeIndex ? 'w-6 h-2.5 bg-blue-500' : 'w-2.5 h-2.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              right: -50 + i * 20,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-white mb-5">Ready to park smarter?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ drivers who save time every day with ParkNav's intelligent parking system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 shadow-lg transition-all hover:-translate-y-0.5">
              <Smartphone size={20} />
              Download App
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              <MapPin size={20} />
              Open Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'ParkNav', links: ['About Us', 'Our Mission', 'Blog', 'Careers'] },
    { title: 'Features', links: ['Smart Search', 'Live Map', 'Booking', 'Analytics'] },
    { title: 'Company', links: ['Press', 'Partners', 'Investors', 'Legal'] },
    { title: 'Resources', links: ['Documentation', 'API', 'Community', 'Status'] },
    { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQ', 'Report Issue'] },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin size={14} color="white" />
            </div>
            <span className="text-white font-bold">ParkNav</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 ParkNav. All rights reserved. Smart parking for smart cities.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
