import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, User, LogIn, Phone, Mail, Clock, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Contact Bar */}
      <div className="bg-muted/30 border-b">
        <div className="container flex h-10 items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+49 (0) 30 123 456 789</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>info@camperquest.de</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Mo-Fr: 08-20 Uhr | Sa: 09-18 Uhr</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">CamperQuest</span>
        </Link>
        
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Startseite
          </Link>
          <Link
            to="/campers"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/campers" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Fahrzeuge
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Über uns
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Kontakt
          </Link>
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Anmelden
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">
              <User className="mr-2 h-4 w-4" />
              Registrieren
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;