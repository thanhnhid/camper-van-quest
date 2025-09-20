import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
  };
}

interface ReviewsListProps {
  camperId: string;
}

export function ReviewsList({ camperId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    fetchReviews();
  }, [camperId]);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('id, rating, review, created_at, customer_id')
        .eq('camper_id', camperId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setAverageRating(0);
        return;
      }

      // Get customer profiles separately
      const customerIds = reviewsData.map(r => r.customer_id);
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', customerIds);

      const customerMap = customers?.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {} as Record<string, any>) || {};

      const formattedReviews: Review[] = reviewsData.map(review => ({
        id: review.id,
        rating: review.rating,
        review: review.review,
        created_at: review.created_at,
        customer: {
          first_name: customerMap[review.customer_id]?.first_name || 'Anonym',
          last_name: customerMap[review.customer_id]?.last_name || ''
        }
      }));

      setReviews(formattedReviews);

      // Calculate average rating
      const avg = formattedReviews.reduce((sum, review) => sum + review.rating, 0) / formattedReviews.length;
      setAverageRating(Math.round(avg * 10) / 10);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Bewertungen werden geladen...</div>;
  }

  if (reviews.length === 0) {
    return null; // Don't show anything if no reviews
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <span>Bewertungen</span>
            <Badge variant="secondary" className="text-sm">
              {reviews.length} Bewertung{reviews.length !== 1 ? 'en' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="space-y-1">
              {renderStars(averageRating, 'lg')}
              <p className="text-sm text-muted-foreground">
                Durchschnitt aus {reviews.length} Bewertung{reviews.length !== 1 ? 'en' : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {review.customer.first_name} {review.customer.last_name.charAt(0)}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              {review.review && (
                <p className="text-sm text-foreground leading-relaxed">
                  {review.review}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { type Review };