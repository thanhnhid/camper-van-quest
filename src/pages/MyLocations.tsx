import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Location {
  id: string;
  name: string;
  address: string;
  created_at: string;
}

export default function MyLocations() {
  const { profile } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  useEffect(() => {
    if (profile) {
      fetchLocations();
    }
  }, [profile]);

  const fetchLocations = async () => {
    try {
      // For now, we'll use localStorage to store locations
      // In a real app, you'd want to create a locations table in Supabase
      const savedLocations = localStorage.getItem(`locations_${profile?.id}`);
      if (savedLocations) {
        setLocations(JSON.parse(savedLocations));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocations = (newLocations: Location[]) => {
    localStorage.setItem(`locations_${profile?.id}`, JSON.stringify(newLocations));
    setLocations(newLocations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    const newLocation: Location = {
      id: editingLocation?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      address: formData.address.trim(),
      created_at: editingLocation?.created_at || new Date().toISOString()
    };

    if (editingLocation) {
      const updatedLocations = locations.map(loc => 
        loc.id === editingLocation.id ? newLocation : loc
      );
      saveLocations(updatedLocations);
      toast.success('Standort wurde aktualisiert');
    } else {
      saveLocations([...locations, newLocation]);
      toast.success('Standort wurde hinzugefügt');
    }

    setFormData({ name: '', address: '' });
    setEditingLocation(null);
    setDialogOpen(false);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address
    });
    setDialogOpen(true);
  };

  const handleDelete = (locationId: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== locationId);
    saveLocations(updatedLocations);
    toast.success('Standort wurde gelöscht');
  };

  const resetForm = () => {
    setFormData({ name: '', address: '' });
    setEditingLocation(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Lade Standorte...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Meine Standorte</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre bevorzugten Standorte für einfacheres Buchen
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Standort hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? 'Standort bearbeiten' : 'Neuen Standort hinzufügen'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="z.B. Mein Zuhause, Büro, etc."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Straße, PLZ Stadt"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button type="submit" className="flex-1">
                  {editingLocation ? 'Aktualisieren' : 'Hinzufügen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Keine Standorte gespeichert</CardTitle>
            <CardDescription className="text-center mb-4">
              Fügen Sie Ihre häufig genutzten Standorte hinzu, um schneller nach Campern in der Nähe zu suchen.
            </CardDescription>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ersten Standort hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <CardDescription>{location.address}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Standort löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sind Sie sicher, dass Sie den Standort "{location.name}" löschen möchten? 
                            Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(location.id)}>
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}