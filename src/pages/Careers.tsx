import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Briefcase, Search, ArrowRight, ArrowLeft, X, Upload, Phone, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Careers = ({ t }: { t: any }) => {
  const [filter, setFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const jobs = t.careers.jobs;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredJobs = filter === "All" 
    ? jobs 
    : jobs.filter((job: any) => job.category === filter);

  const categories = [
    { name: "All", label: t.careers.filterAll },
    { name: "audit", label: t.careers.filterAudit },
    { name: "consulting", label: t.careers.filterConsulting },
    { name: "accounting", label: t.careers.filterAccounting },
  ];

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-soft-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray hover:text-primary transition-colors mb-8 lg:mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">{t.aboutPage.back}</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 text-center lg:text-left mx-auto lg:mx-0">
          <h1 className="text-ink mb-6 lg:mb-8 text-balance">
            {t.careers.title} <br className="hidden sm:block" />
            <span className="text-secondary italic font-normal">{t.careers.titleItalic}</span>
          </h1>
          <p className="text-[15px] lg:text-base text-justify lg:text-left">
            {t.careers.desc}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 lg:gap-4 mb-10 lg:mb-12 justify-center lg:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-6 lg:px-8 py-2.5 lg:py-3 rounded-full label-caps transition-all duration-300 text-[10px] lg:text-xs ${
                filter === cat.name 
                  ? "bg-[#2052a3] !text-white shadow-lg shadow-primary/20" 
                  : "bg-white !text-gray hover:bg-gray/5 border border-ink/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job: any) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-ink/5 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6 lg:mb-8">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-soft-gray flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Briefcase size={20} className="lg:w-6 lg:h-6" />
                  </div>
                  <span className="px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-secondary/10 label-caps text-[9px] lg:text-[10px]">
                    {job.type}
                  </span>
                </div>
                
                <h3 className="text-ink mb-3 lg:mb-4 group-hover:text-primary transition-colors text-[18px] lg:text-[22px]">
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-3 lg:gap-4 text-gray/60 text-[10px] lg:text-xs mb-5 lg:mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="lg:w-3.5 lg:h-3.5" />
                    {job.location}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray/20" />
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="lg:w-3.5 lg:h-3.5" />
                    {job.type}
                  </div>
                </div>

                <p className="flex-grow text-[14px] lg:text-[15px] mb-6 lg:mb-8 text-gray/80">
                  {job.desc}
                </p>

                <button 
                  onClick={() => handleApply(job)}
                  className="w-full py-4 rounded-xl lg:rounded-2xl bg-soft-gray text-ink label-caps !text-ink hover:bg-primary hover:!text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-95"
                >
                  {t.careers.apply}
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray italic">Aucune offre ne correspond à votre recherche pour le moment.</p>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-ink mb-2">Postuler</h2>
                    <p className="text-sm">Poste : <span className="text-primary font-bold">{selectedJob?.title}</span></p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center text-gray hover:bg-primary hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsFormOpen(false); alert('Candidature envoyée avec succès !'); }}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="label-caps !text-gray/60 ml-1">Prénom & Nom</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/40" size={18} />
                        <input required type="text" className="w-full pl-12 pr-5 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm" placeholder="Jean Dupont" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="label-caps !text-gray/60 ml-1">Adresse E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/40" size={18} />
                        <input required type="email" className="w-full pl-12 pr-5 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm" placeholder="jean.dupont@email.com" />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="label-caps !text-gray/60 ml-1">Numéro de téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/40" size={18} />
                        <input required type="tel" className="w-full pl-12 pr-5 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm" placeholder="+216 -- --- ---" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="label-caps !text-gray/60 ml-1">Poste souhaité</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/40" size={18} />
                        <input required type="text" defaultValue={selectedJob?.title} className="w-full pl-12 pr-5 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-caps !text-gray/60 ml-1">Pièce jointe (CV)</label>
                    <div className="relative group">
                      <input required type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full p-8 border-2 border-dashed border-gray/20 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                        <Upload className="text-gray/40 group-hover:text-primary transition-colors" size={32} />
                        <p className="text-xs text-gray/60 group-hover:text-primary/60 transition-colors">Cliquez ou glissez votre CV ici (PDF, DOCX)</p>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#00929f] text-white py-5 rounded-2xl label-caps !text-white hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-secondary/20 mt-4">
                    {t.careers.apply}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

