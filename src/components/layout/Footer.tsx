import { Link } from "react-router-dom";
import { Car, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CamperQuest</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Ihr Partner für unvergessliche Wohnmobil-Abenteuer in ganz Europa.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3 mt-4">
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">Schnellzugriffe</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/campers" className="text-muted-foreground hover:text-foreground">
                  Fahrzeuge suchen
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/provider" className="text-muted-foreground hover:text-foreground">
                  Anbieter werden
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold">Kontakt</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>+49 (0) 30 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>info@camperquest.de</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Alexanderplatz 1<br />10178 Berlin</span>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold">Rechtliches</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/impressum" className="text-muted-foreground hover:text-foreground">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CamperQuest GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;