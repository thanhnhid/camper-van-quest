import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageCircle, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Kontakt</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Haben Sie Fragen oder benötigen Unterstützung? Unser freundliches Team steht Ihnen gerne zur Verfügung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                    <p className="text-muted-foreground mb-1">
                      <strong>Deutschland:</strong> +49 (0) 30 123 456 789
                    </p>
                    <p className="text-muted-foreground">
                      <strong>International:</strong> +49 (0) 30 123 456 790
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">E-Mail</h3>
                    <p className="text-muted-foreground mb-1">
                      <strong>Allgemeine Anfragen:</strong> info@camperquest.de
                    </p>
                    <p className="text-muted-foreground mb-1">
                      <strong>Buchungsservice:</strong> booking@camperquest.de
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Support:</strong> support@camperquest.de
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Öffnungszeiten</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p><strong>Montag - Freitag:</strong> 08:00 - 20:00 Uhr</p>
                      <p><strong>Samstag:</strong> 09:00 - 18:00 Uhr</p>
                      <p><strong>Sonntag:</strong> 10:00 - 16:00 Uhr</p>
                      <p className="text-sm mt-2">24/7 Notfall-Hotline verfügbar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Adresse</h3>
                    <div className="text-muted-foreground">
                      <p>CamperQuest GmbH</p>
                      <p>Alexanderplatz 1</p>
                      <p>10178 Berlin, Deutschland</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      In Google Maps öffnen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Nachricht senden</h2>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">Vorname</Label>
                    <Input id="firstname" placeholder="Max" />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Nachname</Label>
                    <Input id="lastname" placeholder="Mustermann" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="max@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input id="phone" placeholder="+49 30 123456789" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Betreff</Label>
                  <Input id="subject" placeholder="Ihre Anfrage" />
                </div>
                
                <div>
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Beschreiben Sie Ihr Anliegen..." 
                    rows={6}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Nachricht senden
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Support Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Hilfsmöglichkeiten</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Sofortige Hilfe über unseren Live-Chat
                </p>
                <Button variant="outline" size="sm">Chat starten</Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">FAQ</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Antworten auf häufige Fragen
                </p>
                <Link to="/faq">
                  <Button variant="outline" size="sm">FAQ besuchen</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Rückruf-Service</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Wir rufen Sie zurück
                </p>
                <Button variant="outline" size="sm">Rückruf anfordern</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;