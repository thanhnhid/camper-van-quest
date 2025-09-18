import { useAuth } from "@/hooks/useAuth";
import { CamperManagement } from "@/components/CamperManagement";

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
          </div>
        </div>

        {/* Main Content */}
        <CamperManagement />
      </div>
    </div>
  );
}