import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Check, Eye, MapPin, Users, Clock, Euro, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays } from "date-fns";

interface ApprovedBooking {
  id: string;
  camper_id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'confirmed';
  created_at: string;
  camper: {
    name: string;
    images: string[];
    location: string;
    price_per_day: number;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export function ApprovedBookings() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<ApprovedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchApprovedBookings();
    }
  }, [profile]);

  // Set up real-time subscription for booking changes
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('approved-booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Booking updated:', payload);
          // Refresh bookings when status changes
          fetchApprovedBookings();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Booking deleted:', payload);
          // Refresh bookings when a booking is deleted
          fetchApprovedBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const fetchApprovedBookings = async () => {
    if (!profile) return;

    try {
      // First get campers owned by this provider
      const { data: campers, error: campersError } = await supabase
        .from('campers')
        .select('id')
        .eq('provider_id', profile.id);

      if (campersError) throw campersError;

      if (!campers || campers.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const camperIds = campers.map(c => c.id);

      // Get confirmed bookings for those campers
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          campers!inner(name, images, location, price_per_day)
        `)
        .in('camper_id', camperIds)
        .eq('status', 'confirmed')
        .order('start_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Get customer profiles separately
      const customerIds = bookingsData?.map(b => b.customer_id).filter(Boolean) || [];
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .in('id', customerIds);

      const customerMap = customers?.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {} as Record<string, any>) || {};

      const formattedBookings: ApprovedBooking[] = bookingsData?.map(booking => ({
        id: booking.id,
        camper_id: booking.camper_id,
        customer_id: booking.customer_id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        total_price: booking.total_price,
        status: 'confirmed',
        created_at: booking.created_at,
        camper: {
          name: booking.campers.name,
          images: booking.campers.images || [],
          location: booking.campers.location,
          price_per_day: booking.campers.price_per_day
        },
        customer: {
          first_name: customerMap[booking.customer_id]?.first_name || '',
          last_name: customerMap[booking.customer_id]?.last_name || '',
          email: customerMap[booking.customer_id]?.email || '',
          phone: customerMap[booking.customer_id]?.phone || ''
        }
      })) || [];

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
      toast.error('Fehler beim Laden der bestätigten Buchungen');
    } finally {
      setLoading(false);
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

  const isActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getBookingStatus = (startDate: string, endDate: string) => {
    if (isActive(startDate, endDate)) {
      return { text: 'Aktiv', color: 'bg-blue-100 text-blue-800' };
    }
    if (isUpcoming(startDate)) {
      return { text: 'Bevorstehend', color: 'bg-green-100 text-green-800' };
    }
    return { text: 'Abgeschlossen', color: 'bg-gray-100 text-gray-800' };
  };

  const handleCancelBooking = async (booking: ApprovedBooking) => {
    if (!cancellationReason.trim()) {
      toast.error('Bitte geben Sie einen Grund für die Stornierung an');
      return;
    }

    setCancellingBooking(booking.id);
    
    try {
      // Delete the booking (same as customer cancellation)
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (deleteError) throw deleteError;

      // Send cancellation notification to customer
      const { error: notificationError } = await supabase.functions.invoke('send-customer-cancellation-notification', {
        body: {
          customerEmail: booking.customer.email,
          customerName: `${booking.customer.first_name} ${booking.customer.last_name}`,
          providerName: `${profile?.first_name} ${profile?.last_name}`,
          camperName: booking.camper.name,
          startDate: booking.start_date,
          endDate: booking.end_date,
          reason: cancellationReason,
          cancellationFee: 0 // You can add this field if needed
        }
      });

      if (notificationError) {
        console.error('Error sending notification:', notificationError);
        toast.error('Buchung wurde storniert, aber die Benachrichtigung konnte nicht gesendet werden');
      } else {
        toast.success('Buchung wurde erfolgreich storniert und der Kunde wurde benachrichtigt');
      }

      // Remove the cancelled booking from the list
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      setDialogOpen(false);
      setCancellationReason("");
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Fehler beim Stornieren der Buchung');
    } finally {
      setCancellingBooking(null);
    }
  };

  if (loading) {
    return <div className="p-4">Bestätigte Buchungen werden geladen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bestätigte Buchungen</h2>
          <p className="text-sm text-gray-600 mt-1">
            Alle bestätigten Buchungen Ihrer Camper
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {bookings.filter(b => isUpcoming(b.start_date)).length} bevorstehend
          </Badge>
          <Badge variant="outline" className="text-sm">
            {bookings.filter(b => isActive(b.start_date, b.end_date)).length} aktiv
          </Badge>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              Noch keine bestätigten Buchungen.
            </p>
            <p className="text-sm text-gray-400">
              Bestätigte Buchungsanfragen erscheinen hier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = getBookingStatus(booking.start_date, booking.end_date);
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
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Kunde</h4>
                    <div className="space-y-1">
                      <p className="font-medium">{booking.customer.first_name} {booking.customer.last_name}</p>
                      <p className="text-sm text-gray-600">{booking.customer.email}</p>
                      {booking.customer.phone && (
                        <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                      )}
                    </div>
                  </div>

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

                  {/* Actions */}
                  {isUpcoming(booking.start_date) && (
                    <div className="pt-3 border-t border-gray-100">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="w-full"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Buchung stornieren
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Buchung stornieren</DialogTitle>
                            <DialogDescription>
                              Sie sind dabei, die Buchung für "{booking.camper.name}" zu stornieren. 
                              Der Kunde wird automatisch benachrichtigt.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="reason">Grund der Stornierung *</Label>
                              <Textarea
                                id="reason"
                                placeholder="Bitte geben Sie den Grund für die Stornierung ein..."
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setDialogOpen(false);
                                setCancellationReason("");
                              }}
                            >
                              Abbrechen
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive"
                                  disabled={!cancellationReason.trim() || cancellingBooking === booking.id}
                                >
                                  {cancellingBooking === booking.id ? "Storniere..." : "Stornieren"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Stornierung bestätigen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sind Sie sicher, dass Sie diese Buchung stornieren möchten? 
                                    Diese Aktion kann nicht rückgängig gemacht werden.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancelBooking(booking)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Stornieren
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Buchung bestätigt am: {format(new Date(booking.created_at), 'dd.MM.yyyy HH:mm')}</span>
                      <span>Tagespreis: {booking.camper.price_per_day}€</span>
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