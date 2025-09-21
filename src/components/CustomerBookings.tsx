import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Check, X, Eye, Clock, MapPin, Euro, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays } from "date-fns";
import { ReviewForm } from "./ReviewForm";
import { useNavigate } from "react-router-dom";

interface CustomerBooking {
  id: string;
  camper_id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  camper: {
    name: string;
    images: string[];
    location: string;
    price_per_day: number;
  };
  provider: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  hasReview?: boolean;
}

export function CustomerBookings() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null);

  useEffect(() => {
    if (profile) {
      fetchBookings();
    }
  }, [profile]);

  // Set up real-time subscription for booking status changes
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `customer_id=eq.${profile.id}`
        },
        (payload) => {
          console.log('Booking updated:', payload);
          // Refresh bookings when status changes
          fetchBookings();
          
          // Show notification
          const newStatus = payload.new?.status;
          if (newStatus === 'confirmed') {
            toast.success('Ihre Buchung wurde bestätigt!');
          } else if (newStatus === 'rejected') {
            toast.error('Ihre Buchung wurde leider abgelehnt.');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings',
          filter: `customer_id=eq.${profile.id}`
        },
        (payload) => {
          console.log('Booking deleted:', payload);
          // Refresh bookings when a booking is deleted
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const fetchBookings = async () => {
    if (!profile) return;

    try {
      // Get bookings for this customer
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          campers!inner(name, images, location, price_per_day, provider_id)
        `)
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Get provider profiles separately
      const providerIds = bookingsData?.map(b => b.campers.provider_id).filter(Boolean) || [];
      const { data: providers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .in('id', providerIds);

      const providerMap = providers?.reduce((acc, provider) => {
        acc[provider.id] = provider;
        return acc;
      }, {} as Record<string, any>) || {};

      // Get existing reviews for these bookings
      const bookingIds = bookingsData?.map(b => b.id) || [];
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('booking_id')
        .in('booking_id', bookingIds);

      const reviewedBookingIds = new Set(existingReviews?.map(r => r.booking_id) || []);

      const formattedBookings: CustomerBooking[] = bookingsData?.map(booking => ({
        id: booking.id,
        camper_id: booking.camper_id,
        customer_id: booking.customer_id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        total_price: booking.total_price,
        status: booking.status as 'pending' | 'confirmed' | 'rejected',
        created_at: booking.created_at,
        camper: {
          name: booking.campers.name,
          images: booking.campers.images || [],
          location: booking.campers.location,
          price_per_day: booking.campers.price_per_day
        },
        provider: {
          first_name: providerMap[booking.campers.provider_id]?.first_name || '',
          last_name: providerMap[booking.campers.provider_id]?.last_name || '',
          email: providerMap[booking.campers.provider_id]?.email || '',
          phone: providerMap[booking.campers.provider_id]?.phone || ''
        },
        hasReview: reviewedBookingIds.has(booking.id)
      })) || [];

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Fehler beim Laden der Buchungen');
    } finally {
      setLoading(false);
    }
  };

  // Removed cancelBooking function - now handled by CancelBooking page

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Bestätigt';
      case 'rejected': return 'Abgelehnt';
      case 'pending': return 'Wartend';
      default: return 'Unbekannt';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1;
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const canCancel = (booking: CustomerBooking) => {
    return booking.status === 'pending' || (booking.status === 'confirmed' && isUpcoming(booking.start_date));
  };

  const canReview = (booking: CustomerBooking) => {
    return booking.status === 'confirmed' && 
           new Date(booking.end_date) < new Date() && 
           !booking.hasReview;
  };

  const handleReviewSubmitted = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
    fetchBookings(); // Refresh to update hasReview status
  };

  if (loading) {
    return <div className="p-4">Buchungen werden geladen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meine Buchungen</h2>
          <p className="text-sm text-gray-600 mt-1">
            Alle Ihre Wohnmobil-Buchungen im Überblick
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {bookings.filter(b => b.status === 'pending').length} wartend
          </Badge>
          <Badge variant="outline" className="text-sm">
            {bookings.filter(b => b.status === 'confirmed').length} bestätigt
          </Badge>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              Sie haben noch keine Buchungen.
            </p>
            <p className="text-sm text-gray-400">
              Entdecken Sie unsere Wohnmobile und buchen Sie Ihr nächstes Abenteuer!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const days = calculateDays(booking.start_date, booking.end_date);
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {booking.camper.images.length > 0 ? (
                        <img
                          src={booking.camper.images[0]}
                          alt={booking.camper.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{booking.camper.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.camper.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(booking.status)}
                          <span>{getStatusText(booking.status)}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Provider Information */}
                  {booking.status === 'confirmed' && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-green-700 mb-2">Vermieter Kontakt</h4>
                      <div className="space-y-1">
                        <p className="font-medium text-green-800">{booking.provider.first_name} {booking.provider.last_name}</p>
                        <p className="text-sm text-green-700">{booking.provider.email}</p>
                        {booking.provider.phone && (
                          <p className="text-sm text-green-700">{booking.provider.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Anreise</p>
                        <p className="text-sm font-medium">{format(new Date(booking.start_date), 'dd.MM.yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Abreise</p>
                        <p className="text-sm font-medium">{format(new Date(booking.end_date), 'dd.MM.yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Dauer</p>
                        <p className="text-sm font-medium">{days} Tag{days > 1 ? 'e' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Gesamtpreis</p>
                        <p className="text-sm font-medium">{booking.total_price}€</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information and Actions */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <span>Gebucht am: {format(new Date(booking.created_at), 'dd.MM.yyyy HH:mm')}</span>
                        <span className="ml-4">Tagespreis: {booking.camper.price_per_day}€</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {canReview(booking) && (
                          <Dialog open={reviewDialogOpen && selectedBooking?.id === booking.id} onOpenChange={(open) => {
                            setReviewDialogOpen(open);
                            if (!open) setSelectedBooking(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Bewerten
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Camper bewerten</DialogTitle>
                              </DialogHeader>
                              {selectedBooking && (
                                <ReviewForm
                                  bookingId={selectedBooking.id}
                                  camperId={selectedBooking.camper_id}
                                  camperName={selectedBooking.camper.name}
                                  onReviewSubmitted={handleReviewSubmitted}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {canCancel(booking) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Stornieren
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Buchung stornieren</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Möchten Sie die Buchung für "{booking.camper.name}" wirklich stornieren?
                                  <br /><br />
                                  Diese Aktion kann nicht rückgängig gemacht werden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => navigate(`/cancel-booking/${booking.id}`)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Stornieren
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}