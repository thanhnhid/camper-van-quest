import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CamperCard from "@/components/CamperCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter, X, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Camper {
  id: string;
  name: string;
  description: string | null;
  price_per_day: number;
  location: string;
  capacity: number;
  features: string[];
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const Campers = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const availableFeatures = ["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "TV", "WiFi", 
    "Markise", "Fahrräder", "Sat-Anlage", "Solar", "Generator", "Kühlschrank", "Gefrierfach"];

  useEffect(() => {
    fetchCampers();
    
    // Refresh campers when window gets focus (e.g., returning from another tab)
    const handleFocus = () => fetchCampers();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchCampers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampers(data || []);
    } catch (error) {
      console.error('Error fetching campers:', error);
      toast({
        title: "Fehler",
        description: "Wohnmobile konnten nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCampers = useMemo(() => {
    return campers.filter(camper => {
      // Price filter
      if (camper.price_per_day < priceRange[0] || camper.price_per_day > priceRange[1]) return false;
      
      // Location filter
      if (locationFilter && !camper.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      
      // Capacity filter
      if (minCapacity && camper.capacity < parseInt(minCapacity)) return false;
      if (maxCapacity && camper.capacity > parseInt(maxCapacity)) return false;
      
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
  }, [campers, priceRange, locationFilter, minCapacity, maxCapacity, features]);

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
    setMinCapacity("");
    setMaxCapacity("");
    setFeatures([]);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Lade Wohnmobile...</div>
      </div>
    );
  }

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

              {/* Capacity */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="min-capacity">Min. Personen</Label>
                  <Select value={minCapacity} onValueChange={setMinCapacity}>
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
                  <Label htmlFor="max-capacity">Max. Personen</Label>
                  <Select value={maxCapacity} onValueChange={setMaxCapacity}>
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
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {campers.length === 0 
                  ? "Noch keine Wohnmobile verfügbar."
                  : "Keine Wohnmobile gefunden, die Ihren Suchkriterien entsprechen."
                }
              </p>
              {campers.length > 0 && (
                <Button onClick={clearAllFilters} variant="outline">
                  Filter zurücksetzen
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampers.map((camper) => (
                <CamperCard 
                  key={camper.id} 
                  camper={{
                    id: camper.id,
                    name: camper.name,
                    description: camper.description || "",
                    brand: "Unbekannt",
                    model: "",
                    year: new Date().getFullYear(),
                    price: camper.price_per_day,
                    location: camper.location,
                    images: camper.images.length > 0 ? camper.images : ["/placeholder.svg"],
                    rating: 4.5,
                    reviewCount: 0,
                    available: true,
                    features: camper.features,
                    specifications: {
                      sleeps: camper.capacity,
                      length: 6.5,
                      width: 2.3,
                      height: 2.8,
                      fuel: "Diesel",
                      transmission: "Manuell"
                    }
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campers;