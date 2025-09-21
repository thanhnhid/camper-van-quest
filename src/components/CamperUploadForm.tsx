import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  features: z.array(z.string()).min(1, "Mindestens ein Feature ist erforderlich"),
  gas_type: z.string().optional(),
  insurance_included: z.boolean().default(false),
  security_deposit: z.number().min(0, "Kaution muss 0 oder höher sein").default(0),
  cleaning_fee: z.number().min(0, "Reinigungsgebühr muss 0 oder höher sein").default(0),
  cancellation_fee: z.number().min(0, "Stornogebühr muss 0 oder höher sein").default(0),
  additional_offers: z.array(z.string()).default([]),
});

type CamperFormData = z.infer<typeof camperSchema>;

interface CamperUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingCamper?: any;
}

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

export function CamperUploadForm({ open, onOpenChange, onSuccess, editingCamper }: CamperUploadFormProps) {
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
      const fileName = `${camperId}/${Date.now()}-${i}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('camper-images')
        .upload(fileName, file);

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

    setLoading(true);
    try {
      let imageUrls: string[] = editingCamper?.images || [];
      
      // Upload new images if any selected
      if (selectedFiles.length > 0) {
        const tempId = editingCamper?.id || Date.now().toString();
        const newImageUrls = await uploadImages(tempId);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const camperData = {
        name: data.name,
        description: data.description,
        price_per_day: data.price_per_day,
        location: data.location,
        capacity: data.capacity,
        features: selectedFeatures,
        images: imageUrls,
        provider_id: profile.id,
        status: 'pending',
        gas_type: data.gas_type,
        insurance_included: data.insurance_included,
        security_deposit: data.security_deposit,
        cleaning_fee: data.cleaning_fee,
        cancellation_fee: data.cancellation_fee,
        additional_offers: selectedOffers
      };

      if (editingCamper) {
        const { error } = await supabase
          .from('campers')
          .update(camperData)
          .eq('id', editingCamper.id);

        if (error) throw error;
        toast.success("Camper wurde zur Prüfung aktualisiert");
      } else {
        const { error } = await supabase
          .from('campers')
          .insert([camperData]);

        if (error) throw error;
        toast.success("Camper wurde zur Prüfung eingereicht");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
      setSelectedFiles([]);
      setSelectedFeatures([]);
      setSelectedOffers([]);
    } catch (error) {
      console.error('Error saving camper:', error);
      toast.error("Fehler beim Speichern des Campers");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCamper ? "Camper bearbeiten" : "Neuen Camper hinzufügen"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Klicken Sie hier, um Bilder hochzuladen
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
                <div className="grid grid-cols-3 gap-2 mt-2">
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Speichern..." : (editingCamper ? "Aktualisieren" : "Camper einreichen")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}