import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Award, Heart, Globe, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Über CamperQuest</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seit 2019 verwirklichen wir Träume von Freiheit und Abenteuer. 
            Mit über 500 geprüften Partnern in ganz Europa sind wir Ihr vertrauensvoller 
            Begleiter für unvergessliche Wohnmobil-Erlebnisse.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8">
            <CardContent className="p-0">
              <Heart className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-2xl font-bold mb-4">Unsere Mission</h2>
              <p className="text-muted-foreground">
                Wir glauben, dass Reisen das Leben bereichert. Deshalb schaffen wir eine 
                Plattform, die es jedem ermöglicht, die Freiheit des Wohnmobil-Reisens 
                zu erleben - unkompliziert, sicher und zu fairen Preisen.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardContent className="p-0">
              <Globe className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-2xl font-bold mb-4">Unsere Vision</h2>
              <p className="text-muted-foreground">
                Eine Welt, in der nachhaltiges und bewusstes Reisen für jeden zugänglich ist. 
                Wir verbinden Menschen mit lokalen Anbietern und fördern so einen respektvollen 
                Tourismus, der Regionen stärkt und die Umwelt schützt.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievements */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">CamperQuest in Zahlen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50.000+</div>
              <p className="text-muted-foreground">Zufriedene Kunden</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Partner-Anbieter</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25</div>
              <p className="text-muted-foreground">Länder in Europa</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.8</div>
              <p className="text-muted-foreground">Kundenbewertung</p>
            </div>
          </div>
        </div>

        {/* Team Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vertrauen</h3>
              <p className="text-muted-foreground">
                Alle Anbieter werden persönlich geprüft. Transparente Preise und faire Konditionen stehen bei uns an erster Stelle.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gemeinschaft</h3>
              <p className="text-muted-foreground">
                Wir verbinden Reisende mit lokalen Anbietern und schaffen so eine starke Gemeinschaft von Wohnmobil-Enthusiasten.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualität</h3>
              <p className="text-muted-foreground">
                Nur hochwertige, regelmäßig gewartete Fahrzeuge und erstklassiger Kundenservice - das ist unser Anspruch.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;