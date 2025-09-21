import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, MapPin, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DatabaseCamper {
  id: string;
  name: string;
  description: string | null;
  price_per_day: number;
  location: string;
  capacity: number;
  features: string[] | null;
  images: string[] | null;
  status: string;
}

interface CamperCardProps {
  camper: DatabaseCamper;
}

const CamperCard = ({ camper }: CamperCardProps) => {
  const { profile } = useAuth();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchReviewStats();
    if (profile) {
      checkWishlistStatus();
    }
  }, [camper.id, profile]);

  const checkWishlistStatus = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('customer_id', profile.id)
        .eq('camper_id', camper.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking wishlist status:', error);
        return;
      }

      setIsInWishlist(!!data);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!profile) {
      toast.error("Bitte melden Sie sich an, um die Wunschliste zu verwenden");
      return;
    }

    setWishlistLoading(true);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('customer_id', profile.id)
          .eq('camper_id', camper.id);

        if (error) throw error;
        
        setIsInWishlist(false);
        toast.success("Aus Wunschliste entfernt");
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert([{
            customer_id: profile.id,
            camper_id: camper.id
          }]);

        if (error) throw error;
        
        setIsInWishlist(true);
        toast.success("Zur Wunschliste hinzugefügt");
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error("Fehler beim Aktualisieren der Wunschliste");
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('camper_id', camper.id);

      if (error) {
        console.error('Error fetching review stats:', error);
        return;
      }

      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        setAverageRating(Math.round(avg * 10) / 10);
        setReviewCount(reviews.length);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {camper.images && camper.images.length > 0 ? (
          <img
            src={camper.images[0]}
            alt={camper.name}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Keine Bilder verfügbar</span>
          </div>
        )}
        {camper.status !== 'approved' && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            Nicht verfügbar
          </Badge>
        )}
        
        {/* Wishlist Button */}
        {profile && profile.role === 'customer' && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 left-2 p-2 h-auto ${
              isInWishlist 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-white hover:text-red-500'
            } bg-black/20 hover:bg-black/40`}
            onClick={toggleWishlist}
            disabled={wishlistLoading}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{camper.name}</h3>
        <p className="text-sm text-muted-foreground">
          Wohnmobil in {camper.location}
        </p>
        
        <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {camper.capacity} Personen
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {camper.location}
          </div>
        </div>
        
        {/* Only show rating if there are reviews */}
        {reviewCount > 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
              <span className="text-sm font-medium">{averageRating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} Bewertung{reviewCount !== 1 ? 'en' : ''})
            </span>
          </div>
        )}
        
        <div className="mt-3">
          <span className="text-2xl font-bold">{camper.price_per_day}€</span>
          <span className="text-sm text-muted-foreground"> / Tag</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/camper/${camper.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={camper.status !== 'approved'}
          >
            {camper.status === 'approved' ? "Details ansehen" : "Nicht verfügbar"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CamperCard;