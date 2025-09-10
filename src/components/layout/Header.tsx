import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, User, LogIn } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            Wohnmobile
          </Link>
          <Link
            to="/terms"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/terms" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            AGB
          </Link>
          <Link
            to="/privacy"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/privacy" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Datenschutz
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