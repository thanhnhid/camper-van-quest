import { useAuth } from "@/hooks/useAuth";
import { CamperManagement } from "@/components/CamperManagement";
import { BookingManagement } from "@/components/BookingManagement";
import { ApprovedBookings } from "@/components/ApprovedBookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProviderDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Anbieter Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Willkommen zurück, {profile?.first_name || 'Anbieter'}!
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile/settings">Profil bearbeiten</Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campers">Meine Fahrzeuge</TabsTrigger>
            <TabsTrigger value="requests">Buchungsanfragen</TabsTrigger>
            <TabsTrigger value="approved">Bestätigte Buchungen</TabsTrigger>
          </TabsList>
          <TabsContent value="campers" className="mt-6">
            <CamperManagement />
          </TabsContent>
          <TabsContent value="requests" className="mt-6">
            <BookingManagement />
          </TabsContent>
          <TabsContent value="approved" className="mt-6">
            <ApprovedBookings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}