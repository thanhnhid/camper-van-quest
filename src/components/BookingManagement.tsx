import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Check, X, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Booking {
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
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function BookingManagement() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchBookings();
    }
  }, [profile]);

  const fetchBookings = async () => {
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

      // Get bookings for those campers
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          campers!inner(name, images)
        `)
        .in('camper_id', camperIds)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Get customer profiles separately to avoid foreign key issues
      const customerIds = bookingsData?.map(b => b.customer_id).filter(Boolean) || [];
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', customerIds);

      const customerMap = customers?.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {} as Record<string, any>) || {};

      const formattedBookings: Booking[] = bookingsData?.map(booking => ({
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
          images: booking.campers.images || []
        },
        customer: {
          first_name: customerMap[booking.customer_id]?.first_name || '',
          last_name: customerMap[booking.customer_id]?.last_name || '',
          email: customerMap[booking.customer_id]?.email || ''
        }
      })) || [];

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Fehler beim Laden der Buchungsanfragen');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(
        status === 'confirmed' 
          ? 'Buchung wurde bestätigt' 
          : 'Buchung wurde abgelehnt'
      );
      
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Fehler beim Aktualisieren der Buchung');
    }
  };

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

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return <div className="p-4">Buchungsanfragen werden geladen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Buchungsanfragen</h2>
        <Badge variant="outline" className="text-sm">
          {bookings.filter(b => b.status === 'pending').length} wartende Anfragen
        </Badge>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              Noch keine wartenden Buchungsanfragen.
            </p>
            <p className="text-sm text-gray-400">
              Sobald Kunden Ihre Camper buchen möchten, erscheinen die Anfragen hier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.filter(booking => booking.status === 'pending').map((booking) => (
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
                      <p className="text-sm text-gray-600">
                        Kunde: {booking.customer.first_name} {booking.customer.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{booking.customer.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Anreise:</span>
                    <p className="font-medium">{format(new Date(booking.start_date), 'dd.MM.yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Abreise:</span>
                    <p className="font-medium">{format(new Date(booking.end_date), 'dd.MM.yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Dauer:</span>
                    <p className="font-medium">{calculateDays(booking.start_date, booking.end_date)} Tage</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gesamtpreis:</span>
                    <p className="font-medium">{booking.total_price}€</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Angefragt am: {format(new Date(booking.created_at), 'dd.MM.yyyy HH:mm')}
                </div>

                {booking.status === 'pending' && (
                  <div className="flex space-x-2 pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="flex items-center space-x-1">
                          <Check className="h-4 w-4" />
                          <span>Bestätigen</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Buchung bestätigen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie die Buchung für "{booking.camper.name}" vom {format(new Date(booking.start_date), 'dd.MM.yyyy')} 
                            bis {format(new Date(booking.end_date), 'dd.MM.yyyy')} bestätigen?
                            <br /><br />
                            Der Kunde wird benachrichtigt und die Buchung wird verbindlich.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Bestätigen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1">
                          <X className="h-4 w-4" />
                          <span>Ablehnen</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Buchung ablehnen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie die Buchung für "{booking.camper.name}" ablehnen?
                            <br /><br />
                            Der Kunde wird über die Ablehnung informiert und kann eine andere Buchung vornehmen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateBookingStatus(booking.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ablehnen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}