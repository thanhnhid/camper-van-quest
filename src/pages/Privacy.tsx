const Privacy = () => {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Datenschutzerklärung</h1>
        
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlicher für die Datenverarbeitung ist:<br />
          CamperQuest GmbH<br />
          Musterstraße 123<br />
          80333 München<br />
          Deutschland<br />
          E-Mail: datenschutz@camperquest.de
        </p>

        <h2>2. Arten der verarbeiteten Daten</h2>
        <p>Wir verarbeiten folgende Kategorien von personenbezogenen Daten:</p>
        <ul>
          <li>Kontaktdaten (Name, E-Mail, Telefon, Adresse)</li>
          <li>Buchungsdaten (Mietdauer, Fahrzeug, Zahlungsinformationen)</li>
          <li>Technische Daten (IP-Adresse, Browser-Informationen)</li>
          <li>Nutzungsdaten (Seitenaufrufe, Verweildauer)</li>
        </ul>

        <h2>3. Zweck der Datenverarbeitung</h2>
        <p>Ihre Daten werden verarbeitet für:</p>
        <ul>
          <li>Durchführung von Buchungen und Mietverträgen</li>
          <li>Kundenservice und Support</li>
          <li>Abwicklung von Zahlungen</li>
          <li>Verbesserung unserer Services</li>
          <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
        </ul>

        <h2>4. Rechtsgrundlage</h2>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO:
        </p>
        <ul>
          <li>Buchungsabwicklung: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)</li>
          <li>Marketing: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
          <li>Aufbewahrung: Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO)</li>
        </ul>

        <h2>5. Datenweitergabe</h2>
        <p>
          Ihre Daten werden nur in folgenden Fällen an Dritte weitergegeben:
        </p>
        <ul>
          <li>An Zahlungsdienstleister für die Abwicklung von Zahlungen</li>
          <li>An IT-Dienstleister für Hosting und technische Services</li>
          <li>Bei gesetzlicher Verpflichtung an Behörden</li>
        </ul>

        <h2>6. Speicherdauer</h2>
        <p>
          Wir speichern Ihre Daten nur so lange wie nötig:
        </p>
        <ul>
          <li>Buchungsdaten: 10 Jahre (steuerliche Aufbewahrungspflicht)</li>
          <li>Kontaktdaten: Bis zum Widerruf oder Ende der Geschäftsbeziehung</li>
          <li>Technische Daten: 30 Tage</li>
        </ul>

        <h2>7. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
        <ul>
          <li>Auskunft über verarbeitete Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung der Daten (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitung (Art. 21 DSGVO)</li>
        </ul>

        <h2>8. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies zur Verbesserung der Nutzererfahrung. 
          Sie können Cookies in Ihren Browser-Einstellungen deaktivieren.
        </p>

        <h2>9. SSL-Verschlüsselung</h2>
        <p>
          Diese Website nutzt SSL-Verschlüsselung zum Schutz der Datenübertragung. 
          Verschlüsselte Verbindungen erkennen Sie am "https://" in der Adresszeile.
        </p>

        <h2>10. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über 
          die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
        </p>

        <h2>11. Änderungen der Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an 
          geänderte Rechtslagen oder Funktionen anzupassen.
        </p>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Stand: Januar 2024<br />
            Bei Fragen zum Datenschutz kontaktieren Sie uns unter: 
            datenschutz@camperquest.de
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;