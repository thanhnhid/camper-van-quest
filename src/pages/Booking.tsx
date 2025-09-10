import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const camper = mockCampers.find(c => c.id === id);
  
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    insurance: "basic",
    finalCleaning: false,
    deposit: true
  });

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

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const selectedInsurance = insuranceOptions.find(ins => ins.id === bookingData.insurance);
  
  const costs = {
    camper: days * camper.price,
    insurance: days * (selectedInsurance?.price || 0),
    finalCleaning: bookingData.finalCleaning ? 75 : 0,
    deposit: 500
  };
  
  const totalCost = costs.camper + costs.insurance + costs.finalCleaning;

  const handleBooking = () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie Start- und Enddatum aus.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Buchung erfolgreich!",
      description: `Ihre Buchung für ${camper.name} wurde erfolgreich abgeschickt.`
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Buchung für {camper.name}</h1>
        <p className="text-muted-foreground">
          {camper.brand} {camper.model} ({camper.year}) - {camper.location}
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
              
              <Button onClick={handleBooking} className="w-full" disabled={days === 0}>
                {days === 0 ? "Datum wählen" : "Kostenpflichtig buchen"}
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