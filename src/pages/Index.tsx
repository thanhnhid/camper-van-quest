import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSearch from "@/components/HeroSearch";
import { Shield, Clock, Globe, Users, Star, Award, CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat min-h-[90vh] flex items-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ihr Traumurlaub beginnt hier
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Entdecken Sie die Freiheit des Reisens mit unseren hochwertigen Wohnmobilen. 
              Von kompakten Stadtflitzern bis hin zu luxuriösen Reisemobilen.
            </p>
          </div>
          
          {/* Search Component */}
          <HeroSearch />
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Warum CamperQuest?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Wir machen Ihren Wohnmobil-Urlaub zu einem unvergesslichen Erlebnis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Buchung</h3>
                <p className="text-muted-foreground">
                  Buchen Sie spontan oder planen Sie im Voraus. Kostenlose Stornierung bis 7 Tage vor Reiseantritt.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparente Kosten</h3>
                <p className="text-muted-foreground">
                  Keine versteckten Gebühren. Alle Kosten für Versicherung, Kaution und Extras klar ersichtlich.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Für jeden Typ</h3>
                <p className="text-muted-foreground">
                  Familien, Paare, Gruppen - vom kompakten Van bis zum Luxus-Liner für jeden das passende Fahrzeug.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Europaweite Anbieter</h3>
                <p className="text-muted-foreground">
                  Über 500 geprüfte Anbieter in ganz Europa. Abholen in Deutschland, zurückgeben wo Sie möchten.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Elements */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Über 50.000 zufriedene Kunden vertrauen uns
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Customer Reviews */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">4.8/5</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Perfekte Organisation, top Fahrzeuge und super Service. Unser Skandinavien-Trip war unvergesslich!"
                  </p>
                  <p className="font-medium">Familie Weber, München</p>
                </CardContent>
              </Card>

              {/* Awards */}
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Testsieger 2024</h4>
                  <p className="text-muted-foreground mb-4">
                    "Beste Wohnmobil-Vermietung" bei Stiftung Reisetest
                  </p>
                  <Badge variant="secondary">Ausgezeichnet</Badge>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">100% Sicher</h4>
                  <p className="text-muted-foreground mb-4">
                    SSL-verschlüsselte Zahlung und geprüfte Anbieter für Ihre Sicherheit
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verifiziert
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link to="/campers">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Alle Wohnmobile entdecken
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
