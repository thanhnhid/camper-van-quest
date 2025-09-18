import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function TermsDialog({ open, onOpenChange, onAccept }: TermsDialogProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      toast.error("Sie müssen die Geschäftsbedingungen akzeptieren");
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            terms_accepted: true, 
            terms_accepted_at: new Date().toISOString() 
          })
          .eq('id', profile.id);

        if (error) throw error;

        toast.success("Geschäftsbedingungen akzeptiert");
        onAccept();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast.error("Fehler beim Akzeptieren der Bedingungen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Geschäftsbedingungen für Anbieter</DialogTitle>
          <DialogDescription>
            Bitte lesen und akzeptieren Sie die Geschäftsbedingungen, um Camper hochladen zu können.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div className="text-sm space-y-4">
            <h3 className="font-semibold">1. Allgemeine Bestimmungen</h3>
            <p>
              Als Anbieter auf unserer Plattform verpflichten Sie sich, nur eigene oder ordnungsgemäß 
              lizenzierte Camper anzubieten. Sie garantieren, dass alle Angaben zu Ihren Fahrzeugen 
              wahrheitsgemäß und vollständig sind.
            </p>
            
            <h3 className="font-semibold">2. Fahrzeugqualität und Sicherheit</h3>
            <p>
              Alle angebotenen Camper müssen verkehrssicher und in einwandfreiem Zustand sein. 
              Sie sind verpflichtet, regelmäßige Wartungen durchzuführen und entsprechende 
              Nachweise auf Verlangen vorzulegen.
            </p>
            
            <h3 className="font-semibold">3. Haftung und Versicherung</h3>
            <p>
              Sie stellen sicher, dass für alle angebotenen Fahrzeuge eine gültige 
              Haftpflichtversicherung sowie eine angemessene Kaskoversicherung besteht.
            </p>
            
            <h3 className="font-semibold">4. Prüfung durch Administration</h3>
            <p>
              Alle Camper-Einstellungen, Änderungen und Löschungen unterliegen einer 
              administrativen Prüfung vor Veröffentlichung. Die Administration behält 
              sich das Recht vor, Angebote ohne Angabe von Gründen abzulehnen.
            </p>
            
            <h3 className="font-semibold">5. Provisionen und Zahlungen</h3>
            <p>
              Für erfolgreich vermittelte Buchungen wird eine Provision von 10% des 
              Buchungswertes erhoben. Die Auszahlung erfolgt monatlich nach Abzug 
              der Provision.
            </p>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
          />
          <label 
            htmlFor="terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ich akzeptiere die Geschäftsbedingungen
          </label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!accepted || loading}
          >
            {loading ? "Verarbeitung..." : "Akzeptieren"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}