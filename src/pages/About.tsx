import { motion, useInView, animate, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import { Target, Eye, Layers, Award, Lightbulb, Users, ArrowLeft, ShieldCheck, TrendingUp, Briefcase, Quote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Counter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const count = useMotionValue(0);
  
  const numericValue = parseInt(value.replace(/\D/g, ""), 10);
  const prefix = value.startsWith("+") ? "+" : "";
  const suffix = value.endsWith("%") ? "%" : "";

  const displayValue = useTransform(count, (latest) => 
    `${prefix}${Math.floor(latest)}${suffix}`
  );

  useEffect(() => {
    if (isInView) {
      count.set(0);
      animate(count, numericValue, {
        duration: 1.3,
        ease: [0.22, 1, 0.36, 1],
      });
    }
  }, [isInView, numericValue, count]);

  return <motion.span ref={ref} className="font-display">{displayValue}</motion.span>;
};

export const About = ({ t }: { t: any }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceDetails = [
    {
      title: t.services.cat1,
      icon: <ShieldCheck size={40} />,
      items: t.services.cat1Items,
      desc: "Notre pôle Audit garantit la fiabilité de vos informations financières et la robustesse de vos processus internes."
    },
    {
      title: t.services.cat2,
      icon: <TrendingUp size={40} />,
      items: t.services.cat2Items,
      desc: "Nous vous accompagnons dans vos décisions stratégiques de croissance, de financement et de restructuration."
    },
    {
      title: t.services.cat3,
      icon: <Briefcase size={40} />,
      items: t.services.cat3Items,
      desc: "Une gestion comptable et fiscale rigoureuse pour vous permettre de vous concentrer sur votre cœur de métier."
    }
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray hover:text-primary transition-colors mb-8 lg:mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">{t.aboutPage.back}</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 text-center lg:text-left mx-auto lg:mx-0">
          <h1 className="text-ink mb-6 lg:mb-8 text-[47px] leading-tight">
            {t.aboutPage.title} <br className="hidden sm:block" />
            <span className="text-secondary italic font-normal">{t.aboutPage.titleItalic}</span>
          </h1>
          <p className="text-justify lg:text-left text-[15px] lg:text-base">
            {t.about.desc}
          </p>
        </div>

        {/* Member of MGI Worldwide */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-ink mb-6 lg:mb-8 text-balance text-[31px] leading-tight">{t.about.mgiTitle}</h2>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              <div className="bg-white p-3 lg:p-4 rounded-xl shadow-lg border border-ink/5">
                <img 
                  src="/mgibfclogo.png" 
                  alt="MGI BFC" 
                  className="h-10 md:h-16 w-auto object-contain"
                />
              </div>
              <div className="bg-white p-3 lg:p-4 rounded-xl shadow-lg border border-ink/5">
                <img 
                  src="https://www.mgiworld.com/assets/img/logo/mgi-logo-v3.png" 
                  alt="MGI Worldwide" 
                  className="h-8 md:h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-12 border border-ink/5 shadow-sm overflow-hidden">
            {/* World Map Container with horizontal scroll on mobile */}
            <div className="overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide">
              <div className="relative w-full min-w-[700px] lg:min-w-0 aspect-[2/1] max-w-3xl mx-auto">
                {/* World Map Image (Restored) */}
                <div className="w-full h-full flex justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                    alt="World Map" 
                    className="w-full h-full object-contain opacity-100 transition-all duration-700"
                    style={{ 
                      filter: selectedRegion 
                        ? 'invert(85%) sepia(15%) saturate(500%) hue-rotate(185deg) brightness(95%) contrast(90%)' 
                        : 'invert(85%) sepia(15%) saturate(1000%) hue-rotate(185deg) brightness(95%) contrast(90%)' 
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

              {/* Region Labels - No Arrows */}
              <div className="absolute inset-0 pointer-events-none font-sans">
                {/* North America */}
                <div 
                  className={`absolute top-[20%] left-[8%] flex flex-col items-start lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'northAmerica' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'northAmerica' ? null : 'northAmerica')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'northAmerica' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'northAmerica' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="32" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1 text-left">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'northAmerica' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.northAmerica}</span>
                  </div>
                </div>

                {/* Latin America */}
                <div 
                  className={`absolute top-[62%] left-[18%] flex flex-col items-start lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'latinAmerica' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'latinAmerica' ? null : 'latinAmerica')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'latinAmerica' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'latinAmerica' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="63" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1 text-left">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'latinAmerica' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.latinAmerica}</span>
                  </div>
                </div>

                {/* UK & Ireland */}
                <div 
                  className={`absolute top-[6%] left-[48%] -translate-x-1/2 flex flex-col items-center text-center lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'ukIreland' ? '-translate-y-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'ukIreland' ? null : 'ukIreland')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'ukIreland' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'ukIreland' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="31" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'ukIreland' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.ukIreland}</span>
                  </div>
                </div>

                {/* Europe */}
                <div 
                  className={`absolute top-[24%] left-[45%] flex flex-col items-end text-right lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'europe' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'europe' ? null : 'europe')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'europe' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'europe' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="160" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'europe' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.europe}</span>
                  </div>
                </div>

                {/* Africa */}
                <div 
                  className={`absolute top-[55%] left-[48%] flex flex-col items-end text-right lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'africa' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'africa' ? null : 'africa')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'africa' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'africa' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="26" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'africa' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.africa}</span>
                  </div>
                </div>

                {/* MENA */}
                <div 
                  className={`absolute top-[48%] left-[58%] flex flex-col items-start lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'mena' ? '-translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'mena' ? null : 'mena')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'mena' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'mena' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="38" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1 text-left">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'mena' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.mena}</span>
                  </div>
                </div>

                {/* Asia */}
                <div 
                  className={`absolute top-[30%] left-[75%] flex flex-col items-start lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'asia' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'asia' ? null : 'asia')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'asia' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'asia' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="75" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1 text-left">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'asia' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.asia}</span>
                  </div>
                </div>

                {/* Australasia */}
                <div 
                  className={`absolute top-[72%] left-[82%] flex flex-col items-start lg:scale-100 cursor-pointer pointer-events-auto transition-all duration-300 ${selectedRegion === 'australasia' ? 'translate-x-1' : ''}`}
                  onClick={() => setSelectedRegion(selectedRegion === 'australasia' ? null : 'australasia')}
                >
                  <AnimatePresence>
                    {selectedRegion === 'australasia' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1.2 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -inset-8 bg-[#00929F] rounded-full blur-3xl -z-10" />
                    )}
                  </AnimatePresence>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[28px] lg:text-[32px] font-bold leading-none transition-colors duration-300 ${selectedRegion === 'australasia' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>
                      <Counter value="14" />
                    </span>
                  </div>
                  <div className="flex flex-col -mt-1 text-left">
                    <span className={`text-[9px] font-bold leading-tight transition-colors duration-300 ${selectedRegion === 'australasia' ? 'text-[#00929F]' : 'text-[#2052a3]'}`}>{t.about.mapRegions.offices}</span>
                    <span className="text-[9px] text-gray/70 leading-tight">{t.about.mapRegions.australasia}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <p className="mt-12 text-gray/60 text-center max-w-2xl mx-auto text-sm leading-relaxed">
              {t.references.networkDesc}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-10">
            <h2 className="text-ink mb-3 lg:mb-5">{t.about.missionVisionTitle}</h2>
            <div className="w-12 lg:w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-soft-gray p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] border border-ink/5 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm mb-5 lg:mb-6">
                <Target size={24} className="lg:w-7 lg:h-7" />
              </div>
              <h3 className="text-ink mb-3 lg:mb-4 text-xl lg:text-2xl">{t.about.missionTitle}</h3>
              <p className="text-[14px] lg:text-[15px] text-justify lg:text-left leading-relaxed">
                {t.about.missionDesc}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-soft-gray p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] border border-ink/5 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm mb-5 lg:mb-6">
                <Eye size={24} className="lg:w-7 lg:h-7" />
              </div>
              <h3 className="text-ink mb-3 lg:mb-4 text-xl lg:text-2xl">{t.about.visionTitle}</h3>
              <p className="text-[14px] lg:text-[15px] text-justify lg:text-left leading-relaxed">
                {t.about.visionDesc}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-10">
            <h2 className="text-ink mb-3 lg:mb-4">{t.about.valuesTitle}</h2>
            <div className="w-12 lg:w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Layers size={20} />, title: t.about.valFlex, desc: t.about.valFlexDesc },
              { icon: <Award size={20} />, title: t.about.valExc, desc: t.about.valExcDesc },
              { icon: <Lightbulb size={20} />, title: t.about.valInn, desc: t.about.valInnDesc },
              { icon: <Users size={20} />, title: t.about.valShare, desc: t.about.valShareDesc },
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-5 lg:p-7 bg-white border border-ink/5 rounded-[1.5rem] hover:shadow-xl transition-all duration-500 text-center group"
              >
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-soft-gray flex items-center justify-center text-primary mx-auto mb-3 lg:mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {v.icon}
                </div>
                <h3 className="label-caps !text-ink mb-1.5 lg:mb-2 text-[10px] lg:text-xs">{v.title}</h3>
                <p className="text-[12px] lg:text-[13px] text-gray/70 leading-snug">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20 lg:mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-ink/5 to-transparent" />
          
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12 pt-20">
            <h2 className="text-ink mb-3 lg:mb-4">{t.about.testimonialsTitle}</h2>
            <div className="w-12 lg:w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto">
            {t.about.testimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-soft-gray p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] border border-ink/5"
              >
                <div className="absolute -top-6 left-10 lg:left-14 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg">
                  <Quote size={24} fill="currentColor" />
                </div>
                
                <div className="space-y-6">
                  <p className="text-ink text-lg lg:text-xl italic leading-relaxed font-medium">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-ink/5">
                    <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center text-primary font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-ink font-bold text-sm lg:text-base leading-none mb-1">
                        {testimonial.author}
                      </h4>
                      <p className="text-gray/60 text-xs lg:text-sm uppercase tracking-widest font-semibold">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
