import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CamperUploadForm } from "./CamperUploadForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Camper {
  id: string;
  name: string;
  description: string;
  price_per_day: number;
  location: string;
  capacity: number;
  features: string[];
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  created_at: string;
  updated_at: string;
}

export function CamperManagement() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingCamper, setEditingCamper] = useState<Camper | null>(null);

  useEffect(() => {
    if (profile) {
      fetchCampers();
    }
  }, [profile]);

  // Refresh campers when component mounts or becomes visible again
  useEffect(() => {
    const handleFocus = () => {
      if (profile) {
        fetchCampers();
      }
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden && profile) {
        fetchCampers();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile]);

  const fetchCampers = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('campers')
        .select('*')
        .eq('provider_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampers((data || []) as Camper[]);
    } catch (error) {
      console.error('Error fetching campers:', error);
      toast.error('Fehler beim Laden der Camper');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamper = () => {
    navigate('/provider/add-camper');
  };

  const handleEditCamper = (camper: Camper) => {
    setEditingCamper(camper);
    setShowUploadForm(true);
  };

  const handleDeleteCamper = async (camperId: string) => {
    try {
      const { error } = await supabase
        .from('campers')
        .delete()
        .eq('id', camperId);

      if (error) throw error;
      
      toast.success('Camper wurde gelöscht');
      fetchCampers();
    } catch (error) {
      console.error('Error deleting camper:', error);
      toast.error('Fehler beim Löschen des Campers');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Genehmigt';
      case 'rejected': return 'Abgelehnt';
      case 'pending': return 'Prüfung läuft';
      case 'archived': return 'Archiviert';
      default: return 'Unbekannt';
    }
  };

  if (loading) {
    return <div className="p-4">Camper werden geladen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meine Camper</h2>
        <Button onClick={handleAddCamper}>
          <Plus className="h-4 w-4 mr-2" />
          Camper hinzufügen
        </Button>
      </div>

      {campers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              Sie haben noch keine Camper hinzugefügt.
            </p>
            <Button onClick={handleAddCamper}>
              <Plus className="h-4 w-4 mr-2" />
              Ersten Camper hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campers.map((camper) => (
            <Card key={camper.id} className="overflow-hidden">
              <div className="relative">
                {camper.images.length > 0 ? (
                  <img
                    src={camper.images[0]}
                    alt={camper.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${getStatusColor(camper.status)}`}
                >
                  {getStatusText(camper.status)}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{camper.name}</CardTitle>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{camper.location}</span>
                  <span>{camper.price_per_day}€/Tag</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {camper.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Schlafplätze: {camper.capacity} | Features: {camper.features.length}
                </p>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCamper(camper)}
                    disabled={camper.status === 'archived'}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 flex items-center space-x-1">
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Löschen</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Camper löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Sind Sie sicher, dass Sie "{camper.name}" löschen möchten? 
                          Diese Aktion kann nicht rückgängig gemacht werden und der Camper wird sofort von der Website entfernt.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCamper(camper.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Endgültig löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CamperUploadForm
        open={showUploadForm}
        onOpenChange={(open) => {
          setShowUploadForm(open);
          if (!open) {
            setEditingCamper(null);
            // Force refresh when dialog closes
            fetchCampers();
          }
        }}
        onSuccess={() => {
          fetchCampers();
          setShowUploadForm(false);
          setEditingCamper(null);
        }}
        editingCamper={editingCamper}
      />
    </div>
  );
}