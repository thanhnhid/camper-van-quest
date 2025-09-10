import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Users, MapPin, Fuel, Settings, Ruler } from "lucide-react";
import { mockCampers } from "@/data/campers";

const CamperDetails = () => {
  const { id } = useParams<{ id: string }>();
  const camper = mockCampers.find(c => c.id === id);

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
              
              <Link to={`/booking/${camper.id}`} className="w-full block">
                <Button className="w-full" disabled={!camper.available}>
                  {camper.available ? "Jetzt buchen" : "Nicht verfügbar"}
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