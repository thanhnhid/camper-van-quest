import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, Mail } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Häufig gestellte Fragen (FAQ)</h1>
            <p className="text-lg text-muted-foreground">
              Hier finden Sie Antworten auf die am häufigsten gestellten Fragen zu CamperQuest.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Wie funktioniert die Buchung eines Wohnmobils?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Die Buchung ist ganz einfach: Wählen Sie Ihr gewünschtes Wohnmobil aus, geben Sie Ihre Reisedaten ein und folgen Sie dem Buchungsprozess. Nach der Bestätigung erhalten Sie alle wichtigen Informationen per E-Mail.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Welche Dokumente benötige ich für die Anmietung?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sie benötigen einen gültigen Führerschein (je nach Fahrzeug), einen Personalausweis oder Reisepass und eine Kreditkarte für die Kaution. Spezifische Anforderungen finden Sie in der jeweiligen Fahrzeugbeschreibung.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Wie hoch ist die Kaution und wann wird sie zurückerstattet?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Die Kaution variiert je nach Fahrzeug und wird bei der Übergabe auf Ihrer Kreditkarte blockiert. Sie wird in der Regel innerhalb von 7-14 Werktagen nach der ordnungsgemäßen Rückgabe freigegeben.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Ist eine Versicherung im Mietpreis enthalten?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Bei vielen unserer Fahrzeuge ist eine Grundversicherung bereits enthalten. Details zur Versicherungsabdeckung finden Sie in der jeweiligen Fahrzeugbeschreibung. Zusätzliche Versicherungsoptionen können oft hinzugebucht werden.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Kann ich meine Buchung stornieren oder ändern?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Ja, Buchungen können in der Regel bis zu einem bestimmten Zeitpunkt vor der Abholung storniert oder geändert werden. Die genauen Stornierungsbedingungen finden Sie in Ihren Buchungsdetails und unseren AGB.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    Was ist bei der Übergabe und Rückgabe zu beachten?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Bei der Übergabe führen wir gemeinsam eine Fahrzeugkontrolle durch und erklären Ihnen alle wichtigen Funktionen. Bei der Rückgabe sollte das Fahrzeug im gleichen Zustand und mit dem vereinbarten Kraftstoffstand zurückgegeben werden.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">
                    Sind Haustiere in den Wohnmobilen erlaubt?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Das hängt vom jeweiligen Vermieter ab. Schauen Sie in der Fahrzeugbeschreibung nach oder kontaktieren Sie uns direkt. Wenn Haustiere erlaubt sind, kann eine zusätzliche Reinigungsgebühr anfallen.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">
                    Was passiert bei einem Defekt oder Unfall während der Reise?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Bei technischen Problemen oder Unfällen kontaktieren Sie bitte umgehend unsere 24/7-Hotline. Wir helfen Ihnen schnell weiter und organisieren bei Bedarf Ersatz oder Reparaturen.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-left">
                    Kann ich zusätzliche Ausstattung dazubuchen?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Ja, viele Vermieter bieten zusätzliche Ausstattung wie Fahrradträger, Campingstühle, Bettwäsche oder Navigationsgeräte an. Diese können Sie während des Buchungsprozesses oder direkt beim Vermieter anfragen.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-left">
                    Wie funktioniert das Bewertungssystem?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Nach Ihrer Reise können Sie das Fahrzeug und den Service bewerten. Diese Bewertungen helfen anderen Kunden bei der Auswahl und tragen zur Qualitätssicherung bei. Gleichzeitig können auch Vermieter Gäste bewerten.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ihre Frage war nicht dabei?</h2>
            <p className="text-muted-foreground mb-6">
              Kein Problem! Kontaktieren Sie uns gerne direkt - wir helfen Ihnen gerne weiter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+49 (0) 30 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@camperquest.de</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;