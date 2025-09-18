import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, MapPin } from "lucide-react";
import { Camper } from "@/data/campers";

interface CamperCardProps {
  camper: Camper;
}

const CamperCard = ({ camper }: CamperCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={camper.images[0]}
          alt={camper.name}
          className="h-48 w-full object-cover"
        />
        {!camper.available && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            Nicht verfügbar
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{camper.name}</h3>
        <p className="text-sm text-muted-foreground">
          {camper.brand} {camper.model} ({camper.year})
        </p>
        
        <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {camper.specifications.sleeps} Personen
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {camper.location}
          </div>
        </div>
        
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
            <span className="text-sm font-medium">{camper.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({camper.reviewCount} Bewertungen)
          </span>
        </div>
        
        <div className="mt-3">
          <span className="text-2xl font-bold">{camper.price}€</span>
          <span className="text-sm text-muted-foreground"> / Tag</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/camper/${camper.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={!camper.available}
            onClick={() => console.log('Navigating to camper details:', camper.id)}
          >
            {camper.available ? "Details ansehen" : "Nicht verfügbar"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CamperCard;