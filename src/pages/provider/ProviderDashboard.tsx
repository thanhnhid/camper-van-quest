import { useState, useEffect } from "react";
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
  Star,
  Package,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CamperUploadForm } from "@/components/CamperUploadForm";
import { useToast } from "@/hooks/use-toast";

interface Camper {
  id: string;
  name: string;
  description: string;
  price_per_day: number;
  location: string;
  capacity: number;
  features: string[];
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const ProviderDashboard = () => {
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingCamper, setEditingCamper] = useState<Camper | null>(null);
  const [stats, setStats] = useState({
    totalCampers: 0,
    approvedCampers: 0,
    pendingCampers: 0,
    totalBookings: 0
  });

  useEffect(() => {
    if (profile && profile.role === 'provider') {
      fetchProviderData();
    }
  }, [profile]);

  const fetchProviderData = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Fetch provider's campers
      const { data: campersData, error: campersError } = await supabase
        .from('campers')
        .select('*')
        .eq('provider_id', profile.id)
        .order('created_at', { ascending: false });

      if (campersError) throw campersError;

      setCampers(campersData || []);

      // Calculate stats
      const totalCampers = campersData?.length || 0;
      const approvedCampers = campersData?.filter(c => c.status === 'approved').length || 0;
      const pendingCampers = campersData?.filter(c => c.status === 'pending').length || 0;

      // Fetch bookings for this provider's campers
      const camperIds = campersData?.map(c => c.id) || [];
      let totalBookings = 0;
      
      if (camperIds.length > 0) {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('id')
          .in('camper_id', camperIds);
        
        totalBookings = bookingsData?.length || 0;
      }

      setStats({
        totalCampers,
        approvedCampers,
        pendingCampers,
        totalBookings
      });

    } catch (error) {
      console.error('Error fetching provider data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Genehmigt';
      case 'pending': return 'Zur Prüfung';
      case 'rejected': return 'Abgelehnt';
      default: return status;
    }
  };

  const handleEditCamper = (camper: Camper) => {
    setEditingCamper(camper);
    setShowUploadForm(true);
  };

  const handleFormSuccess = () => {
    fetchProviderData();
    setEditingCamper(null);
  };

  if (authLoading || loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Lade Daten...</div>
      </div>
    );
  }

  if (!profile || profile.role !== 'provider') {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Zugriff verweigert</h1>
          <p className="text-muted-foreground">Sie haben keine Berechtigung für das Anbieter-Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Anbieter Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Wohnmobile und Buchungen
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meine Wohnmobile</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedCampers} genehmigt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zur Prüfung</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCampers}</div>
            <p className="text-xs text-muted-foreground">
              Warten auf Genehmigung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Gesamtanzahl
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€0</div>
            <p className="text-xs text-muted-foreground">
              Basierend auf Buchungen
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camper Management */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Meine Wohnmobile</h2>
            <Button onClick={() => setShowUploadForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neues Wohnmobil
            </Button>
          </div>
          
          {campers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Wohnmobile</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Fügen Sie Ihr erstes Wohnmobil hinzu, um mit der Vermietung zu beginnen.
                </p>
                <Button onClick={() => setShowUploadForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Erstes Wohnmobil hinzufügen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campers.map((camper) => (
                <Card key={camper.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {camper.images && camper.images.length > 0 ? (
                        <img
                          src={camper.images[0]}
                          alt={camper.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{camper.name}</h3>
                            <p className="text-muted-foreground">
                              {camper.capacity} Personen • {camper.location}
                            </p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {camper.location}
                              </div>
                              <div className="flex items-center">
                                <Package className="mr-1 h-3 w-3" />
                                {camper.features.length} Features
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{camper.price_per_day}€</p>
                            <p className="text-sm text-muted-foreground">pro Tag</p>
                            <Badge 
                              variant={getStatusColor(camper.status)}
                              className="mt-2"
                            >
                              {getStatusText(camper.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => window.open(`/camper/${camper.id}`, '_blank')}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ansehen
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditCamper(camper)}>
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
          )}
        </div>

        {/* Recent Bookings & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
              <CardDescription>
                Häufig verwendete Funktionen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowUploadForm(true)}>
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

          <Card>
            <CardHeader>
              <CardTitle>Hilfe & Support</CardTitle>
              <CardDescription>
                Tipps für erfolgreiche Vermietung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">• Hochwertige Bilder erhöhen die Buchungsrate</p>
                <p className="mb-2">• Detaillierte Beschreibungen schaffen Vertrauen</p>
                <p className="mb-2">• Schnelle Antworten verbessern Ihr Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CamperUploadForm
        open={showUploadForm}
        onOpenChange={setShowUploadForm}
        onSuccess={handleFormSuccess}
        editingCamper={editingCamper}
      />
    </div>
  );
};

export default ProviderDashboard;