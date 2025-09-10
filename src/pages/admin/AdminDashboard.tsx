import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Car, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Building2
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht und Verwaltung der CamperQuest Plattform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Nutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% seit letztem Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Wohnmobile</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +3 neue diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktuelle Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              43 laufende Vermietungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatsumsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231</div>
            <p className="text-xs text-muted-foreground">
              +8% seit letztem Monat
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Aktivitäten</CardTitle>
            <CardDescription>
              Neueste Ereignisse auf der Plattform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-4 w-4 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Neue Buchung eingegangen</p>
                  <p className="text-xs text-muted-foreground">Knaus Sky TI 700MEG - 5 Tage</p>
                </div>
                <Badge variant="outline">Neu</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Users className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Neuer Anbieter registriert</p>
                  <p className="text-xs text-muted-foreground">Camping Solutions GmbH</p>
                </div>
                <Badge variant="secondary">Prüfung</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Schadensmeldung eingegangen</p>
                  <p className="text-xs text-muted-foreground">Pössl Roadcruiser B - Kleinschaden</p>
                </div>
                <Badge variant="outline">Bearbeitung</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Car className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Neues Wohnmobil hinzugefügt</p>
                  <p className="text-xs text-muted-foreground">Hymer B-Klasse ModernComfort</p>
                </div>
                <Badge variant="secondary">Aktiv</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin-Aktionen</CardTitle>
            <CardDescription>
              Häufig verwendete Verwaltungsfunktionen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Benutzer verwalten
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Car className="mr-2 h-4 w-4" />
              Wohnmobile moderieren
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Buchungen überwachen
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Finanzberichte
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Support-Tickets
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ausstehende Genehmigungen</CardTitle>
          <CardDescription>
            Anbieter und Wohnmobile, die auf Freigabe warten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Camping Solutions GmbH</p>
                  <p className="text-sm text-muted-foreground">
                    Anbieter-Registrierung vom 8. Januar 2024
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Ablehnen
                </Button>
                <Button size="sm">
                  Genehmigen
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Hymer B-Klasse ModernComfort</p>
                  <p className="text-sm text-muted-foreground">
                    Neues Wohnmobil von Premium Rentals
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Details
                </Button>
                <Button size="sm">
                  Freigeben
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;