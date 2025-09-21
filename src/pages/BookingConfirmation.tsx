import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Calendar, MapPin, Euro, Shield, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { insuranceOptions } from "@/data/campers";

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [camper, setCamper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Get booking details from URL parameters
  const startDate = searchParams.get('start') || '';
  const endDate = searchParams.get('end') || '';
  const insurance = searchParams.get('insurance') || 'basic';
  const finalCleaning = searchParams.get('cleaning') === 'true';

  useEffect(() => {
    if (!profile) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um eine Buchung zu erstellen.",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }

    if (!startDate || !endDate || !id) {
      toast({
        title: "Ungültige Buchungsdaten",
        description: "Bitte kehren Sie zur Camper-Seite zurück und wählen Sie erneut.",
        variant: "destructive"
      });
      navigate('/campers');
      return;
    }

    fetchCamper();
  }, [id, profile, startDate, endDate]);

  const fetchCamper = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campers')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      setCamper(data);
    } catch (error) {
      console.error('Error fetching camper:', error);
      toast({
        title: "Fehler",
        description: "Wohnmobil konnte nicht geladen werden",
        variant: "destructive",
      });
      navigate('/campers');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1;
  };

  const days = calculateDays();
  const selectedInsurance = insuranceOptions.find(ins => ins.id === insurance);
  
  const costs = {
    camper: days * (camper?.price_per_day || 0),
    insurance: days * (selectedInsurance?.price || 0),
    finalCleaning: finalCleaning ? 75 : 0,
    deposit: 500
  };
  
  const totalCost = costs.camper + costs.insurance + costs.finalCleaning;

  const handleConfirmBooking = async () => {
    if (!profile) return;

    setBookingLoading(true);
    
    try {
      // Check availability one more time before booking
      const { data: conflictingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('camper_id', camper.id)
        .in('status', ['confirmed', 'pending'])
        .gte('end_date', startDate)
        .lte('start_date', endDate);

      if (checkError) throw checkError;

      if (conflictingBookings && conflictingBookings.length > 0) {
        toast({
          title: "Fehler",
          description: "Der Camper ist für den gewählten Zeitraum bereits gebucht.",
          variant: "destructive"
        });
        return;
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          camper_id: camper.id,
          customer_id: profile.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalCost,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Buchung erfolgreich!",
        description: `Ihre Buchung für ${camper.name} wurde erfolgreich erstellt und wartet auf Bestätigung.`,
      });

      // Navigate to customer dashboard
      navigate('/dashboard/customer');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Fehler",
        description: "Es gab einen Fehler beim Erstellen der Buchung. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Lade Buchungsdetails...</div>
      </div>
    );
  }

  if (!camper || !profile) {
    return null;
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <h1 className="text-3xl font-bold mb-2">Buchung bestätigen</h1>
        <p className="text-muted-foreground">
          Überprüfen Sie alle Details vor der finalen Buchung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Ihre Daten</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vorname</label>
                <p className="font-medium">{profile.first_name || 'Nicht angegeben'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nachname</label>
                <p className="font-medium">{profile.last_name || 'Nicht angegeben'}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">E-Mail</label>
              <p className="font-medium">{profile.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Telefon</label>
              <p className="font-medium">{profile.phone || 'Nicht angegeben'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Adresse</label>
              <p className="font-medium">{profile.address || 'Nicht angegeben'}</p>
            </div>

            {(!profile.first_name || !profile.last_name || !profile.phone || !profile.address) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Bitte vervollständigen Sie Ihr Profil für eine reibungslose Buchung.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Camper Information */}
        <Card>
          <CardHeader>
            <CardTitle>Gewähltes Wohnmobil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {camper.images && camper.images.length > 0 ? (
                <img
                  src={camper.images[0]}
                  alt={camper.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{camper.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {camper.location}
                </div>
              </div>
            </div>
            
            <div className="text-2xl font-bold">
              {camper.price_per_day}€ <span className="text-sm font-normal text-muted-foreground">pro Tag</span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Buchungsdetails</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Abholung</label>
                <p className="font-medium">{format(new Date(startDate), 'dd.MM.yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rückgabe</label>
                <p className="font-medium">{format(new Date(endDate), 'dd.MM.yyyy')}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mietdauer</label>
              <p className="font-medium">{days} Tag{days !== 1 ? 'e' : ''}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Versicherung</label>
              <p className="font-medium">{selectedInsurance?.name || 'Basis'}</p>
            </div>

            {finalCleaning && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Zusatzleistungen</label>
                <p className="font-medium">Endreinigung</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Euro className="h-5 w-5" />
              <span>Kostenübersicht</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Fahrzeugmiete ({days} Tag{days !== 1 ? 'e' : ''})</span>
                <span className="font-medium">{costs.camper}€</span>
              </div>
              
              {selectedInsurance && costs.insurance > 0 && (
                <div className="flex justify-between">
                  <span>Versicherung ({selectedInsurance.name})</span>
                  <span className="font-medium">{costs.insurance}€</span>
                </div>
              )}
              
              {finalCleaning && (
                <div className="flex justify-between">
                  <span>Endreinigung</span>
                  <span className="font-medium">{costs.finalCleaning}€</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Gesamtkosten</span>
              <span>{totalCost}€</span>
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-medium">Zusätzlich:</p>
              <p>+ Kaution: {costs.deposit}€</p>
              <p className="text-xs mt-1">
                (Wird bei unbeschädigter Rückgabe vollständig erstattet)
              </p>
            </div>

            <Button 
              onClick={handleConfirmBooking} 
              className="w-full" 
              disabled={bookingLoading}
              size="lg"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {bookingLoading 
                ? "Buchung wird erstellt..." 
                : `Jetzt kostenpflichtig buchen (${totalCost}€)`
              }
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Mit der Buchung akzeptieren Sie unsere AGB und Datenschutzbestimmungen.
              <br />
              Kostenlose Stornierung bis 48h vor Abholung möglich.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;