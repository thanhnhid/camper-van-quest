import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Car, CreditCard, AlertTriangle, Settings, Shield, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const [recentActivities] = useState([
    { id: 1, type: "user_registration", message: "Neuer Benutzer registriert: max.mustermann@email.de", time: "Vor 2 Stunden", status: "info" },
    { id: 2, type: "booking", message: "Neue Buchung für VW California", time: "Vor 4 Stunden", status: "success" },
    { id: 3, type: "issue", message: "Support-Anfrage eingegangen", time: "Vor 6 Stunden", status: "warning" },
    { id: 4, type: "provider", message: "Neuer Anbieter wartet auf Genehmigung", time: "Vor 1 Tag", status: "pending" }
  ]);

  const [pendingApprovals] = useState([
    { id: 1, type: "provider", name: "Hamburg Camper GmbH", email: "info@hamburg-camper.de", submitted: "Vor 2 Tagen" },
    { id: 2, type: "camper", name: "Mercedes Sprinter Custom", owner: "Berlin Adventures", submitted: "Vor 1 Tag" },
    { id: 3, type: "provider", name: "Alpen Wohnmobile", email: "kontakt@alpen-wohnmobile.de", submitted: "Vor 3 Stunden" }
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

  const handleApproval = (id: number, action: 'approve' | 'reject', type: string) => {
    toast({
      title: action === 'approve' ? "Genehmigt" : "Abgelehnt",
      description: `${type} wurde erfolgreich ${action === 'approve' ? 'genehmigt' : 'abgelehnt'}.`
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Plattform-Verwaltung und Überwachung</p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          <Shield className="mr-2 h-4 w-4" />
          Administrator
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Aktive Wohnmobile</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">543</div>
            <p className="text-xs text-muted-foreground">+8% diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktuelle Buchungen</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+23% diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231</div>
            <p className="text-xs text-muted-foreground">+19% diesen Monat</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>Aktuelle Ereignisse auf der Plattform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {activity.status === 'info' && <Users className="h-4 w-4 text-blue-500" />}
                      {activity.status === 'pending' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'warning' ? 'destructive' :
                      activity.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {activity.status === 'success' ? 'Erfolg' :
                       activity.status === 'warning' ? 'Warnung' :
                       activity.status === 'pending' ? 'Ausstehend' : 'Info'}
                    </Badge>
                  </div>
                  {index < recentActivities.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Aktionen</CardTitle>
            <CardDescription>Schnellzugriff auf wichtige Funktionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Benutzerverwaltung
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Car className="mr-2 h-4 w-4" />
              Wohnmobil-Verwaltung
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Buchungsübersicht
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Finanzberichte
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Support-Tickets
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Systemeinstellungen
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Ausstehende Genehmigungen</CardTitle>
          <CardDescription>Neue Anbieter und Wohnmobile warten auf Ihre Genehmigung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'provider' ? `E-Mail: ${item.email}` : `Eigentümer: ${item.owner}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Eingereicht: {item.submitted}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {item.type === 'provider' ? 'Neuer Anbieter' : 'Neues Wohnmobil'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproval(item.id, 'approve', item.type)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Genehmigen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleApproval(item.id, 'reject', item.type)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Ablehnen
                      </Button>
                    </div>
                  </div>
                </div>
                {index < pendingApprovals.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;