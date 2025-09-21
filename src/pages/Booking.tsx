import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Sparkles } from "lucide-react";
import { mockCampers, insuranceOptions } from "@/data/campers";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [camper, setCamper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    insurance: "basic",
    finalCleaning: false,
    deposit: true
  });

  useEffect(() => {
    if (id) {
      fetchCamper();
    }
  }, [id]);

  // Load dates from URL parameters when component mounts
  useEffect(() => {
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    
    if (startParam && endParam) {
      setBookingData(prev => ({
        ...prev,
        startDate: startParam,
        endDate: endParam
      }));
    }
  }, [searchParams]);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Lade Wohnmobil...</div>
      </div>
    );
  }

  if (!camper) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wohnmobil nicht gefunden</h1>
          <Link to="/campers">
            <Button className="mt-4">Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const selectedInsurance = insuranceOptions.find(ins => ins.id === bookingData.insurance);
  
  const costs = {
    camper: days * (camper?.price_per_day || 0),
    insurance: days * (selectedInsurance?.price || 0),
    finalCleaning: bookingData.finalCleaning ? 75 : 0,
    deposit: 500
  };
  
  const totalCost = costs.camper + costs.insurance + costs.finalCleaning;

  const handleBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie Start- und Enddatum aus.",
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein, um eine Buchung zu erstellen.",
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
        .gte('end_date', bookingData.startDate)
        .lte('start_date', bookingData.endDate);

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
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
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

      // Navigate to a success page or back to campers
      navigate('/campers');
      
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Buchung für {camper.name}</h1>
        <p className="text-muted-foreground">
          {camper.location} - {camper.price_per_day}€ pro Tag
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Mietdauer wählen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Abholung</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Rückgabe</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              {days > 0 && (
                <p className="text-sm text-muted-foreground">
                  Mietdauer: {days} Tag{days !== 1 ? 'e' : ''}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Insurance Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Versicherungsschutz wählen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={bookingData.insurance}
                onValueChange={(value) => setBookingData({...bookingData, insurance: value})}
              >
                {insuranceOptions.map((insurance) => (
                  <div key={insurance.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={insurance.id} id={insurance.id} />
                      <Label htmlFor={insurance.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{insurance.name}</span>
                          <Badge variant="outline">{insurance.price}€/Tag</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="ml-6 text-sm text-muted-foreground">
                      <p>{insurance.description}</p>
                      <ul className="mt-1 space-y-1">
                        {insurance.coverage.map((item, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-primary rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Additional Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Zusätzliche Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="finalCleaning"
                  checked={bookingData.finalCleaning}
                  onCheckedChange={(checked) => 
                    setBookingData({...bookingData, finalCleaning: !!checked})
                  }
                />
                <Label htmlFor="finalCleaning" className="cursor-pointer">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="font-medium">Endreinigung</p>
                      <p className="text-sm text-muted-foreground">
                        Professionelle Reinigung nach der Rückgabe
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-4">75€</Badge>
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Kostenübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fahrzeugmiete ({days} Tage)</span>
                  <span>{costs.camper}€</span>
                </div>
                
                {selectedInsurance && (
                  <div className="flex justify-between">
                    <span>Versicherung ({selectedInsurance.name})</span>
                    <span>{costs.insurance}€</span>
                  </div>
                )}
                
                {bookingData.finalCleaning && (
                  <div className="flex justify-between">
                    <span>Endreinigung</span>
                    <span>{costs.finalCleaning}€</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Gesamtkosten</span>
                <span>{totalCost}€</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>+ Kaution: {costs.deposit}€</p>
                <p className="text-xs mt-1">
                  (Wird bei unbeschädigter Rückgabe vollständig erstattet)
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  // Navigate to confirmation page with all booking details
                  const params = new URLSearchParams({
                    start: bookingData.startDate,
                    end: bookingData.endDate,
                    insurance: bookingData.insurance,
                    cleaning: bookingData.finalCleaning.toString()
                  });
                  navigate(`/booking/${camper.id}/confirm?${params.toString()}`);
                }}
                className="w-full" 
                disabled={days === 0 || !profile}
              >
                {days === 0 
                  ? "Datum wählen" 
                  : !profile 
                  ? "Anmeldung erforderlich"
                  : "Zur Buchungsbestätigung"
                }
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Kostenlose Stornierung bis 48h vor Abholung
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;