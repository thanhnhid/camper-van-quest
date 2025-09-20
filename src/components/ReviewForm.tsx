import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ReviewFormProps {
  bookingId: string;
  camperId: string;
  camperName: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ bookingId, camperId, camperName, onReviewSubmitted }: ReviewFormProps) {
  const { profile } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile || rating === 0) {
      toast.error("Bitte wählen Sie eine Bewertung aus");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          camper_id: camperId,
          customer_id: profile.id,
          booking_id: bookingId,
          rating: rating,
          review: review.trim() || null
        });

      if (error) throw error;

      toast.success("Bewertung erfolgreich eingereicht!");
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Fehler beim Einreichen der Bewertung");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bewerten Sie "{camperName}"</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bewertung *</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Sehr schlecht"}
                {rating === 2 && "Schlecht"}
                {rating === 3 && "Durchschnittlich"}
                {rating === 4 && "Gut"}
                {rating === 5 && "Ausgezeichnet"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ihre Erfahrung (optional)</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Teilen Sie Ihre Erfahrungen mit diesem Wohnmobil..."
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {review.length}/1000 Zeichen
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Wird eingereicht..." : "Bewertung abgeben"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}