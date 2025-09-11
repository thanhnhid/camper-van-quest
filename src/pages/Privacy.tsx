import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Eye, FileText, Mail, Phone, User, Settings, AlertTriangle, CheckCircle } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Datenschutzerklärung</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparente Information über die Verarbeitung Ihrer personenbezogenen Daten
          </p>
          <Badge variant="secondary" className="mt-4">
            Letzte Aktualisierung: 01.01.2024
          </Badge>
        </div>

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">SSL-Verschlüsselung</h3>
              <p className="text-sm text-muted-foreground">Alle Datenübertragungen sind verschlüsselt</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Datenminimierung</h3>
              <p className="text-sm text-muted-foreground">Wir erheben nur notwendige Daten</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">DSGVO-konform</h3>
              <p className="text-sm text-muted-foreground">Vollständige Compliance mit EU-Recht</p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="controller" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">1. Verantwortlicher</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p><strong>Verantwortliche Stelle im Sinne der DSGVO:</strong></p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold">CamperQuest GmbH</p>
                  <p>Alexanderplatz 1<br />10178 Berlin, Deutschland</p>
                  <p>Telefon: +49 (0) 30 123 456 789<br />E-Mail: datenschutz@camperquest.de</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-types" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">2. Verarbeitete Datenarten</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-muted rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-muted p-3 text-left font-semibold">Datenkategorie</th>
                      <th className="border border-muted p-3 text-left font-semibold">Beispiele</th>
                      <th className="border border-muted p-3 text-left font-semibold">Zweck</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-muted p-3 font-medium">Kontaktdaten</td>
                      <td className="border border-muted p-3">Name, E-Mail, Telefon</td>
                      <td className="border border-muted p-3">Buchungsabwicklung, Kommunikation</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3 font-medium">Vertragsdaten</td>
                      <td className="border border-muted p-3">Buchungsdetails, Zahlungsinformationen</td>
                      <td className="border border-muted p-3">Vertragserfüllung</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3 font-medium">Nutzungsdaten</td>
                      <td className="border border-muted p-3">IP-Adresse, Browser, Cookies</td>
                      <td className="border border-muted p-3">Website-Funktionalität</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="legal-basis" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">3. Rechtsgrundlagen</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <p><strong>Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung (Buchungsabwicklung)</li>
                  <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (Newsletter, Marketing)</li>
                  <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen (Website-Analyse)</li>
                  <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Rechtliche Verpflichtung (Steuerrecht)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storage" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">4. Speicherdauer</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Vertragsdaten:</strong> 10 Jahre (steuerrechtliche Aufbewahrungspflicht)</li>
                  <li><strong>Kontaktdaten:</strong> Bis zum Widerruf oder Vertragsende</li>
                  <li><strong>Website-Logs:</strong> 7 Tage automatische Löschung</li>
                  <li><strong>Cookies:</strong> Je nach Cookie-Typ (siehe Cookie-Einstellungen)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rights" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">5. Ihre Rechte</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-primary">Informationsrechte:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Auskunft über Ihre Daten</li>
                    <li>• Berichtigung falscher Daten</li>
                    <li>• Löschung Ihrer Daten</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-primary">Kontrollrechte:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Einschränkung der Verarbeitung</li>
                    <li>• Datenübertragbarkeit</li>
                    <li>• Widerspruch gegen Verarbeitung</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm"><strong>Kontakt für Datenschutzanfragen:</strong> datenschutz@camperquest.de</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cookies" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">6. Cookies & Tracking</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-muted-foreground">
              <div className="space-y-4">
                <p>Wir verwenden Cookies zur Verbesserung der Website-Funktionalität:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold text-green-600 mb-2">Technisch notwendig</h4>
                    <p className="text-sm">Session-Cookies für Warenkorbfunktion (keine Einwilligung erforderlich)</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">Analytisch</h4>
                    <p className="text-sm">Website-Analyse mit anonymisierten Daten (mit Ihrer Einwilligung)</p>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Support */}
        <Card className="mt-12 border-primary/20">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Datenschutzfragen?</h3>
            <p className="text-muted-foreground mb-4">
              Unser Datenschutzbeauftragter hilft Ihnen gerne weiter.
            </p>
            <div className="space-y-2">
              <p className="font-medium">datenschutz@camperquest.de</p>
              <p className="text-muted-foreground">Antwort innerhalb von 72 Stunden</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;