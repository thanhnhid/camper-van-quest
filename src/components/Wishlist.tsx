import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Users, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  camper_id: string;
  created_at: string;
  campers: {
    id: string;
    name: string;
    location: string;
    price_per_day: number;
    capacity: number;
    images: string[];
    status: string;
  } | null;
}

export default function Wishlist() {
  const { profile } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchWishlist();
    }
  }, [profile]);

  const fetchWishlist = async () => {
    if (!profile) return;

    try {
      // First get wishlist items
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('id, camper_id, created_at')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });

      if (wishlistError) throw wishlistError;

      if (!wishlistData || wishlistData.length === 0) {
        setWishlistItems([]);
        return;
      }

      // Get camper details for each wishlist item
      const camperIds = wishlistData.map(item => item.camper_id);
      const { data: campersData, error: campersError } = await supabase
        .from('campers')
        .select('id, name, location, price_per_day, capacity, images, status')
        .in('id', camperIds);

      if (campersError) throw campersError;

      // Combine wishlist and camper data
      const combinedData: WishlistItem[] = wishlistData.map(wishlistItem => {
        const camperData = campersData?.find(camper => camper.id === wishlistItem.camper_id);
        return {
          ...wishlistItem,
          campers: camperData || null
        };
      }).filter(item => item.campers !== null);

      setWishlistItems(combinedData);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Fehler beim Laden der Wunschliste');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
      toast.success('Fahrzeug aus Wunschliste entfernt');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Fehler beim Entfernen aus der Wunschliste');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Wunschliste wird geladen...</p>
        </CardContent>
      </Card>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Meine Wunschliste
          </CardTitle>
          <CardDescription>
            Speichern Sie Ihre Lieblings-Camper für später
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Ihre Wunschliste ist noch leer.
          </p>
          <Button asChild>
            <Link to="/campers">
              Camper entdecken
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Meine Wunschliste ({wishlistItems.length})
        </CardTitle>
        <CardDescription>
          Ihre gespeicherten Lieblings-Camper
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => {
            if (!item.campers) return null;
            
            return (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative">
                {item.campers.images && item.campers.images.length > 0 ? (
                  <img
                    src={item.campers.images[0]}
                    alt={item.campers.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Kein Bild</span>
                  </div>
                )}
                <Badge 
                  variant={item.campers.status === 'approved' ? 'default' : 'secondary'}
                  className="absolute top-2 right-2"
                >
                  {item.campers.status === 'approved' ? 'Verfügbar' : 'Nicht verfügbar'}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {item.campers.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.campers.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {item.campers.capacity} Personen
                  </div>
                  <div className="text-lg font-bold text-primary">
                    €{item.campers.price_per_day}/Tag
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    asChild
                    disabled={item.campers.status !== 'approved'}
                  >
                    <Link to={`/camper/${item.campers.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ansehen
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}