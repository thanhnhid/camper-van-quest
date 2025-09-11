import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const HeroSearch = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [persons, setPersons] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to campers page with search params
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    if (persons) params.append("persons", persons);
    
    navigate(`/campers?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white/95 backdrop-blur shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Ort / Region
          </Label>
          <Input
            id="location"
            placeholder="z.B. München, Bayern"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Abholung
          </Label>
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
                {startDate ? format(startDate, "dd.MM.yyyy", { locale: de }) : "Startdatum"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Rückgabe
          </Label>
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
                {endDate ? format(endDate, "dd.MM.yyyy", { locale: de }) : "Enddatum"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Persons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Personen
          </Label>
          <Select value={persons} onValueChange={setPersons}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Anzahl" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 Personen</SelectItem>
              <SelectItem value="3">3 Personen</SelectItem>
              <SelectItem value="4">4 Personen</SelectItem>
              <SelectItem value="5">5 Personen</SelectItem>
              <SelectItem value="6">6+ Personen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-3 text-lg font-semibold"
          size="lg"
        >
          <Search className="mr-2 h-5 w-5" />
          Jetzt Wohnmobil finden
        </Button>
      </div>
    </Card>
  );
};

export default HeroSearch;