import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Calendar, MapPin, Euro, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
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
  
  // Customer form data
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Deutschland'
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

    // Pre-fill customer data if available in profile
    if (profile) {
      setCustomerData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: '',
        zipCode: '',
        country: 'Deutschland'
      });
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }
    
    if (!customerData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }
    
    if (!customerData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'E-Mail Format ungültig';
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
    }
    
    if (!customerData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich';
    }

    if (!customerData.city.trim()) {
      newErrors.city = 'Stadt ist erforderlich';
    }

    if (!customerData.zipCode.trim()) {
      newErrors.zipCode = 'Postleitzahl ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConfirmBooking = async () => {
    if (!profile || !validateForm()) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder korrekt aus.",
        variant: "destructive"
      });
      return;
    }

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

      // Update profile with customer data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          phone: customerData.phone,
          address: `${customerData.address}, ${customerData.zipCode} ${customerData.city}, ${customerData.country}`
        })
        .eq('id', profile.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Continue with booking even if profile update fails
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
          Geben Sie Ihre Kontaktdaten ein und bestätigen Sie alle Details vor der finalen Buchung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Ihre Kontaktdaten</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={customerData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={customerData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">E-Mail-Adresse *</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Telefonnummer *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                placeholder="+49 123 456789"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="address">Straße und Hausnummer *</Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                placeholder="Musterstraße 123"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Postleitzahl *</Label>
                <Input
                  id="zipCode"
                  value={customerData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                  placeholder="12345"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Stadt *</Label>
                <Input
                  id="city"
                  value={customerData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  placeholder="Berlin"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={customerData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Deutschland"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Diese Daten werden an den Vermieter weitergegeben und sind für die Buchungsabwicklung erforderlich.
              </AlertDescription>
            </Alert>
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