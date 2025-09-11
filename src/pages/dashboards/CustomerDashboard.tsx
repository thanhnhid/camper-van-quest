import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Search, Star, CreditCard, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CustomerDashboard = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState([
    { id: 1, camper: "VW California", location: "München", date: "15.03.2024", status: "bestätigt", price: "€89/Tag" },
    { id: 2, camper: "Mercedes Marco Polo", location: "Berlin", date: "22.02.2024", status: "abgeschlossen", price: "€95/Tag" }
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kunden Dashboard</h1>
          <p className="text-muted-foreground">Willkommen zurück, {userProfile?.first_name || 'Kunde'}!</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {userProfile?.points || 0} Punkte
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meine Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lieblings-Camper</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Gespeicherte Favoriten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtausgaben</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€1,247</div>
            <p className="text-xs text-muted-foreground">Letztes Jahr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treuepunkte</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.points || 0}</div>
            <p className="text-xs text-muted-foreground">Sammelbar bei Buchungen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Schnellaktionen</CardTitle>
            <CardDescription>Häufig verwendete Funktionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Wohnmobile suchen
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="mr-2 h-4 w-4" />
              Profil bearbeiten
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Meine Standorte
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Favoriten ansehen
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Buchungen</CardTitle>
            <CardDescription>Ihre letzten Wohnmobil-Buchungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div key={booking.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.camper}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {booking.location} • {booking.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={booking.status === 'bestätigt' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{booking.price}</p>
                    </div>
                  </div>
                  {index < recentBookings.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Information</CardTitle>
          <CardDescription>Ihre persönlichen Daten und Einstellungen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
              <p>{userProfile?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{userProfile?.first_name} {userProfile?.last_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefon</p>
              <p>{userProfile?.phone || 'Nicht angegeben'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p>{userProfile?.address || 'Nicht angegeben'}</p>
            </div>
          </div>
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" />
            Profil bearbeiten
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;