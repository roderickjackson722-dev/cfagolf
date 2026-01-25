import { Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import cfaLogo from '@/assets/cfa-logo.png';

export function Footer() {
  return (
    <footer className="bg-cfa-charcoal text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={cfaLogo} alt="CFA" className="w-14 h-14 object-contain" />
              <div>
                <h3 className="font-display text-xl font-bold">College Fairway Advisors</h3>
                <p className="text-white/60 text-sm">Your path to college golf</p>
              </div>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Expert guidance for junior golfers and their families navigating the college golf recruiting process.
            </p>
            <a 
              href="mailto:info@cfa.golf" 
              className="inline-flex items-center gap-2 text-cfa-gold hover:text-cfa-gold/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@cfa.golf
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/database" className="text-white/70 hover:text-white transition-colors">College Database</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors">Member Portal</Link>
              </li>
              <li>
                <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.cfa.golf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                >
                  Main Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ncaa.org/sports/golf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                >
                  NCAA Golf
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.naia.org/sports/golf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                >
                  NAIA Golf
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} College Fairway Advisors. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
