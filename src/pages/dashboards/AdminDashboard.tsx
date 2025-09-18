import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Car, 
  Calendar, 
  DollarSign, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PendingCamper {
  id: string;
  name: string;
  provider_name: string;
  provider_email: string;
  price_per_day: number;
  location: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pendingCampers, setPendingCampers] = useState<PendingCamper[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, type: "user_registration", user: "Max Mustermann", time: "vor 2 Stunden" },
    { id: 2, type: "camper_booking", user: "Anna Schmidt", camper: "VW T6 California", time: "vor 4 Stunden" },
    { id: 3, type: "provider_application", user: "Peter Müller", time: "vor 6 Stunden" },
    { id: 4, type: "camper_listing", user: "Lisa Weber", camper: "Hymer B-Klasse", time: "vor 8 Stunden" },
  ];

  useEffect(() => {
    if (profile) {
      fetchUserProfile();
      fetchPendingCampers();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    setUserProfile({
      id: profile?.id,
      first_name: profile?.first_name || "Admin",
      last_name: profile?.last_name || "User",
      email: profile?.email,
      role: profile?.role
    });
  };

  const fetchPendingCampers = async () => {
    try {
      const { data, error } = await supabase
        .from('campers')
        .select(`
          id,
          name,
          price_per_day,
          location,
          status,
          created_at,
          profiles!campers_provider_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((camper: any) => ({
        id: camper.id,
        name: camper.name,
        provider_name: `${camper.profiles?.first_name || ''} ${camper.profiles?.last_name || ''}`.trim(),
        provider_email: camper.profiles?.email || '',
        price_per_day: camper.price_per_day,
        location: camper.location,
        status: camper.status,
        created_at: camper.created_at
      })) || [];

      setPendingCampers(formattedData);
    } catch (error) {
      console.error('Error fetching pending campers:', error);
      toast.error('Fehler beim Laden der pendenten Camper');
    } finally {
      setLoading(false);
    }
  };

  const handleCamperApproval = async (camperId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('campers')
        .update({ status: newStatus })
        .eq('id', camperId);

      if (error) throw error;

      toast.success(`Camper wurde ${action === 'approve' ? 'genehmigt' : 'abgelehnt'}`);
      fetchPendingCampers();
    } catch (error) {
      console.error('Error updating camper status:', error);
      toast.error('Fehler beim Aktualisieren des Camper-Status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Willkommen zurück, {userProfile?.first_name || 'Admin'}!
              </p>
            </div>
            <Badge variant="destructive" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Administrator
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamte Benutzer</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% diesen Monat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Camper</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">543</div>
              <p className="text-xs text-muted-foreground">+8% diesen Monat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buchungen</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+23% diesen Monat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45,231</div>
              <p className="text-xs text-muted-foreground">+19% diesen Monat</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Letzte Aktivitäten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.type}</p>
                      {activity.camper && (
                        <p className="text-xs text-gray-400">{activity.camper}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Camper Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Ausstehende Camper-Genehmigungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Lade ausstehende Genehmigungen...</div>
              ) : pendingCampers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Keine ausstehenden Genehmigungen
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCampers.map((camper) => (
                    <div key={camper.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div>
                          <h4 className="font-medium">{camper.name}</h4>
                          <p className="text-sm text-gray-500">
                            von {camper.provider_name} ({camper.provider_email})
                          </p>
                          <p className="text-xs text-gray-400">
                            {camper.location} • {camper.price_per_day}€/Tag
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Prüfung läuft
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(camper.created_at).toLocaleDateString('de-DE')}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleCamperApproval(camper.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCamperApproval(camper.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}