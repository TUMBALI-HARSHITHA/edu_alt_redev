import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { LINKS } from "../constants";
import { auth, onAuthStateChanged } from "../lib/firebase";

const Footer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return <footer className="bg-bg-secondary border-t border-border text-text-secondary pt-20 pb-10 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
  <div className="lg:col-span-2">
  <Link to="/" className="flex items-center gap-2 group mb-6">
  <div className="w-12 h-12 overflow-hidden rounded-xl">
  <img
    src="/logo.png"
    loading="lazy"
    decoding="async"
    alt="EduAltTech Logo"
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">LOGO</text></svg>';
    }}
  />
  </div>
  <div>
  <span className="text-xl font-bold text-heading tracking-tight font-georgia" style={{ fontFamily: 'Georgia, serif' }}>EduAltTech</span>
  <span className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase block">Education Technology Partner</span>
  </div>
  </Link>
  <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">
  Empowering schools with modern technology solutions — from websites and apps to AI tools and ERP systems. We help educational institutions thrive in the digital age.
  </p>
  <div className="flex gap-4">
  <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <Instagram className="w-5 h-5" />
  </a>
  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <Linkedin className="w-5 h-5" />
  </a>
  <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <MessageCircle className="w-5 h-5" />
  </a>
  </div>
  </div>

  {!user && (
    <div>
    <h4 className="font-bold mb-6 text-heading tracking-wide">Services</h4>
    <ul className="space-y-4 text-sm text-text-secondary">
    <li><Link to="/services" className="hover:text-primary transition-colors">Web Development</Link></li>
    <li><Link to="/services" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
    <li><Link to="/services" className="hover:text-primary transition-colors">School ERP</Link></li>
    <li><Link to="/services" className="hover:text-primary transition-colors">AI Solutions</Link></li>
    <li><Link to="/services" className="hover:text-primary transition-colors">Teacher Training</Link></li>
    </ul>
    </div>
  )}

  <div>
  <h4 className="font-bold mb-6 text-heading tracking-wide">Quick Links</h4>
  <ul className="space-y-4 text-sm text-text-secondary">
  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
  {user ? (
    <>
      <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
      <li><Link to="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
      <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
      <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
    </>
  ) : (
    <>
      <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
      <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
      <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
      <li><Link to="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
      <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
      <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
      <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
    </>
  )}
  </ul>
  </div>

  <div>
  <h4 className="font-bold mb-6 text-heading tracking-wide">Contact</h4>
  <ul className="space-y-4 text-sm text-text-secondary">
  <li className="flex items-start gap-3">
  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>info@edualttech.com</span>
  </li>
  <li className="flex items-start gap-3">
  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>+91 9121505879</span>
  </li>
  <li className="flex items-start gap-3">
  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>India</span>
  </li>
  </ul>
  </div>
  </div>

  <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
  <p className="text-text-muted text-xs">
  &copy; {(/* @__PURE__ */ new Date()).getFullYear()} EduAltTech. All rights reserved.
  </p>
  <p className="text-text-muted text-xs">
  Your Complete Education Technology Partner
  </p>
  </div>
  </div>
  </footer>;
};
var stdin_default = Footer;
export {
  stdin_default as default
};
