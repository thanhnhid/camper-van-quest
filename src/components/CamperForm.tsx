import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const camperSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  price_per_day: z.number().min(1, "Preis muss größer als 0 sein"),
  location: z.string().min(1, "Standort ist erforderlich"),
  capacity: z.number().min(1, "Kapazität muss mindestens 1 Person sein"),
  beds: z.number().min(1, "Anzahl Betten ist erforderlich"),
  drivers_license: z.string().min(1, "Führerscheinklasse ist erforderlich"),
  fuel_consumption: z.string().min(1, "Kraftstoffverbrauch ist erforderlich"),
  engine_power: z.string().min(1, "Motorleistung ist erforderlich"),
  drive_type: z.string().min(1, "Antriebsart ist erforderlich"),
  emission_class: z.string().min(1, "Schadstoffklasse ist erforderlich"),
  dimensions_length: z.number().min(0, "Länge muss 0 oder höher sein"),
  dimensions_width: z.number().min(0, "Breite muss 0 oder höher sein"),
  dimensions_height: z.number().min(0, "Höhe muss 0 oder höher sein"),
  trailer_coupling: z.boolean().default(false),
  empty_weight: z.number().min(0, "Leergewicht muss 0 oder höher sein"),
  max_weight: z.number().min(0, "Gesamtgewicht muss 0 oder höher sein"),
  payload: z.number().min(0, "Zuladung muss 0 oder höher sein"),
  features: z.array(z.string()).optional().default([]),
  gas_type: z.string().optional(),
  insurance_included: z.boolean().default(false),
  security_deposit: z.number().min(0, "Kaution muss 0 oder höher sein").default(0),
  cleaning_fee: z.number().min(0, "Reinigungsgebühr muss 0 oder höher sein").default(0),
  cancellation_fee: z.number().min(0, "Stornogebühr muss 0 oder höher sein").default(0),
  additional_offers: z.array(z.string()).default([]),
});

type CamperFormData = z.infer<typeof camperSchema>;

interface CamperFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingCamper?: any;
}

const driveTypes = [
  "Frontantrieb", "Heckantrieb", "Allradantrieb", "4x4"
];

const emissionClasses = [
  "Euro 6", "Euro 5", "Euro 4", "Euro 3", "Euro 2", "Euro 1"
];

const licenseTypes = [
  "B", "C1", "C", "BE", "C1E", "CE"
];

const availableFeatures = [
  "Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "TV", "WiFi", 
  "Markise", "Fahrräder", "Sat-Anlage", "Solar", "Generator", "Kühlschrank", "Gefrierfach"
];

const gasTypes = [
  "Propan", "Butan", "Propan/Butan Mix", "Kein Gas"
];

const additionalOffers = [
  "Fahrradträger", "Zelt", "Bettwäsche", "Handtücher", "Campingmöbel", 
  "Grill", "Kühlbox", "Stromkabel", "Wasserschlauch", "Toilettenpapier",
  "Erste-Hilfe-Set", "Werkzeugkoffer", "Navigationssystem", "Kindersitz"
];

