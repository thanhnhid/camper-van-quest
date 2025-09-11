import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Car, Calendar, Euro, MessageSquare, Edit, Eye, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [myCampers] = useState([
    { id: 1, name: "VW California Ocean", brand: "Volkswagen", model: "California", year: 2022, location: "München", rating: 4.8, price: 89, available: true },
    { id: 2, name: "Mercedes Marco Polo", brand: "Mercedes-Benz", model: "Marco Polo", year: 2021, location: "München", rating: 4.6, price: 95, available: false },
    { id: 3, name: "Ford Transit Custom", brand: "Ford", model: "Transit", year: 2020, location: "München", rating: 4.4, price: 75, available: true }
  ]);
  
  const [bookingRequests] = useState([
    { id: 1, customer: "Max Mustermann", camper: "VW California Ocean", dates: "15.03 - 20.03.2024", status: "pending", amount: "€445" },
    { id: 2, customer: "Anna Schmidt", camper: "Ford Transit Custom", dates: "22.03 - 25.03.2024", status: "pending", amount: "€225" }
  ]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserProfile(profile);
    }
  };

  const handleBookingRequest = (requestId: number, action: 'accept' | 'reject') => {
    toast({
      title: action === 'accept' ? "Buchung angenommen" : "Buchung abgelehnt",
      description: `Die Buchungsanfrage wurde erfolgreich ${action === 'accept' ? 'angenommen' : 'abgelehnt'}.`
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anbieter Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Wohnmobile und Buchungen</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neues Wohnmobil hinzufügen
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meine Wohnmobile</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCampers.length}</div>
            <p className="text-xs text-muted-foreground">{myCampers.filter(c => c.available).length} verfügbar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,847</div>
            <p className="text-xs text-muted-foreground">+12% vs. letzten Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anfragen</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Neue Buchungsanfragen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Camper Management */}
        <Card>
          <CardHeader>
            <CardTitle>Meine Wohnmobile</CardTitle>
            <CardDescription>Verwalten Sie Ihre Fahrzeugflotte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCampers.map((camper, index) => (
                <div key={camper.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{camper.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {camper.brand} {camper.model} ({camper.year}) • €{camper.price}/Tag
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={camper.available ? 'default' : 'secondary'}>
                          {camper.available ? 'Verfügbar' : 'Nicht verfügbar'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">★ {camper.rating}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {index < myCampers.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Buchungsanfragen</CardTitle>
            <CardDescription>Neue Anfragen für Ihre Wohnmobile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingRequests.map((request, index) => (
                <div key={request.id}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{request.customer}</p>
                        <p className="text-sm text-muted-foreground">{request.camper}</p>
                        <p className="text-sm text-muted-foreground">{request.dates}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{request.amount}</p>
                        <Badge variant="outline">Ausstehend</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleBookingRequest(request.id, 'accept')}
                        className="flex-1"
                      >
                        Annehmen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleBookingRequest(request.id, 'reject')}
                        className="flex-1"
                      >
                        Ablehnen
                      </Button>
                    </div>
                  </div>
                  {index < bookingRequests.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
          <CardDescription>Häufig verwendete Funktionen</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Wohnmobil hinzufügen
          </Button>
          <Button variant="outline" className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Verfügbarkeit aktualisieren
          </Button>
          <Button variant="outline" className="justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Umsatzstatistiken
          </Button>
          <Button variant="outline" className="justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Bewertungen ansehen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboard;