import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, Users, MapPin, Fuel, Settings, Ruler, CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockCampers } from "@/data/campers";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, isSameDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CamperDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const camper = mockCampers.find(c => c.id === id);
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | null>(null);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (camper?.id) {
      fetchBlockedDates();
    }
  }, [camper?.id]);

  const fetchBlockedDates = async () => {
    if (!camper?.id) return;

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('camper_id', camper.id)
        .in('status', ['confirmed', 'pending']);

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      const blocked: Date[] = [];
      bookings.forEach(booking => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          blocked.push(new Date(date));
        }
      });
      
      setBlockedDates(blocked);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const checkAvailability = async () => {
    if (!startDate || !endDate || !camper?.id) return;

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const { data: conflictingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('camper_id', camper.id)
        .in('status', ['confirmed', 'pending'])
        .or(`and(start_date.lte.${format(endDate, 'yyyy-MM-dd')},end_date.gte.${format(startDate, 'yyyy-MM-dd')})`);

      if (error) {
        toast({
          title: "Fehler",
          description: "Verfügbarkeit konnte nicht überprüft werden",
          variant: "destructive",
        });
        return;
      }

      const isAvailable = conflictingBookings.length === 0;
      setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');

      if (!isAvailable) {
        toast({
          title: "Nicht verfügbar",
          description: "Der Camper ist für den gewählten Zeitraum bereits gebucht",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: "Fehler",
        description: "Verfügbarkeit konnte nicht überprüft werden",
        variant: "destructive",
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => isSameDay(date, blockedDate));
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate) + 1;
  };

  const totalPrice = calculateDays() * (camper?.price || 0);

  if (!camper) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wohnmobil nicht gefunden</h1>
          <Link to="/">
            <Button className="mt-4">Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <img
              src={camper.images[0]}
              alt={camper.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              {camper.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${camper.name} ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{camper.price}€</CardTitle>
                  <p className="text-sm text-muted-foreground">pro Tag</p>
                </div>
                {!camper.available && (
                  <Badge variant="destructive">Nicht verfügbar</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="font-medium">{camper.rating}</span>
                <span className="text-muted-foreground">
                  ({camper.reviewCount} Bewertungen)
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Standort:</span>
                  <span className="text-sm font-medium">{camper.location}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Date Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reisezeitraum wählen</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Anreise</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd.MM.yyyy") : <span>Datum wählen</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => 
                            date < new Date() || isDateBlocked(date)
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Abreise</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd.MM.yyyy") : <span>Datum wählen</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => 
                            date < new Date() || 
                            (startDate && date <= startDate) ||
                            isDateBlocked(date)
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {startDate && endDate && (
                  <div className="space-y-2">
                    <Button 
                      onClick={checkAvailability}
                      disabled={isCheckingAvailability}
                      className="w-full"
                      variant="outline"
                    >
                      {isCheckingAvailability ? "Prüfe Verfügbarkeit..." : "Verfügbarkeit prüfen"}
                    </Button>
                    
                    {availabilityStatus === 'available' && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ✅ Verfügbar für {calculateDays()} Tag{calculateDays() > 1 ? 'e' : ''} 
                          (Gesamt: {totalPrice}€)
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {availabilityStatus === 'unavailable' && (
                      <Alert className="border-red-200 bg-red-50" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          ❌ Nicht verfügbar für den gewählten Zeitraum
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <Link 
                to={`/booking/${camper.id}?start=${startDate ? format(startDate, 'yyyy-MM-dd') : ''}&end=${endDate ? format(endDate, 'yyyy-MM-dd') : ''}`} 
                className="w-full block"
              >
                <Button 
                  className="w-full" 
                  disabled={
                    !camper.available || 
                    !startDate || 
                    !endDate || 
                    availabilityStatus !== 'available'
                  }
                >
                  {!startDate || !endDate 
                    ? "Reisezeitraum wählen" 
                    : availabilityStatus !== 'available' 
                    ? "Verfügbarkeit prüfen" 
                    : `Jetzt buchen (${totalPrice}€)`
                  }
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Description & Features */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">{camper.name}</h2>
            <p className="text-lg text-muted-foreground mb-2">
              {camper.brand} {camper.model} ({camper.year})
            </p>
            <p className="text-foreground">{camper.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Ausstattung & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {camper.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Technische Daten</h3>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Länge</p>
                    <p className="font-medium">{camper.specifications.length}m</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Schlafplätze</p>
                    <p className="font-medium">{camper.specifications.sleeps}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kraftstoff</p>
                    <p className="font-medium">{camper.specifications.fuel}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Getriebe</p>
                    <p className="font-medium">{camper.specifications.transmission}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Breite:</span>
                  <span className="text-sm font-medium">{camper.specifications.width}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Höhe:</span>
                  <span className="text-sm font-medium">{camper.specifications.height}m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CamperDetails;