import { motion, useInView, animate, useMotionValue, useTransform, useScroll } from "motion/react";
import { 
  ArrowRight, 
  Globe,
  Layers, 
  Lightbulb, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  Target,
  Eye,
  Award,
  Briefcase,
  MapPin,
  Mail,
  Linkedin,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CLIENTS = [
  { name: "Aziza", logo: "/aziza.jpg" },
  { name: "Vistaprint", logo: "/vistaprint.jpg" },
  { name: "ABCO", logo: "/abco.jpg" },
  { name: "Linedata", logo: "/linedata.png" },
  { name: "Dr. Oetker", logo: "/dr-oetker.png" },
  { name: "Leoni", logo: "/leoni.jpg" },
  { name: "Altrad", logo: "/altrad.png" },
  { name: "Hutchinson", logo: "/hutchinson.jpg" },
  { name: "Vilavi", logo: "/vilavi.png" },
];

const SICARS = [
  { name: "UGFS", logo: "/ugfs.png" }, 
  { name: "BIAT Capital", logo: "/biat-capital.png" },
  { name: "BH Equity", logo: "/bh-equity.png" },
  { name: "Tuninvest", logo: "/tuninvest.jpg" },
  { name: "Zitouna Capital", logo: "/zitouna-capital.jpg" },
  { name: "Mediterrania Capital Partners", logo: "/mediterrania-capital-partners.png" },
  { name: "RMBV", logo: "/rmbv.jpg" },
];

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

const Hero = ({ t }: { t: any }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section className="relative min-h-[600px] lg:h-screen flex items-center overflow-hidden bg-ink py-20 lg:py-0">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/hero.jpg" 
          alt="MGI BFC - Expertise & Conseil" 
          className="w-full h-[120%] object-cover opacity-70 lg:opacity-100"
        />
        <div className="absolute inset-0 bg-ink/60 z-10" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-20">
        <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-white mb-6 lg:mb-8">
              {t.hero.title1} <br className="hidden sm:block" />
              <span className="text-secondary italic font-normal text-balance">{t.hero.title2}</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/80 mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0"
            >
              {t.hero.desc}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <a href="#services" className="group bg-[#00929f] text-white px-8 lg:px-10 py-4 lg:py-5 rounded-full font-bold flex items-center justify-center transition-all duration-500 hover:bg-secondary hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 active:scale-95">
                {t.hero.btnServices}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="px-8 lg:px-10 py-4 lg:py-5 rounded-full font-bold flex items-center justify-center border border-white/30 text-white bg-white/5 hover:bg-white hover:text-ink transition-all duration-500 hover:scale-105 active:scale-95">
                {t.hero.btnContact}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const KeyFigures = ({ t }: { t: any }) => {
  const figures = [
    { label: t.figures.expertise, value: "+16" },
    { label: t.figures.projects, value: "+300" },
    { label: t.figures.clients, value: "+100" },
    { label: t.figures.countries, value: "+20" },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white border-y border-ink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {figures.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2052a3] mb-2 lg:mb-4 tracking-tighter">
                <Counter value={f.value} />
              </div>
              <div className="label-caps !text-gray text-[10px] lg:text-xs">{f.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = ({ t }: { t: any }) => {
  const serviceCategories = [
    {
      title: t.services.cat1,
      icon: <ShieldCheck size={32} />,
      items: t.services.cat1Items,
    },
    {
      title: t.services.cat2,
      icon: <TrendingUp size={32} />,
      items: t.services.cat2Items,
    },
    {
      title: t.services.cat3,
      icon: <Briefcase size={32} />,
      items: t.services.cat3Items,
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 lg:mb-16 gap-10">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-6">
              <div className="w-8 h-px bg-secondary/40" />
              <span className="label-caps">{t.services.badge}</span>
            </div>
            <h2 className="text-ink text-balance">
              {t.services.title} <br className="hidden sm:block" />
              <span className="text-secondary italic font-normal">{t.services.titleItalic}</span>
            </h2>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Link to="/services" className="group flex items-center gap-3 label-caps !text-gray hover:!text-primary transition-colors">
              {t.services.viewAll}
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {serviceCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bg-soft-gray p-8 lg:p-10 rounded-[2rem] hover:bg-primary transition-all duration-500 lg:hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-primary/20 flex flex-col"
            >
              <div className="text-[#00949f] mb-4 group-hover:text-white transition-all duration-500">
                {cat.icon}
              </div>
              <h3 className="text-[#2052a3] mb-4 lg:mb-6 group-hover:text-white transition-colors italic text-[20px] lg:text-[22px] text-center">{cat.title}</h3>
              <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-8 flex-grow">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[13px] lg:text-sm text-gray group-hover:text-white/70 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-secondary group-hover:bg-white mt-1.5 shrink-0 transition-colors" />
                    {item.name}
                  </li>
                ))}
              </ul>
              <Link to="/services" className="w-full py-3 sm:py-4 px-6 rounded-xl border border-ink/10 text-ink label-caps !text-ink text-center group-hover:border-white/20 group-hover:!text-white hover:bg-white hover:!text-primary transition-all duration-300 block">
                {t.services.learnMore}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Team = ({ t }: { t: any }) => {
  const leaders = t.team.leaders;

  return (
    <section id="team" className="py-16 lg:py-24 bg-soft-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 lg:mb-16 gap-10">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-6">
              <div className="w-8 h-px bg-secondary/40" />
              <span className="label-caps">{t.team.badge}</span>
            </div>
            <h2 className="text-ink">
              {t.team.title} <br className="hidden sm:block" />
              <span className="text-secondary italic font-normal">{t.team.titleItalic}</span>
            </h2>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-6 mx-auto lg:mx-0">
            <p className="max-w-sm text-center lg:text-right text-[15px] lg:text-base">{t.team.desc}</p>
            <Link to="/team" className="group flex items-center gap-3 label-caps !text-primary hover:!text-dark-blue transition-colors text-xs">
              Voir toute l'équipe
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-12 lg:gap-20 max-w-4xl mx-auto">
          {leaders.map((l: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group flex flex-col items-center"
            >
              <div className="aspect-[4/5] w-full max-w-[280px] lg:max-w-[320px] rounded-[2rem] overflow-hidden mb-6 lg:mb-8 transition-all duration-1000 shadow-lg relative">
                <img 
                  src={l.img} 
                  alt={l.name} 
                  className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="text-center">
                <h3 className="text-[#2052a3] mb-1.5 text-[22px] lg:text-[26px]">{l.name}</h3>
                <div className="label-caps mb-4 text-[10px] lg:text-xs text-secondary">{l.role}</div>
                <div className="w-12 h-0.5 bg-secondary/30 mx-auto mb-4" />
                <p className="text-sm italic max-w-[240px] mx-auto text-gray/70 leading-relaxed">{t.team.expertiseLabel} : {l.expertise}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
const References = ({ t }: { t: any }) => {
  return (
    <section id="references" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#00929f]" />
              <span className="label-caps !text-[#00929f]">{t.references.badge}</span>
            </div>
            <h2 className="text-[#2052a3] mb-6">
              {t.references.title}
            </h2>
          </div>
          <div className="bg-soft-gray p-10 rounded-[2.5rem] border border-ink/5 max-w-md shadow-xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Globe size={24} />
              </div>
              <h4 className="label-caps !text-[#2052a3]">{t.references.networkTitle}</h4>
            </div>
            <p className="text-sm leading-relaxed relative z-10">
              {t.references.networkDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="flex animate-scroll whitespace-nowrap py-4">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, idx) => (
              <div key={idx} className="inline-flex items-center justify-center mx-8 lg:mx-16 group">
                <div className="relative px-8 py-4 bg-soft-gray rounded-2xl border border-transparent group-hover:border-[#00929f]/20 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-500 min-w-[160px] flex justify-center">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-10 md:h-14 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/mgibfclogo.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 justify-center opacity-50">
            <div className="h-px bg-[#00929f]/30 flex-grow max-w-[100px]" />
            <h3 className="label-caps text-[10px] tracking-widest whitespace-nowrap text-center">{t.references.sicarTitle}</h3>
            <div className="h-px bg-[#00929f]/30 flex-grow max-w-[100px]" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-scroll-reverse whitespace-nowrap py-4">
            {[...SICARS, ...SICARS, ...SICARS].map((sicar, idx) => (
              <div key={idx} className="inline-flex items-center justify-center mx-8 lg:mx-16 group">
                <div className="relative px-8 py-4 bg-soft-gray rounded-2xl border border-transparent group-hover:border-[#00929f]/20 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-500 min-w-[160px] flex justify-center">
                  <img 
                    src={sicar.logo} 
                    alt={sicar.name} 
                    className="h-8 md:h-12 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/mgibfclogo.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = ({ t }: { t: any }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // We'll use a serverless function to protect the email sending logic
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-soft-gray">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary/30" />
              <span className="label-caps">{t.contact.badge}</span>
            </div>
            <h2 className="text-ink mb-10">
              {t.contact.title} <br />
              <span className="text-secondary italic font-normal">{t.contact.titleItalic}</span>
            </h2>
            <p className="mb-16 max-w-lg text-justify">{t.contact.desc}</p>
            
            <div className="space-y-10">
              <div className="flex gap-8 group">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=MGI+BFC+Golden+Tower+Tunis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2052a3] shadow-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500"
                >
                  <MapPin size={28} />
                </a>
                <div className="flex flex-col justify-center">
                  <h4 className="label-caps mb-1">{t.contact.address}</h4>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=MGI+BFC+Golden+Tower+Tunis" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors font-medium"
                  >
                    Immeuble Golden Tower B8.2, centre urbain nord - Tunis
                  </a>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2052a3] shadow-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="label-caps mb-2">{t.contact.email}</h4>
                  <p className="text-sm">contact@bfc.com.tn</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <a 
                  href="https://www.linkedin.com/company/mgi-bfc/?originalSubdomain=tn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2052a3] shadow-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500"
                >
                  <Linkedin size={28} />
                </a>
                <div className="flex flex-col justify-center">
                  <h4 className="label-caps mb-1">{t.contact.linkedin}</h4>
                  <a 
                    href="https://www.linkedin.com/company/mgi-bfc/?originalSubdomain=tn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors font-medium"
                  >
                    MGI BFC
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white p-8 lg:p-16 rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-black/5 border border-ink/5"
          >
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-serif mb-4">Merci !</h3>
                <p className="text-gray mb-8">Votre message a été envoyé avec succès. Notre équipe reviendra vers vous rapidement.</p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="label-caps !text-primary hover:underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2 lg:space-y-3">
                    <label className="label-caps !text-gray/60 ml-1 text-[10px] lg:text-xs">{t.contact.form.firstName}</label>
                    <input name="firstName" required type="text" className="w-full p-4 lg:p-5 bg-soft-gray rounded-xl lg:rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm placeholder:text-gray/40" placeholder="Jean" />
                  </div>
                  <div className="space-y-2 lg:space-y-3">
                    <label className="label-caps !text-gray/60 ml-1 text-[10px] lg:text-xs">{t.contact.form.lastName}</label>
                    <input name="lastName" required type="text" className="w-full p-4 lg:p-5 bg-soft-gray rounded-xl lg:rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm placeholder:text-gray/40" placeholder="Dupont" />
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="label-caps !text-gray/60 ml-1 text-[10px] lg:text-xs">{t.contact.form.email}</label>
                  <input name="email" required type="email" className="w-full p-4 lg:p-5 bg-soft-gray rounded-xl lg:rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm placeholder:text-gray/40" placeholder="jean.dupont@entreprise.com" />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="label-caps !text-gray/60 ml-1 text-[10px] lg:text-xs">{t.contact.form.service}</label>
                  <div className="relative">
                    <select name="service" className="w-full p-4 lg:p-5 bg-soft-gray rounded-xl lg:rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all text-sm appearance-none">
                      {t.contact.form.services.map((s: string, idx: number) => (
                        <option key={idx} className="bg-white">{s}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray/40">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="label-caps !text-gray/60 ml-1 text-[10px] lg:text-xs">{t.contact.form.message}</label>
                  <textarea name="message" required className="w-full p-4 lg:p-5 bg-soft-gray rounded-xl lg:rounded-2xl border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all h-32 lg:h-40 text-sm placeholder:text-gray/40 resize-none" placeholder={t.contact.form.placeholder}></textarea>
                </div>
                <button 
                  disabled={formState === 'submitting'}
                  className={`w-full bg-[#00929f] text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl label-caps !text-white hover:bg-primary transition-all duration-300 shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 ${formState === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {formState === 'submitting' ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : t.contact.form.submit}
                </button>
                {formState === 'error' && (
                  <p className="text-red-500 text-xs text-center mt-4">Une erreur est survenue. Veuillez réessayer ou nous contacter par email.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Home = ({ t }: { t: any }) => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Hero t={t} />
      <KeyFigures t={t} />
      <Services t={t} />
      <Team t={t} />
      <References t={t} />
      <Contact t={t} />
    </>
  );
};
