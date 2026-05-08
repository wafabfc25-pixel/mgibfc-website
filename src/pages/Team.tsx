import { motion } from "motion/react";
import { ChevronLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

export const TeamPage = ({ t }: { t: any }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leaders = t.team.leaders;

  return (
    <div className="pt-24 lg:pt-32 pb-40 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">{t.aboutPage.back}</span>
        </Link>
        
        <div className="max-w-4xl mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-secondary/30" />
              <span className="label-caps">{t.team.badge}</span>
            </div>
            <h1 className="text-ink mb-8 leading-tight">
              {t.team.title} <br />
              <span className="text-secondary italic font-normal tracking-tight">{t.team.titleItalic}</span>
            </h1>
            <p className="text-lg text-gray/80 max-w-2xl leading-relaxed">
              {t.team.desc}
            </p>
          </motion.div>
        </div>

        {/* Leaders Grid */}
        <div className="grid sm:grid-cols-2 gap-12 lg:gap-20 max-w-4xl mx-auto mb-32">
          {leaders.map((l: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group flex flex-col items-center"
            >
              <div className="aspect-[4/5] w-full max-w-[280px] lg:max-w-[320px] rounded-[2.5rem] overflow-hidden mb-6 lg:mb-8 transition-all duration-1000 shadow-2xl shadow-ink/5 relative bg-soft-gray">
                <img 
                  src={l.img} 
                  alt={l.name} 
                  className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=2052a3&color=fff&size=512`;
                  }}
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="text-center">
                <h3 className="text-[#2052a3] mb-1.5 text-[22px] lg:text-[26px]">{l.name}</h3>
                <div className="label-caps mb-4 text-[10px] lg:text-xs text-secondary">{l.role}</div>
                <div className="w-12 h-0.5 bg-secondary/30 mx-auto mb-4" />
                <p className="text-sm italic max-w-[240px] mx-auto text-gray/70 leading-relaxed">
                  {t.team.expertiseLabel} : {l.expertise}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Team Section */}
        <div className="pt-20 border-t border-ink/5">
          <div className="text-center max-w-2xl mx-auto mb-16 px-4">
             <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-8 h-px bg-secondary/40" />
                <span className="label-caps">{t.team.teamSectionTitle}</span>
                <div className="w-8 h-px bg-secondary/40" />
             </div>
             <h2 className="text-ink mb-6">{t.team.teamSectionTitle}</h2>
             <p className="text-gray/70">{t.team.teamSectionDesc}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
            {/* Placeholder for future team members */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="group flex flex-col items-center"
              >
                <div className="aspect-square w-full rounded-[2rem] bg-soft-gray border border-ink/5 shadow-sm overflow-hidden mb-4 relative flex items-center justify-center group-hover:shadow-xl transition-all duration-500">
                  <Plus size={32} className="text-gray/20 group-hover:text-[#00929f] transition-all duration-500 group-hover:rotate-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="h-4 w-24 bg-ink/10 rounded-full mx-auto mb-2 animate-pulse lg:animate-none group-hover:bg-ink/20" />
                   <div className="h-3 w-16 bg-ink/5 rounded-full mx-auto animate-pulse lg:animate-none group-hover:bg-ink/10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
