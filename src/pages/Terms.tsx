import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, FileText, Shield, Clock, Euro, Lock, Users, AlertTriangle, Gavel, Phone } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ScrollText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Allgemeine Geschäftsbedingungen</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparente Bedingungen für Ihre Wohnmobil-Miete bei CamperQuest GmbH
          </p>
          <Badge variant="secondary" className="mt-4">
            Gültig ab: 01.01.2024
          </Badge>
        </div>

        {/* Important Info Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary mb-2">Wichtige Informationen</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Kaution:</strong> 500 € (wird bei Fahrzeugübergabe blockiert)</p>
                  <p><strong>Mindestalter:</strong> 21 Jahre, Führerschein seit mind. 2 Jahren</p>
                  <p><strong>Stornierung:</strong> Bis 7 Tage vor Reiseantritt kostenlos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="scope" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">1. Geltungsbereich</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der CamperQuest GmbH (nachfolgend "Vermieter") und dem Mieter über die Vermietung von Wohnmobilen und Campingfahrzeugen.
              </p>
              <p>
                Abweichende Bedingungen des Mieters werden nicht anerkannt, es sei denn, der Vermieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contract" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">2. Vertragsschluss</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p>Der Mietvertrag kommt durch die Bestätigung der Buchung durch CamperQuest zustande.</p>
                <p><strong>Voraussetzungen für die Anmietung:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mindestalter: 21 Jahre</li>
                  <li>Gültiger Führerschein seit mindestens 2 Jahren</li>
                  <li>Gültige Kreditkarte für die Kaution</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rental-object" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">3. Mietgegenstand</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <p className="mb-4">
                Vermietet werden Wohnmobile verschiedener Kategorien inklusive Grundausstattung (Geschirr, Bettwäsche auf Wunsch, technische Ausstattung).
              </p>
              <p>
                Das Fahrzeug wird in technisch einwandfreiem und gereinigtem Zustand übergeben. Eventuelle Mängel sind bei der Übergabe schriftlich festzuhalten.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rental-period" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">4. Mietdauer und Übergabe</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p><strong>Übergabezeiten:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Abholung: Montag bis Samstag 09:00 - 18:00 Uhr</li>
                  <li>Rückgabe: Montag bis Samstag 08:00 - 17:00 Uhr</li>
                  <li>Sonntags nach Vereinbarung (ggf. Aufpreis)</li>
                </ul>
                <p>Bei verspäteter Rückgabe werden zusätzliche Tagessätze berechnet.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price-payment" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Euro className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">5. Mietpreis und Zahlung</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p><strong>Zahlungsmodalitäten:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>20% Anzahlung bei Buchungsbestätigung</li>
                  <li>Restbetrag bei Fahrzeugübergabe</li>
                  <li>Kaution: <strong className="text-primary">500 €</strong> (Kreditkartenblockierung)</li>
                </ul>
                <p>Zusatzleistungen werden separat berechnet und sind bei Abholung fällig.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deposit" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">6. Kaution</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <p className="font-semibold text-primary">Kautionshöhe: 500 €</p>
              </div>
              <p className="mb-3">
                Die Kaution wird bei Fahrzeugübergabe auf der Kreditkarte des Mieters blockiert und nach ordnungsgemäßer Rückgabe innerhalb von 14 Tagen freigegeben.
              </p>
              <p>
                Eventuelle Schäden, Reinigungskosten oder sonstige Forderungen werden von der Kaution abgezogen.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cancellation" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">7. Stornierung</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p><strong>Stornierungsfristen und -kosten:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Bis 7 Tage vor Mietbeginn: kostenfrei</li>
                  <li>6-3 Tage vor Mietbeginn: 50% der Miete</li>
                  <li>Weniger als 3 Tage: 80% der Miete</li>
                  <li>No-Show: 100% der Miete</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contact" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">8. Kontakt & Rechtliches</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">CamperQuest GmbH</p>
                  <p>Alexanderplatz 1<br />10178 Berlin</p>
                  <p>Telefon: +49 (0) 30 123 456 789<br />E-Mail: info@camperquest.de</p>
                </div>
                <div>
                  <p><strong>Anwendbares Recht:</strong> Es gilt deutsches Recht.</p>
                  <p><strong>Gerichtsstand:</strong> Berlin</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Support */}
        <Card className="mt-12 border-primary/20">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fragen zu den AGB?</h3>
            <p className="text-muted-foreground mb-4">
              Unser Kundenservice hilft Ihnen gerne weiter.
            </p>
            <div className="space-y-2">
              <p className="font-medium">+49 (0) 30 123 456 789</p>
              <p className="text-muted-foreground">Mo-Fr: 08:00 - 20:00 Uhr</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;