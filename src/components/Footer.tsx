import { Link } from "react-router-dom";

export const Footer = ({ t }: { t: any }) => {
  return (
    <footer className="py-16 bg-white border-t border-ink/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2 group">
                <img 
                  src="/mgibfclogo.png" 
                  alt="MGI BFC" 
                  className="h-[107px] w-[161px] object-contain"
                />
              </Link>
            </div>
            <p className="text-gray text-xs max-w-sm leading-relaxed font-light">
              {t.footer.desc}
            </p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-[#2052a3] text-[12px] uppercase tracking-[0.2em] mb-8">{t.footer.nav}</h4>
            <ul className="flex flex-wrap gap-x-8 gap-y-4 text-xs text-gray">
              <li><Link to="/" className="hover:text-primary transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">{t.nav.services}</Link></li>
              <li><Link to="/team" className="hover:text-primary transition-colors">{t.nav.team}</Link></li>
              <li><Link to="/#references" className="hover:text-primary transition-colors">{t.nav.references}</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">{t.nav.careers}</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">{t.nav.blog}</Link></li>
            </ul>
          </div>
          <div>
          </div>
        </div>
        <div className="pt-10 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray/40">
            {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
};
