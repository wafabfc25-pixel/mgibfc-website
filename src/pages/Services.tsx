import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, TrendingUp, Briefcase, ArrowLeft, ChevronRight, Info, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface Task {
  id: string;
  name: string;
  meaning: string;
  importance: string;
  example: string;
}

export const ServicesPage = ({ t }: { t: any }) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceDetails = [
    {
      id: "audit",
      title: t.services.cat1,
      simple: t.services.cat1Simple,
      result: t.services.cat1Result,
      icon: <ShieldCheck size={48} />,
      items: t.services.cat1Items,
      image: "/audit.avif"
    },
    {
      id: "advisory",
      title: t.services.cat2,
      simple: t.services.cat2Simple,
      result: t.services.cat2Result,
      icon: <TrendingUp size={48} />,
      items: t.services.cat2Items,
      image: "/tas.avif"
    },
    {
      id: "accounting",
      title: t.services.cat3,
      simple: t.services.cat3Simple,
      result: t.services.cat3Result,
      icon: <Briefcase size={48} />,
      items: t.services.cat3Items,
      image: "/comptabilite.jpg"
    }
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-40 bg-soft-gray/30 ring-opacity-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray hover:text-primary transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">{t.aboutPage.back}</span>
        </Link>

        {/* Header */}
        <div className="max-w-4xl mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary/30" />
              <span className="label-caps">{t.services.badge}</span>
            </div>
            <h1 className="text-ink mb-8 leading-tight">
              {t.services.title} <br />
              <span className="text-secondary italic font-normal tracking-tight">{t.services.titleItalic}</span>
            </h1>
            <p className="text-lg text-gray/80 max-w-2xl leading-relaxed">
              {t.about.desc}
            </p>
          </motion.div>
        </div>

        {/* Detailed Expertise */}
        <div className="space-y-32">
          {serviceDetails.map((service, i) => (
            <div 
              key={service.id}
              className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-start`}
            >
              {/* Left Column: Visual & Summary */}
              <div className={`w-full lg:w-5/12 ${i % 2 !== 0 ? 'lg:order-last' : ''}`}>
                <div className="sticky top-32">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-10 text-primary"
                  >
                    {service.icon}
                  </motion.div>
                  
                  <h2 className="text-ink mb-6">{service.title}</h2>
                  
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-ink/[0.03] border border-ink/5 mb-8">
                    <p className="text-gray text-lg leading-relaxed mb-6">
                      {service.simple}
                    </p>
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <CheckCircle2 className="text-green-600 mt-1 shrink-0" size={20} />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wider text-green-700 mb-1">{t.services.resultLabel}</p>
                        <p className="text-sm font-medium text-green-900">{service.result}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10" />
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tasks */}
              <div className="w-full lg:w-7/12">
                <div className="space-y-4">
                  {service.items.map((task: Task) => (
                    <motion.div
                      key={task.id}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                      layout
                      className={`relative overflow-hidden transition-all duration-500 rounded-[2rem] border ${
                        hoveredTask === task.id
                          ? "bg-[#2052a3] border-white/10 shadow-2xl shadow-primary/20"
                          : "bg-white border-ink/5"
                      }`}
                    >
                      <div className="p-8">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className={`text-xl font-serif font-bold transition-colors ${
                            hoveredTask === task.id ? "text-white" : "text-ink"
                          }`}>
                            {task.name}
                          </h4>
                          <div className={`p-2 rounded-full transition-colors ${
                            hoveredTask === task.id ? "bg-white/10 text-white" : "bg-primary/5 text-primary"
                          }`}>
                            <Info size={20} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {hoveredTask === task.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: "circOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-8 space-y-6">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">{t.services.taskTitle}</p>
                                  <p className="text-white/90 leading-relaxed font-medium">{task.meaning}</p>
                                </div>
                                
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">{t.services.taskWhy}</p>
                                  <p className="text-white/90 leading-relaxed font-medium">{task.importance}</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00929f] mb-2">{t.services.taskExample}</p>
                                  <p className="text-white/80 italic text-sm italic">{task.example}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 bg-[#2052a3] p-12 lg:p-20 rounded-[3rem] text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
          <h2 className="text-white mb-8 text- balance max-w-2xl mx-auto">Prêt à transformer vos enjeux financiers en opportunités ?</h2>
          <Link to="/#contact" className="inline-flex items-center gap-3 bg-[#00929f] text-white px-10 py-5 rounded-full label-caps !text-white hover:bg-white hover:!text-primary transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-black/10">
            Démarrer une collaboration
            <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
