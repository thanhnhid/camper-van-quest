import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ArrowLeft, Calendar, MapPin, Euro } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface BookingDetails {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  camper: {
    name: string;
    location: string;
    cancellation_fee: number;
    images: string[];
  };
  provider: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default function CancelBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          total_price,
          campers (
            name,
            location,
            cancellation_fee,
            images,
            provider_id,
            profiles!campers_provider_id_fkey (
              email,
              first_name,
              last_name
            )
          )
        `)
        .eq('id', bookingId)
        .eq('customer_id', profile?.id)
        .single();

      if (error) throw error;

      if (bookingData) {
        setBooking({
          id: bookingData.id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          total_price: bookingData.total_price,
          camper: {
            name: bookingData.campers.name,
            location: bookingData.campers.location,
            cancellation_fee: bookingData.campers.cancellation_fee || 0,
            images: bookingData.campers.images || []
          },
          provider: {
            email: bookingData.campers.profiles.email,
            first_name: bookingData.campers.profiles.first_name,
            last_name: bookingData.campers.profiles.last_name
          }
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Fehler beim Laden der Buchungsdetails');
      navigate('/dashboard/customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancellation = async () => {
    if (!booking || !reason.trim()) {
      toast.error('Bitte geben Sie einen Grund für die Stornierung an');
      return;
    }

    setCancelling(true);
    
    try {
      // Send notification to provider
      await supabase.functions.invoke('send-cancellation-notification', {
        body: {
          providerEmail: booking.provider.email,
          providerName: `${booking.provider.first_name} ${booking.provider.last_name}`,
          customerName: `${profile?.first_name} ${profile?.last_name}`,
          camperName: booking.camper.name,
          startDate: booking.start_date,
          endDate: booking.end_date,
          reason: reason,
          cancellationFee: booking.camper.cancellation_fee
        }
      });

      // Delete the booking
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Buchung wurde erfolgreich storniert');
      navigate('/dashboard/customer');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Fehler beim Stornieren der Buchung');
    } finally {
      setCancelling(false);
    }
  };

  const calculateDaysUntilStart = () => {
    if (!booking) return 0;
    const today = new Date();
    const startDate = parseISO(booking.start_date);
    return Math.max(0, differenceInDays(startDate, today));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Lade Buchungsdetails...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Buchung nicht gefunden</div>
      </div>
    );
  }

  const daysUntilStart = calculateDaysUntilStart();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/customer')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zu Meine Buchungen
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Buchung stornieren
          </CardTitle>
          <CardDescription>
            Bitte bestätigen Sie die Stornierung Ihrer Buchung. Diese Aktion kann nicht rückgängig gemacht werden.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Booking Details */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">{booking.camper.name}</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {booking.camper.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(parseISO(booking.start_date), 'dd.MM.yyyy', { locale: de })} - {format(parseISO(booking.end_date), 'dd.MM.yyyy', { locale: de })}
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4" />
                Gesamtpreis: {booking.total_price}€
              </div>
            </div>
          </div>

          {/* Cancellation Fee Warning */}
          {booking.camper.cancellation_fee > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                Stornogebühr
              </div>
              <p className="text-sm">
                Für diese Stornierung fällt eine Gebühr von <strong>{booking.camper.cancellation_fee}€</strong> an.
                {daysUntilStart < 7 && (
                  <span className="block mt-1 text-destructive">
                    Da die Stornierung weniger als 7 Tage vor Reisebeginn erfolgt, wird die volle Stornogebühr fällig.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">Grund für die Stornierung *</Label>
            <Textarea
              id="reason"
              placeholder="Bitte geben Sie den Grund für Ihre Stornierung an..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/customer')}
            disabled={cancelling}
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancellation}
            disabled={cancelling || !reason.trim()}
            className="flex-1"
          >
            {cancelling ? 'Wird storniert...' : 'Buchung stornieren'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}