export function CamperForm({ onSuccess, onCancel, editingCamper }: CamperFormProps) {
  const { profile } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(editingCamper?.features || []);
  const [selectedOffers, setSelectedOffers] = useState<string[]>(editingCamper?.additional_offers || []);
  const [loading, setLoading] = useState(false);

  const form = useForm<CamperFormData>({
    resolver: zodResolver(camperSchema),
    defaultValues: {
      name: editingCamper?.name || "",
      description: editingCamper?.description || "",
      price_per_day: editingCamper?.price_per_day || 0,
      location: editingCamper?.location || "",
      capacity: editingCamper?.capacity || 1,
      beds: editingCamper?.beds || 1,
      drivers_license: editingCamper?.drivers_license || "",
      fuel_consumption: editingCamper?.fuel_consumption || "",
      engine_power: editingCamper?.engine_power || "",
      drive_type: editingCamper?.drive_type || "",
      emission_class: editingCamper?.emission_class || "",
      dimensions_length: editingCamper?.dimensions_length || 0,
      dimensions_width: editingCamper?.dimensions_width || 0,
      dimensions_height: editingCamper?.dimensions_height || 0,
      trailer_coupling: editingCamper?.trailer_coupling || false,
      empty_weight: editingCamper?.empty_weight || 0,
      max_weight: editingCamper?.max_weight || 0,
      payload: editingCamper?.payload || 0,
      features: editingCamper?.features || [],
      gas_type: editingCamper?.gas_type || "",
      insurance_included: editingCamper?.insurance_included || false,
      security_deposit: editingCamper?.security_deposit || 0,
      cleaning_fee: editingCamper?.cleaning_fee || 0,
      cancellation_fee: editingCamper?.cancellation_fee || 0,
      additional_offers: editingCamper?.additional_offers || [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error("Maximal 5 Bilder erlaubt");
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async (camperId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${camperId}-${Date.now()}-${i}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('camper-images')
        .upload(fileName, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('camper-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }
    
    return imageUrls;
  };

  const onSubmit = async (data: CamperFormData) => {
    if (!profile) {
      toast.error("Kein Profil gefunden");
      return;
    }


    console.log('Starting camper submission...');
    console.log('Profile:', profile);
    console.log('Form data:', data);
    console.log('Selected features:', selectedFeatures);
    console.log('Selected files:', selectedFiles.length);

    setLoading(true);
    try {
      let imageUrls: string[] = editingCamper?.images || [];
      
      // Upload new images if any selected
      if (selectedFiles.length > 0) {
        console.log('Uploading images...');
        const tempId = editingCamper?.id || (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()));
        const newImageUrls = await uploadImages(tempId);
        console.log('Uploaded image URLs:', newImageUrls);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const camperData = {
        name: data.name,
        description: data.description,
        price_per_day: data.price_per_day,
        location: data.location,
        capacity: data.capacity,
        beds: data.beds,
        drivers_license: data.drivers_license,
        fuel_consumption: data.fuel_consumption,
        engine_power: data.engine_power,
        drive_type: data.drive_type,
        emission_class: data.emission_class,
        dimensions_length: data.dimensions_length,
        dimensions_width: data.dimensions_width,
        dimensions_height: data.dimensions_height,
        trailer_coupling: data.trailer_coupling,
        empty_weight: data.empty_weight,
        max_weight: data.max_weight,
        payload: data.payload,
        features: selectedFeatures,
        images: imageUrls,
        provider_id: profile.id,
        status: 'approved', // Camper wird direkt genehmigt
        gas_type: data.gas_type,
        insurance_included: data.insurance_included,
        security_deposit: data.security_deposit,
        cleaning_fee: data.cleaning_fee,
        cancellation_fee: data.cancellation_fee,
        additional_offers: selectedOffers
      };

      console.log('Submitting camper data:', camperData);

      if (editingCamper) {
        console.log('Updating existing camper...');
        const { error } = await supabase
          .from('campers')
          .update(camperData)
          .eq('id', editingCamper.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Camper updated successfully');
        toast.success("Camper wurde erfolgreich aktualisiert und ist jetzt verfügbar");
      } else {
        console.log('Inserting new camper...');
        const { data: insertedData, error } = await supabase
          .from('campers')
          .insert([camperData])
          .select('*');

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Camper inserted successfully:', insertedData);
        toast.success("Camper wurde erfolgreich veröffentlicht und ist sofort verfügbar");
      }

      // Kurz warten um sicherzustellen, dass die Daten gespeichert sind
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess();
    } catch (error) {
      console.error('Error saving camper:', error);
      toast.error("Fehler beim Speichern des Campers: " + (error as any)?.message);
    } finally {
      setLoading(false);
    }  
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleOfferToggle = (offer: string) => {
    setSelectedOffers(prev => 
      prev.includes(offer) 
        ? prev.filter(o => o !== offer)
        : [...prev, offer]
    );
  };

  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name des Campers</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Hymer B-Klasse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beschreibung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detaillierte Beschreibung des Campers..."
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price_per_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preis pro Tag (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schlafplätze</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standort</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. München, Deutschland" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Motorhome Specifications */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Fahrzeug-Spezifikationen</h3>
            
            {/* Beds and License */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anzahl Betten</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drivers_license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Führerscheinklasse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Führerscheinklasse auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {licenseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            Klasse {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fuel_consumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kraftstoffverbrauch (L/100km)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. 8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engine_power"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorleistung (PS/kW)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. 150 PS / 110 kW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="drive_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antriebsart</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Antriebsart auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {driveTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emission_class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schadstoffklasse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Schadstoffklasse auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {emissionClasses.map((classType) => (
                          <SelectItem key={classType} value={classType}>
                            {classType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dimensions */}
            <div>
              <h4 className="text-md font-medium mb-3">Abmessungen (m)</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dimensions_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Länge</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0" 
                          placeholder="z.B. 7.5"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions_width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breite</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0" 
                          placeholder="z.B. 2.3"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions_height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Höhe</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0" 
                          placeholder="z.B. 3.2"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Weights */}
            <div>
              <h4 className="text-md font-medium mb-3">Gewichte (kg)</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="empty_weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leergewicht</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="z.B. 3500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gesamtgewicht</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="z.B. 4000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zuladung</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="z.B. 500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Trailer Coupling */}
            <FormField
              control={form.control}
              name="trailer_coupling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Anhängerkupplung vorhanden
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Fahrzeug verfügt über eine Anhängerkupplung
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Gas Type */}
          <FormField
            control={form.control}
            name="gas_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gasart</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Gasart auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {gasTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance */}
          <FormField
            control={form.control}
            name="insurance_included"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Versicherung inklusive
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Versicherung ist im Grundpreis enthalten
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Costs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="security_deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kaution (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cleaning_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endreinigung (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cancellation_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stornogebühr (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Ausstattung</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {selectedFeatures.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Mindestens ein Feature ist erforderlich</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Zusätzliche Angebote</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {additionalOffers.map((offer) => (
                <div key={offer} className="flex items-center space-x-2">
                  <Checkbox
                    id={offer}
                    checked={selectedOffers.includes(offer)}
                    onCheckedChange={() => handleOfferToggle(offer)}
                  />
                  <Label htmlFor={offer} className="text-sm">
                    {offer}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="images" className="text-sm font-medium">
              Bilder (max. 5)
            </Label>
            <div className="mt-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Klicken Sie hier, um Bilder hochzuladen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFiles.length === 0 && !editingCamper?.images?.length && "Mindestens ein Bild ist erforderlich"}
                  </p>
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Speichern..." : (editingCamper ? "Aktualisieren" : "Camper veröffentlichen")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}