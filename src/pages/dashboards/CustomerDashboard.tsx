import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Search, Star, CreditCard, MapPin, Calendar, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Booking {
  id: string;
  camper_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  campers: {
    name: string;
    location: string;
    price_per_day: number;
  };
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  points: number | null;
  created_at: string;
}

const CustomerDashboard = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    completedBookings: 0,
    thisMonthBookings: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserProfile(profile);

      if (profile) {
        // Fetch user bookings with camper details
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            *,
            campers (
              name,
              location,
              price_per_day
            )
          `)
          .eq('customer_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsData) {
          setBookings(bookingsData);

          // Calculate statistics
          const totalBookings = bookingsData.length;
          const totalSpent = bookingsData.reduce((sum, booking) => sum + Number(booking.total_price), 0);
          const completedBookings = bookingsData.filter(b => b.status === 'completed').length;
          
          const thisMonth = new Date();
          thisMonth.setDate(1);
          const thisMonthBookings = bookingsData.filter(b => 
            new Date(b.created_at) >= thisMonth
          ).length;

          setBookingStats({
            totalBookings,
            totalSpent,
            completedBookings,
            thisMonthBookings
          });
        }
      }
    }
    setLoading(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bestätigt';
      case 'completed': return 'abgeschlossen';
      case 'pending': return 'ausstehend';
      case 'cancelled': return 'storniert';
      default: return status;
    }
  };

  const isNewCustomer = bookings.length === 0;
  const customerName = userProfile?.first_name || 'Kunde';
  const welcomeMessage = isNewCustomer 
    ? `Willkommen, ${customerName}!` 
    : `Willkommen zurück, ${customerName}!`;

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">Lade Daten...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kunden Dashboard</h1>
          <p className="text-muted-foreground">{welcomeMessage}</p>
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
            <div className="text-2xl font-bold">{bookingStats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {bookingStats.thisMonthBookings > 0 
                ? `+${bookingStats.thisMonthBookings} diesen Monat` 
                : 'Noch keine Buchungen'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abgeschlossene Buchungen</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.completedBookings}</div>
            <p className="text-xs text-muted-foreground">Erfolgreich abgeschlossen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtausgaben</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{bookingStats.totalSpent.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              {isNewCustomer ? 'Noch keine Ausgaben' : 'Gesamt ausgegeben'}
            </p>
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
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/campers'}>
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
            <CardTitle>
              {isNewCustomer ? 'Ihre erste Buchung wartet' : 'Aktuelle Buchungen'}
            </CardTitle>
            <CardDescription>
              {isNewCustomer 
                ? 'Starten Sie Ihr erstes Abenteuer mit einem unserer Wohnmobile' 
                : 'Ihre letzten Wohnmobil-Buchungen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isNewCustomer ? (
              <div className="text-center py-8 space-y-4">
                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Sie haben noch keine Buchungen.</p>
                <Button onClick={() => window.location.href = '/campers'}>
                  <Search className="mr-2 h-4 w-4" />
                  Wohnmobile entdecken
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={booking.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{booking.campers?.name || 'Unbekannter Camper'}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {booking.campers?.location || 'Unbekannt'} • {format(new Date(booking.start_date), 'dd.MM.yyyy', { locale: de })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">€{Number(booking.total_price).toFixed(0)}</p>
                      </div>
                    </div>
                    {index < bookings.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
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