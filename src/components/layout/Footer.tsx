import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CamperQuest</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Ihr Partner für unvergessliche Wohnmobil-Abenteuer in ganz Europa.
            </p>
          </div>
          
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
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Für Anbieter</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/provider" className="text-muted-foreground hover:text-foreground">
                  Anbieter-Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="mailto:support@camperquest.de" className="text-muted-foreground hover:text-foreground">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CamperQuest. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;