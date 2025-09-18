import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
});

type CamperFormData = z.infer<typeof camperSchema>;

interface CamperFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingCamper?: any;
}

const availableFeatures = [
  "Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "TV", "WiFi", 
  "Markise", "Fahrräder", "Sat-Anlage", "Solar", "Generator", "Kühlschrank", "Gefrierfach"
];

export function CamperForm({ onSuccess, onCancel, editingCamper }: CamperFormProps) {
  const { profile } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(editingCamper?.features || []);
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

    if (selectedFeatures.length === 0) {
      toast.error("Mindestens ein Feature ist erforderlich");
      return;
    }

    if (selectedFiles.length === 0 && !editingCamper?.images?.length) {
      toast.error("Mindestens ein Bild ist erforderlich");
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
        const tempId = editingCamper?.id || Date.now().toString();
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
        features: selectedFeatures,
        images: imageUrls,
        provider_id: profile.id,
        status: 'approved' // Camper wird direkt genehmigt
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