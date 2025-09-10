import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Calendar, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  MapPin,
  Star
} from "lucide-react";
import { mockCampers } from "@/data/campers";

const ProviderDashboard = () => {
  // In real implementation, this would be filtered by provider ID
  const providerCampers = mockCampers.slice(0, 2);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Anbieter Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Wohnmobile und Buchungen
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meine Wohnmobile</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerCampers.length}</div>
            <p className="text-xs text-muted-foreground">
              Alle aktiv und verfügbar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 laufende Vermietungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€3,240</div>
            <p className="text-xs text-muted-foreground">
              +15% seit letztem Monat
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camper Management */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Meine Wohnmobile</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neues Wohnmobil
            </Button>
          </div>
          
          <div className="space-y-4">
            {providerCampers.map((camper) => (
              <Card key={camper.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={camper.images[0]}
                      alt={camper.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{camper.name}</h3>
                          <p className="text-muted-foreground">
                            {camper.brand} {camper.model} ({camper.year})
                          </p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              {camper.location}
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                              {camper.rating} ({camper.reviewCount})
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{camper.price}€</p>
                          <p className="text-sm text-muted-foreground">pro Tag</p>
                          <Badge 
                            variant={camper.available ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {camper.available ? "Verfügbar" : "Gebucht"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Ansehen
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Kalender
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Bookings & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktuelle Buchungen</CardTitle>
              <CardDescription>
                Neueste Anfragen und Buchungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Familie Müller</p>
                    <p className="text-sm text-muted-foreground">Knaus Sky TI 700MEG</p>
                    <p className="text-xs text-muted-foreground">15.-20. März 2024</p>
                  </div>
                  <Badge>Bestätigt</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hr. Schmidt</p>
                    <p className="text-sm text-muted-foreground">Pössl Roadcruiser B</p>
                    <p className="text-xs text-muted-foreground">22.-25. März 2024</p>
                  </div>
                  <Badge variant="outline">Anfrage</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fr. Weber</p>
                    <p className="text-sm text-muted-foreground">Knaus Sky TI 700MEG</p>
                    <p className="text-xs text-muted-foreground">1.-7. April 2024</p>
                  </div>
                  <Badge>Laufend</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
              <CardDescription>
                Häufig verwendete Funktionen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Wohnmobil hinzufügen
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Verfügbarkeit aktualisieren
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Umsatzstatistiken
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Bewertungen ansehen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;