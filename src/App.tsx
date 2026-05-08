import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { translations } from "./translations";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Careers } from "./pages/Careers";
import { ServicesPage } from "./pages/Services";
import { Blog } from "./pages/Blog";
import { TeamPage } from "./pages/Team";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default function App() {
  const [lang, setLang] = useState('fr');
  const t = translations[lang as keyof typeof translations];

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-secondary selection:text-white font-sans">
        <Navbar lang={lang} setLang={setLang} t={t} />
        <main>
          <Routes>
            <Route path="/"         element={<Home t={t} />} />
            <Route path="/about"    element={<About t={t} />} />
            <Route path="/services" element={<ServicesPage t={t} />} />
            <Route path="/team"     element={<TeamPage t={t} />} />
            <Route path="/careers"  element={<Careers t={t} />} />
            <Route path="/blog"     element={<Blog t={t} />} />
          </Routes>
        </main>
        <Footer t={t} />
        {/* lang transmis pour synchroniser la langue du chatbot avec le site */}
        <Chatbot lang={lang} />
      </div>
    </Router>
  );
}