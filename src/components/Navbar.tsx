import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = ({ lang, setLang, t }: { lang: string, setLang: (l: string) => void, t: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.services, href: "/services" },
    { name: t.nav.team, href: "/team" },
    { name: t.nav.references, href: "/#references" },
    { name: t.nav.careers, href: "/careers" },
    { name: t.nav.blog, href: "/blog" },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("/#") && isHome) {
      const id = href.substring(2);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-ink/5" : "bg-white/10 backdrop-blur-md border-b border-white/10"}`}>
      <div className={`max-w-7xl mx-auto w-full flex flex-col lg:flex-row lg:items-center px-4 sm:px-8 transition-all duration-300 ${isScrolled || !isHome ? "py-2 lg:h-[64px]" : "py-3 lg:h-[80px]"}`}>
        
        {/* Header: Logo + Actions (Actions visible on mobile header) */}
        <div className="flex justify-between items-center w-full lg:w-auto h-full px-2 lg:px-0">
          <Link to="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
            <img 
              src="/mgibfclogo.png" 
              alt="MGI BFC" 
              className={`transition-all duration-300 group-hover:scale-105 object-contain ${isScrolled || !isHome ? "h-[28px] sm:h-[36px]" : "h-[36px] sm:h-[48px]"}`}
            />
          </Link>
          
          {/* Mobile Actions: Language + Contact */}
          <div className="flex lg:hidden items-center gap-2">
            <div className={`flex items-center bg-black/5 rounded-lg p-0.5 border ${isScrolled || !isHome ? "border-ink/5" : "border-white/10"}`}>
              <button 
                onClick={() => setLang('fr')}
                className={`text-[8px] font-extrabold px-2 py-1 rounded-md transition-all ${lang === 'fr' ? "bg-primary text-white shadow-sm" : isScrolled || !isHome ? "text-gray" : "text-white/60"}`}
              >FR</button>
              <button 
                onClick={() => setLang('en')}
                className={`text-[8px] font-extrabold px-2 py-1 rounded-md transition-all ${lang === 'en' ? "bg-primary text-white shadow-sm" : isScrolled || !isHome ? "text-gray" : "text-white/60"}`}
              >EN</button>
            </div>
            <button 
              onClick={() => {
                if (isHome) {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate("/#contact");
                }
              }}
              className="bg-primary text-white text-[8px] px-3 py-1.5 rounded-full font-extrabold uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>

        {/* Links Navigation: Horizontal scroll on mobile, flex on desktop */}
        <div className="flex mt-3 lg:mt-0 lg:ml-10 flex-1 overflow-x-auto no-scrollbar lg:overflow-visible -mx-4 lg:mx-0 px-4 lg:px-0">
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 xl:space-x-10 min-w-max lg:min-w-0 pr-6 lg:pr-0 lg:justify-end">
            {navLinks.map((link) => (
              link.href.startsWith("/#") && isHome ? (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-bold transition-all duration-300 relative group focus-visible:outline-none py-1 lg:py-0 ${
                    location.pathname === link.href || (link.href === "/" && location.pathname === "/")
                      ? (isScrolled || !isHome ? "text-primary" : "text-white")
                      : (isScrolled || !isHome ? "text-gray/70 hover:text-primary" : "text-white/60 hover:text-white")
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 transition-all duration-300 h-0.5 ${
                    location.pathname === link.href || (link.href === "/" && location.pathname === "/")
                      ? (isScrolled || !isHome ? "bg-primary w-full" : "bg-white w-full")
                      : (isScrolled || !isHome ? "bg-primary w-0 group-hover:w-full" : "bg-white w-0 group-hover:w-full")
                  }`} />
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-bold transition-all duration-300 relative group focus-visible:outline-none py-1 lg:py-0 ${
                    location.pathname === link.href
                      ? (isScrolled || !isHome ? "text-primary" : "text-white")
                      : (isScrolled || !isHome ? "text-gray/70 hover:text-primary" : "text-white/60 hover:text-white")
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 transition-all duration-300 h-0.5 ${
                    location.pathname === link.href
                      ? (isScrolled || !isHome ? "bg-primary w-full" : "bg-white w-full")
                      : (isScrolled || !isHome ? "bg-primary w-0 group-hover:w-full" : "bg-white w-0 group-hover:w-full")
                  }`} />
                </Link>
              )
            ))}
            
            {/* Desktop-only: Language + Contact */}
            <div className={`hidden lg:flex items-center gap-3 border-l pl-8 xl:pl-10 ${isScrolled || !isHome ? "border-ink/10" : "border-white/20"}`}>
              <button 
                onClick={() => setLang('fr')}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-all duration-200 ${lang === 'fr' ? "bg-primary text-white" : isScrolled || !isHome ? "text-gray hover:bg-soft-gray" : "text-white/70 hover:bg-white/10"}`}
              >FR</button>
              <button 
                onClick={() => setLang('en')}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-all duration-200 ${lang === 'en' ? "bg-primary text-white" : isScrolled || !isHome ? "text-gray hover:bg-soft-gray" : "text-white/70 hover:bg-white/10"}`}
              >EN</button>
            </div>

            <button 
              onClick={() => {
                if (isHome) {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate("/#contact");
                }
              }}
              className={`hidden lg:block px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 shadow-lg ${isScrolled || !isHome ? "bg-primary text-white hover:bg-secondary shadow-primary/20" : "bg-white text-primary hover:bg-secondary hover:text-white shadow-white/10"}`}
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
