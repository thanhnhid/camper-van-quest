import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CamperCard from "@/components/CamperCard";
import { mockCampers } from "@/data/campers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

const Campers = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const availableFeatures = ["Küche", "Dusche", "Klimaanlage", "Markise", "Fahrradträger", "Solarpanel"];

  const filteredCampers = useMemo(() => {
    return mockCampers.filter(camper => {
      // Price filter
      if (camper.price < priceRange[0] || camper.price > priceRange[1]) return false;
      
      // Location filter
      if (locationFilter && !camper.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      
      // Beds filter
      if (minBeds && camper.specifications.sleeps < parseInt(minBeds)) return false;
      if (maxBeds && camper.specifications.sleeps > parseInt(maxBeds)) return false;
      
      // Fuel type filter
      if (fuelType && camper.specifications.fuel !== fuelType) return false;
      
      // Features filter
      if (features.length > 0) {
        const hasAllFeatures = features.every(feature => 
          camper.features.some(camperFeature => 
            camperFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) return false;
      }
      
      return true;
    });
  }, [priceRange, locationFilter, minBeds, maxBeds, fuelType, features]);

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setFeatures(prev => [...prev, feature]);
    } else {
      setFeatures(prev => prev.filter(f => f !== feature));
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 200]);
    setLocationFilter("");
    setMinBeds("");
    setMaxBeds("");
    setFuelType("");
    setFeatures([]);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wohnmobile ({filteredCampers.length})</h1>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filter</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Zurücksetzen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preisbereich (€/Tag)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1]}€</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location-filter">Standort</Label>
                <Input
                  id="location-filter"
                  placeholder="Stadt oder Region"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              {/* Beds */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="min-beds">Min. Betten</Label>
                  <Select value={minBeds} onValueChange={setMinBeds}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-beds">Max. Betten</Label>
                  <Select value={maxBeds} onValueChange={setMaxBeds}>
                    <SelectTrigger>
                      <SelectValue placeholder="Max" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label>Antriebsart</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Antriebe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Benzin">Benzin</SelectItem>
                    <SelectItem value="Elektro">Elektro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Ausstattung</Label>
                <div className="space-y-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={features.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                      />
                      <Label htmlFor={feature} className="text-sm cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campers Grid */}
        <div className="flex-1">
          {filteredCampers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                Keine Wohnmobile gefunden, die Ihren Suchkriterien entsprechen.
              </p>
              <Button onClick={clearAllFilters} variant="outline">
                Filter zurücksetzen
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampers.map((camper) => (
                <CamperCard key={camper.id} camper={camper} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campers;