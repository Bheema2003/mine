import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Camera, Video, Calendar, Music, MailOpen, Clock, Lock, User, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const VideoItem = ({ 
  video, 
  index, 
  activeVideoIndex, 
  setActiveVideoIndex 
}: { 
  video: string; 
  index: number;
  activeVideoIndex: number | null;
  setActiveVideoIndex: (index: number | null) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const isPlaying = activeVideoIndex === index;

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Playback blocked", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setActiveVideoIndex(null);
    } else {
      setActiveVideoIndex(index);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play/pause
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      key={index}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0 }
      }}
      whileHover={{ 
        scale: 1.01,
        filter: "brightness(1.05)"
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="relative group overflow-hidden rounded-[2rem] cursor-pointer"
      onClick={handleTogglePlay}
    >
      <div className="bg-gray-900 shadow-xl overflow-hidden relative transform-gpu transition-all duration-500 group-hover:shadow-pink-200/30">
        <video 
          ref={videoRef}
          src={`/memories/${video}`} 
          loop 
          muted={isMuted}
          playsInline
          className="w-full h-auto max-h-[60vh] object-contain mx-auto transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 pointer-events-none group-hover:pointer-events-auto">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all transform hover:scale-110">
            {isPlaying ? <Pause className="text-white w-8 h-8" /> : <Play className="text-white w-8 h-8 fill-white" />}
          </div>
          <button 
            onClick={toggleMute}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all transform hover:scale-110"
          >
            {isMuted ? <VolumeX className="text-white w-8 h-8" /> : <Volume2 className="text-white w-8 h-8" />}
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-white/90 fill-white/40 drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <h3 className="text-white font-handwriting text-3xl drop-shadow-lg">Moment #{index + 1}</h3>
      </div>
    </motion.div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [, setDaysTogether] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'joeforever' && password === 'BJ19042004') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect username or password, my love.');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize sparkles
    const initialSparkles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setSparkles(initialSparkles);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      // Updated anniversary date to 2004-04-19 based on password hint
      const anniversaryDate = new Date('2004-04-19'); 
      const diffTime = Math.abs(now.getTime() - anniversaryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 15,
        },
      ]);
    }, 1000); // More frequent hearts
    return () => clearInterval(interval);
  }, []);

  const allImages = [
    "WhatsApp Image 2026-05-15 at 8.49.38 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.38 AM (2).jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.38 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.39 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.39 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.40 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.46 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.47 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.47 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.48 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.48 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.49 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.50 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.49.52 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.00 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.01 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.01 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.02 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.02 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.03 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.33 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.35 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.35 AM (2).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.35 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.36 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.36 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.37 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.37 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.38 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.50.38 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.51.40 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.05 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.07 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.09 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.09 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.10 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.10 AM (2).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.10 AM (3).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.10 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.11 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.12 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.15 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.15 AM.jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.16 AM (1).jpeg",
    "WhatsApp Image 2026-05-15 at 8.52.16 AM.jpeg"
  ];

  const allVideos = [
    "WhatsApp Video 2026-05-15 at 8.49.46 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.49.47 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.50.00 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.50.33 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.50.34 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.50.36 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.50.39 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.51.39 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.51.40 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.06 AM (1).mp4",
    "WhatsApp Video 2026-05-15 at 8.52.06 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.07 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.08 AM (1).mp4",
    "WhatsApp Video 2026-05-15 at 8.52.08 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.11 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.13 AM (1).mp4",
    "WhatsApp Video 2026-05-15 at 8.52.13 AM.mp4",
    "WhatsApp Video 2026-05-15 at 8.52.16 AM.mp4"
  ];

  return (
    <div className="min-h-screen bg-[#fff5f7] text-gray-800 font-serif selection:bg-romantic-pink selection:text-white overflow-x-hidden cursor-none">
      {/* Custom Heart Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] text-romantic-red hidden md:block"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16, scale: [1, 1.2, 1] }}
        transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5, scale: { repeat: Infinity, duration: 1 } }}
      >
        <Heart fill="currentColor" className="drop-shadow-lg" />
      </motion.div>

      {/* Magical Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-romantic-pink rounded-full"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: sparkle.delay 
            }}
          />
        ))}
      </div>

      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, y: '105vh', x: `${heart.x}vw`, rotate: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0], 
                y: '-10vh', 
                x: [`${heart.x}vw`, `${heart.x + (Math.random() * 20 - 10)}vw`],
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10 + Math.random() * 5, ease: 'easeInOut' }}
              className="absolute text-romantic-pink/40"
              style={{ fontSize: heart.size }}
            >
              <Heart fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#fff5f7]"
          >
            {/* Login Heart Bubble */}
            <motion.div 
              className="relative w-full max-w-md aspect-square flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Giant Heart Shape Container */}
              <div className="absolute inset-0 text-romantic-pink/10 drop-shadow-2xl">
                <Heart fill="currentColor" className="w-full h-full" />
              </div>

              {/* Form Content */}
              <div className="relative z-10 w-full px-12 text-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Heart className="w-16 h-16 text-romantic-red mx-auto mb-6 fill-romantic-red animate-pulse" />
                  <h2 className="text-4xl font-handwriting font-bold text-romantic-red mb-8">Welcome, My Love</h2>
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-romantic-pink w-5 h-5 transition-colors group-focus-within:text-romantic-red" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-100 rounded-full focus:outline-none focus:border-romantic-pink transition-all font-sans"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-romantic-pink w-5 h-5 transition-colors group-focus-within:text-romantic-red" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-100 rounded-full focus:outline-none focus:border-romantic-pink transition-all font-sans"
                        required
                      />
                    </div>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-romantic-red text-sm italic font-handwriting text-xl"
                      >
                        {error}
                      </motion.p>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full py-3 bg-romantic-red text-white rounded-full font-bold text-lg shadow-lg hover:bg-romantic-pink transition-all flex items-center justify-center gap-2 group"
                    >
                      Unlock Our Love <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
                    </motion.button>
                  </form>
                  <p className="mt-8 text-pink-300 text-sm italic">"Only for Bheema & Jyothu"</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-pink-100 px-6 py-4">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-romantic-red font-bold text-3xl font-handwriting"
                >
                  <Heart fill="currentColor" className="animate-pulse w-8 h-8" />
                  <span className="tracking-tighter">Bheema & Jyothu</span>
                </motion.div>
                <div className="hidden md:flex gap-8 text-romantic-red/70 font-medium">
                  <a href="#home" className="hover:text-romantic-red transition-colors relative group">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-romantic-red transition-all group-hover:w-full"></span>
                  </a>
                  <a href="#gallery" className="hover:text-romantic-red transition-colors relative group">
                    Gallery
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-romantic-red transition-all group-hover:w-full"></span>
                  </a>
                  <a href="#videos" className="hover:text-romantic-red transition-colors relative group">
                    Videos
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-romantic-red transition-all group-hover:w-full"></span>
                  </a>
                  <a href="#timeline" className="hover:text-romantic-red transition-colors relative group">
                    Timeline
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-romantic-red transition-all group-hover:w-full"></span>
                  </a>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-romantic-red/50 hover:text-romantic-red transition-colors text-sm uppercase tracking-widest flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" /> Lock
                  </button>
                </div>
              </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
              {/* Background Photo (Darker & Romantic) */}
              <div 
                className="absolute inset-0 z-0 pointer-events-none transform scale-110"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/memories/WhatsApp Image 2026-05-15 at 8.49.40 AM.jpeg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(1px)'
                }}
              />
              <motion.div
                style={{ y: (mousePos.y - window.innerHeight / 2) * -0.05, x: (mousePos.x - window.innerWidth / 2) * -0.05 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="z-10"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-8 inline-block p-6 rounded-full bg-white shadow-2xl shadow-pink-200/50"
                >
                  <Heart className="w-16 h-16 text-romantic-red fill-romantic-red" />
                </motion.div>
                <h1 className="text-6xl md:text-9xl font-bold text-white mb-8 drop-shadow-2xl tracking-tight">
                  Bheema & Jyothu <br/> 
                  <span className="text-romantic-pink font-handwriting font-normal text-7xl md:text-8xl block mt-4">Against The World</span>
                </h1>
                
                {/* Love Counter */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-4 mb-12"
                >
                  <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/20">
                    <span className="block text-4xl font-bold text-romantic-pink leading-none">∞</span>
                    <span className="text-sm text-white uppercase tracking-widest">Days of Love</span>
                  </div>
                  <div className="text-romantic-pink animate-bounce">
                    <Stars fill="currentColor" />
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-xl md:text-2xl text-pink-100 max-w-2xl mx-auto leading-relaxed italic drop-shadow-lg"
                >
                  "In all the world, there is no heart for me like yours. <br/>
                  In all the world, there is no love for you like mine."
                </motion.p>
                
                <motion.a
                  href="#gallery"
                  whileHover={{ scale: 1.05, backgroundColor: '#ff4d6d' }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-12 inline-flex items-center gap-3 px-10 py-5 bg-romantic-pink text-white rounded-full font-bold text-xl shadow-xl shadow-pink-200 transition-all group"
                >
                  Our Memories <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute bottom-10 left-10 animate-pulse text-romantic-pink/20">
                <Stars className="w-20 h-20" />
              </div>
              <div className="absolute top-20 right-10 animate-bounce text-romantic-pink/20">
                <Heart className="w-16 h-16" fill="currentColor" />
              </div>
            </section>

            {/* Love Letter Section */}
            <section className="py-24 px-6 bg-white relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto bg-pink-50/50 p-12 rounded-[2rem] border-2 border-dashed border-pink-200 relative"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg">
                  <MailOpen className="w-12 h-12 text-romantic-red" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">A Note For You</h2>
                  <p className="text-2xl text-gray-700 leading-loose font-handwriting">
                    "To my dearest Jyothu, I wanted to create this space to celebrate us. Every photo here is a reminder of a smile you gave me, and every video is a melody of your laughter. Thank you for being the most beautiful part of my life. I love you more with every heartbeat."
                  </p>
                  <div className="mt-8 text-romantic-red font-handwriting text-4xl">- Bheema</div>
                </div>
              </motion.div>
            </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-[#fff5f7]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-romantic-red font-bold tracking-widest uppercase text-sm mb-4 block">Our Visual Journey</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <Camera className="text-romantic-pink w-10 h-10" /> Moments Frozen in Time
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-romantic-pink to-transparent mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 italic">Total {allImages.length} beautiful memories captured</p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4"
          >
            {allImages.map((img, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.02,
                  zIndex: 10,
                  filter: "brightness(1.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative break-inside-avoid group cursor-pointer"
              >
                <img 
                  src={`/memories/${img}`} 
                  alt={`Memory ${i + 1}`}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl shadow-sm group-hover:shadow-pink-200/50 transition-all duration-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-romantic-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <span className="font-handwriting text-white text-xl drop-shadow-md">
                    {["Forever", "Always", "Love", "Us", "Mine", "Heart"][i % 6]}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section id="videos" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-romantic-red font-bold tracking-widest uppercase text-sm mb-4 block">Motion Memories</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <Video className="text-romantic-pink w-10 h-10" /> Our Love in Motion
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-romantic-pink to-transparent mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 italic">Total {allVideos.length} sweet videos playing for you</p>
          </div>
          
          <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {allVideos.map((video, i) => (
                      <VideoItem 
                        key={i} 
                        video={video} 
                        index={i} 
                        activeVideoIndex={activeVideoIndex}
                        setActiveVideoIndex={setActiveVideoIndex}
                      />
                    ))}
                  </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 px-6 bg-[#fff5f7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <Calendar className="text-romantic-pink w-10 h-10" /> The Chapters of Us
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-romantic-pink to-transparent mx-auto rounded-full"></div>
          </div>

                <div className="relative">
                  {/* Center Line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-pink-200 rounded-full hidden md:block"></div>

                  <div className="space-y-24">
                    {[
                      { date: 'Apr 19, 2004', title: 'The Day It All Began', event: 'The most special day that defined our future.' },
                      { date: 'Feb 14, 2023', title: 'Our Special Valentine', event: 'Celebrating our bond in the most romantic way.' },
                      { date: 'May 20, 2023', title: 'Our Adventure', event: 'Every trip with you is a memory I treasure.' },
                      { date: 'Forever', title: 'Our Future', event: 'Growing old together is my only wish.' },
                    ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 hover:border-romantic-pink transition-colors group">
                      <span className="text-romantic-red font-bold text-sm uppercase tracking-widest block mb-2">{item.date}</span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed font-handwriting text-2xl">"{item.event}"</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center">
                    <motion.div 
                      whileInView={{ scale: [0, 1.2, 1] }}
                      className="w-12 h-12 rounded-full bg-white border-4 border-romantic-pink flex items-center justify-center shadow-lg"
                    >
                      <Heart className="w-5 h-5 text-romantic-red fill-romantic-red" />
                    </motion.div>
                  </div>
                  
                  <div className="w-full md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-romantic-red text-white text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-10 inline-block"
          >
            <Heart fill="white" className="w-20 h-20 drop-shadow-lg" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">I Love You More Than Words Can Say</h2>
          <p className="text-pink-100 text-xl max-w-2xl mx-auto mb-12 font-light leading-loose">
            Thank you for being my partner, my best friend, and my home. <br/>
            This website is a small token of my infinite love for you.
          </p>
          
          <div className="flex justify-center gap-10 mb-16">
            <motion.div whileHover={{ y: -5 }} className="cursor-pointer bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-colors">
              <Music className="w-8 h-8" />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="cursor-pointer bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-colors">
              <Stars className="w-8 h-8" />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="cursor-pointer bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-colors">
              <Clock className="w-8 h-8" />
            </motion.div>
          </div>
          
          <div className="h-px w-32 bg-pink-300/30 mx-auto mb-10"></div>
          
          <p className="text-sm text-pink-200 tracking-[0.3em] uppercase font-bold">
            Forever & Always &hearts; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </motion.div>
  )}
</AnimatePresence>
</div>
);
}

export default App;
