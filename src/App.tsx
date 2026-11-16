import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Music,
  VolumeX,
  Sparkles,
  Mail
} from 'lucide-react';
import { Toaster } from 'sonner';
import { EnvelopeOpening } from './components/EnvelopeOpening';
import { CountdownTimer } from './components/CountdownTimer';
import { PhotoGallery } from './components/PhotoGallery';
import { EventTimeline } from './components/EventTimeline';
import { RSVPForm } from './components/RSVPForm';
import { BlessingForm } from './components/BlessingForm';
import { FloatingParticles } from './components/FloatingParticles';
import { readGuestFromLocation } from './guest';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] as const },
});

export default function App() {
  const [guestName] = useState(() => readGuestFromLocation());
  const [showInvitation, setShowInvitation] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    audioRef.current = new Audio('/beautiful-in-white.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicStart = () => {
    setIsMusicPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };



  if (!showInvitation) {
    return (
      <EnvelopeOpening
        onComplete={() => setShowInvitation(true)}
        onMusicStart={handleMusicStart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100/40 relative overflow-x-hidden">
      <Toaster position="top-center" />
      <FloatingParticles />

      {/* Music Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7d8f4e] to-[#3b4a24] text-white shadow-[0_4px_20px_rgba(125,143,78,0.4)] flex items-center justify-center hover:scale-110 transition-transform border border-lime-200/40"
      >
        {isMusicPlaying ? <Music className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </motion.button>

      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7d8f4e]/30 via-transparent to-transparent" />
      </motion.div>

      {/* Hero Section */}
      {/* exactly one screen tall; content is sized to sit in the white space between the flower borders */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 pt-[17svh] pb-[19svh] md:pt-[19vh] md:pb-[20vh]">
        {/* Floral frame background: portrait image covers on phones; on wider screens it repeats
            sideways at full height so the top & bottom flower borders are never cropped away */}
        <div
          className="absolute inset-0 z-0 bg-white bg-center bg-cover bg-no-repeat md:bg-[length:auto_100%] md:bg-repeat-x"
          style={{ backgroundImage: 'url("/download%20(2).png")' }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          {/* soft white glow so text stays crisp over the floral frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[85%] w-[110%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92),rgba(255,255,255,0.55)_55%,transparent_75%)] blur-2xl"
          />

          <div className="relative">
            {/* Pre-title */}
            <motion.div {...rise(0.5)} className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-5">
              <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#b8892d]" />
              <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.45em] pl-[0.45em] text-[#1f4a32] uppercase">
                Promise Of Love
              </span>
              <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#b8892d]" />
            </motion.div>

            {/* Verse */}
            <motion.p
              {...rise(0.65)}
              className="relative mx-auto w-fit max-w-xl px-7 mb-4 sm:mb-6 font-serif italic text-[15px] sm:text-xl leading-snug text-[#1f4a32]/80"
            >
              <span aria-hidden="true" className="absolute -left-1 sm:left-0 -top-2 font-script text-4xl sm:text-5xl leading-none text-[#b8892d]/70">&ldquo;</span>
              Thus from that time on they are no longer two, but one
              <span aria-hidden="true" className="absolute -right-1 sm:right-0 -bottom-5 font-script text-4xl sm:text-5xl leading-none text-[#b8892d]/70">&rdquo;</span>
            </motion.p>

            {/* Families */}
            <motion.div
              {...rise(0.8)}
              className="mb-2 sm:mb-3 font-serif uppercase text-[10px] sm:text-[13px] tracking-[0.14em] sm:tracking-[0.2em] leading-relaxed text-stone-600"
            >
              <p>Mr. Russel Ferdinand &amp; Mrs. Sanjeewani Wickremasinghe</p>
              <p className="font-script normal-case tracking-normal text-xl sm:text-3xl text-[#b8892d] my-0.5 sm:my-1">together with</p>
              <p>Mr. Senevirathna &amp; Mrs. Anusha Padmalatha</p>
            </motion.div>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-script font-normal leading-[1.05] text-[2.9rem] sm:text-[4.6rem] md:text-[5.6rem] whitespace-nowrap mb-1 sm:mb-2"
            >
              <span className="hero-gold">Rashini</span>
              <motion.span
                className="inline-block align-middle mx-0.5 sm:mx-3 text-[0.5em] text-[#1f4a32]"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                &amp;
              </motion.span>
              <span className="hero-gold">Rumesh</span>
            </motion.h1>

            {/* Invitation line */}
            <motion.div {...rise(1.25)} className="mx-auto mt-2 sm:mt-3 mb-4 sm:mb-6 max-w-md font-serif italic text-[13px] sm:text-base leading-relaxed text-stone-600">
              {guestName ? (
                <>
                  We cordially invite
                  <br />
                  <span className="not-italic inline-block font-script text-[1.7rem] sm:text-4xl text-[#1f4a32] my-0.5 sm:my-1">{guestName}</span>
                  <br />
                  to celebrate our special day with us.
                </>
              ) : (
                <>
                  Warmly request the honour of the presence of <br />
                  <span className="not-italic font-cinzel text-xs sm:text-sm tracking-[0.2em] text-[#1f4a32]">Mr. &amp; Mrs. / Miss</span> <br />
                  to celebrate the marriage of their loving children
                </>
              )}
            </motion.div>

            {/* Decorative Line */}
            <motion.div {...rise(1.4)} className="flex justify-center mb-2 sm:mb-4" aria-hidden="true">
              <svg viewBox="0 0 240 24" className="w-48 sm:w-64 h-5 sm:h-6">
                <defs>
                  <linearGradient id="heroRuleL" x1="0" x2="1">
                    <stop offset="0" stopColor="#b8892d" stopOpacity="0" />
                    <stop offset="1" stopColor="#b8892d" />
                  </linearGradient>
                  <linearGradient id="heroRuleR" x1="1" x2="0">
                    <stop offset="0" stopColor="#b8892d" stopOpacity="0" />
                    <stop offset="1" stopColor="#b8892d" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="12" x2="96" y2="12" stroke="url(#heroRuleL)" strokeWidth="1" />
                <line x1="144" y1="12" x2="240" y2="12" stroke="url(#heroRuleR)" strokeWidth="1" />
                <path d="M100 12 L106 8 L112 12 L106 16 Z M128 12 L134 8 L140 12 L134 16 Z" fill="#b8892d" opacity="0.7" />
                <path
                  d="M120 18s-6-3.9-6-7.8c0-2.2 1.6-3.7 3.5-3.7 1.1 0 2 .5 2.5 1.3.5-.8 1.4-1.3 2.5-1.3 1.9 0 3.5 1.5 3.5 3.7 0 3.9-6 7.8-6 7.8z"
                  fill="#b8892d"
                />
              </svg>
            </motion.div>

            {/* Subtitle – date */}
            <motion.div {...rise(1.55)} className="text-[#1f4a32]">
              <p className="font-script text-[1.7rem] sm:text-4xl text-[#b8892d] leading-none mb-2 sm:mb-3">On</p>
              <div className="flex items-center justify-center gap-3 sm:gap-5 [font-variant-numeric:lining-nums]">
                <span className="w-24 sm:w-32 py-2 border-y border-[#b8892d]/50 font-cinzel text-[11px] sm:text-sm tracking-[0.3em] uppercase">
                  Friday
                </span>
                <span className="hero-gold font-serif font-semibold text-5xl sm:text-7xl leading-none">15</span>
                <span className="w-24 sm:w-32 py-1 border-y border-[#b8892d]/50 font-cinzel text-[11px] sm:text-sm tracking-[0.3em] uppercase leading-snug">
                  January
                  <br />
                  2027
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.55))_drop-shadow(0_0_8px_rgba(31,74,50,0.45))]"
        >
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase whitespace-nowrap pl-[calc(1rem+0.35em)] pr-4 py-1.5 rounded-full bg-[#1f4a32]/55 backdrop-blur-sm border border-white/30">
            Scroll Down
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2 bg-[#1f4a32]/45 backdrop-blur-sm">
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Wedding Story Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-12 uppercase tracking-widest">
              A Match Made In Heaven
            </h2>

            <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-12 shadow-xl border-2 border-[#7d8f4e]/30 relative">
              <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-[#7d8f4e]" />
              <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-[#7d8f4e]" />
              <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-[#7d8f4e]" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-[#7d8f4e]" />

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-serif">
                <p>
                  We are getting married and would love to celebrate with you.
                  A romantic day filled with love, flowers, music, and the people who mean the most to us.
                </p>
                <p>
                  Thank you for being part of our most beautiful chapter.
                  We're excited for a lifetime of love, joy, and togetherness.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-lime-50/50 to-transparent relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-serif text-[#4a5d23] text-center mb-16 uppercase tracking-widest"
          >
            Wedding Details
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-8 shadow-xl border-2 border-[#7d8f4e]/30 text-center relative group"
            >
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#7d8f4e] opacity-50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#7d8f4e] opacity-50" />

              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7d8f4e] to-[#556b2f] flex items-center justify-center text-white">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#4a5d23] mb-3">Date</h3>
              <p className="text-xl text-gray-700 font-serif">January 15, 2027</p>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Friday</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-8 shadow-xl border-2 border-[#7d8f4e]/30 text-center relative group"
            >
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#7d8f4e] opacity-50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#7d8f4e] opacity-50" />

              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7d8f4e] to-[#556b2f] flex items-center justify-center text-white">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#4a5d23] mb-3">Time</h3>
              <p className="text-xl text-gray-700 font-serif">10:15 AM</p>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Poruwa Ceremony</p>
              <p className="text-xl text-gray-700 font-serif mt-4">11:00 AM - 4:00 PM</p>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Wedding Celebration</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-8 shadow-xl border-2 border-[#7d8f4e]/30 text-center relative group"
            >
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#7d8f4e] opacity-50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#7d8f4e] opacity-50" />

              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7d8f4e] to-[#556b2f] flex items-center justify-center text-white">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#4a5d23] mb-3">Venue</h3>
              <p className="text-xl text-gray-700 font-serif">River Green Resort</p>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Panadura</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-4 uppercase tracking-widest">
              Counting Down
            </h2>
            <p className="text-xl text-gray-600 font-serif">
              Until the marriage of Rashini & Rumesh
            </p>
          </motion.div>

          <CountdownTimer />
        </div>
      </section>

      {/* Event Timeline Section */}
      <section id="timeline" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-4 uppercase tracking-widest">
              Event Timeline
            </h2>
          </motion.div>

          <EventTimeline />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-lime-50/50 to-transparent relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-4 uppercase tracking-widest">
              Location
            </h2>
            <p className="text-xl text-gray-600 font-serif">
              River Green Resort, Panadura
            </p>
          </motion.div>

          <div className="grid gap-8 max-w-xl mx-auto">
            {[
              {
                name: 'River Green Resort',
                place: 'Panadura',
                map: 'https://www.google.com/maps/search/?api=1&query=River+Green+Resort+Panadura',
              },
            ].map((venue) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-stone-50 rounded-2xl overflow-hidden shadow-xl border-2 border-[#7d8f4e]/30"
              >
                <div className="relative bg-gradient-to-br from-[#f0f7f1] via-[#e8f4ea] to-[#ddeee0] py-12 flex flex-col items-center justify-center gap-3 border-b border-[#7d8f4e]/20 px-4 text-center">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(#90b996 1px, transparent 1px), linear-gradient(90deg, #90b996 1px, transparent 1px)',
                      backgroundSize: '40px 40px'
                    }}
                  />
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute w-24 h-24 rounded-full bg-[#7d8f4e]/30"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7d8f4e] to-[#556b2f] flex items-center justify-center shadow-xl">
                        <MapPin className="w-7 h-7 text-white" fill="white" />
                      </div>
                    </motion.div>
                  </div>
                  <p className="relative z-10 text-[#4a5d23] font-serif text-lg font-semibold tracking-widest uppercase">
                    {venue.name}
                  </p>
                  <p className="relative z-10 text-gray-500 text-sm uppercase tracking-widest">
                    {venue.place}
                  </p>
                </div>

                <div className="p-8 text-center font-serif">
                  <a
                    href={venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7d8f4e] to-[#556b2f] text-white font-serif text-sm tracking-widest uppercase shadow-lg hover:scale-105 transition-transform"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-4 uppercase tracking-widest">
              RSVP
            </h2>
          </motion.div>

          <RSVPForm />
        </div>
      </section>

      {/* Blessing Messages Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-lime-50/30 to-transparent relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-[#4a5d23] mb-4 uppercase tracking-widest">
              Blessings & Wishes
            </h2>
            <p className="text-xl text-gray-600 font-serif">
              Share your love and blessings with Rashini & Rumesh
            </p>
          </motion.div>

          <BlessingForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <Heart className="w-12 h-12 mx-auto text-[#7d8f4e] mb-4" fill="#7d8f4e" />
            </div>

            <p className="text-2xl font-serif text-[#4a5d23] mb-4">
              We would be honored to celebrate this beautiful moment with you
            </p>

            <div className="flex items-center justify-center gap-4 my-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-[#7d8f4e]" />
              <Sparkles className="w-5 h-5 text-[#7d8f4e]" />
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-[#7d8f4e]" />
            </div>

            <div className="text-3xl font-serif text-[#4a5d23] mb-2 uppercase tracking-[0.2em]">
              Rashini & Rumesh
            </div>

            <p className="text-gray-500 font-serif tracking-widest text-sm uppercase">
              January 15, 2027 • River Green Resort, Panadura
            </p>
          </motion.div>

          <div className="mt-12 pt-6 border-t border-[#7d8f4e]/20">
            <p className="text-[#7d8f4e] text-xs mt-2 font-sans tracking-wider">
              Want a beautiful wedding website like this? Create yours with{' '}
              <a
                target="_blank"
                rel="noreferrer"
                className="text-[#4a5d23] font-semibold hover:text-[#6b7f3a] underline"
                href="https://wa.me/94707819074"
              >
                invitemint
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}