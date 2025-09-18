import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CamperForm } from "@/components/CamperForm";
import { TermsDialog } from "@/components/TermsDialog";
import { useAuth } from "@/hooks/useAuth";

export default function AddCamper() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (profile) {
      checkTermsAcceptance();
    }
  }, [profile]);

  const checkTermsAcceptance = async () => {
    if (!profile?.terms_accepted) {
      setShowTermsDialog(true);
    } else {
      setShowForm(true);
    }
  };

  const handleSuccess = () => {
    navigate('/dashboard/provider');
  };

  const handleCancel = () => {
    navigate('/dashboard/provider');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/provider')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Dashboard
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Neuen Camper hinzufügen
              </h1>
              <p className="text-gray-600 mt-1">
                Erstellen Sie ein neues Camper-Angebot für Ihre Kunden
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Camper-Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Füllen Sie alle erforderlichen Informationen aus, um Ihren Camper zu veröffentlichen.
                Nach der Übermittlung wird Ihr Camper von unserem Team überprüft.
              </p>
              
              <CamperForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                editingCamper={null}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                Sie müssen zuerst die Nutzungsbedingungen akzeptieren, um einen Camper hinzuzufügen.
              </p>
            </CardContent>
          </Card>
        )}

        <TermsDialog
          open={showTermsDialog}
          onOpenChange={setShowTermsDialog}
          onAccept={() => {
            setShowTermsDialog(false);
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
}