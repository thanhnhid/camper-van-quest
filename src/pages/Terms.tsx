const Terms = () => {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
          CamperQuest GmbH (nachfolgend "wir" oder "CamperQuest") und unseren Kunden 
          (nachfolgend "Sie" oder "Mieter") über die Vermietung von Wohnmobilen.
        </p>

        <h2>2. Vertragsschluss</h2>
        <p>
          Der Mietvertrag kommt durch Ihre Buchung und unsere Bestätigung zustande. 
          Mit der Buchung erklären Sie sich mit diesen AGB einverstanden.
        </p>

        <h2>3. Mietgegenstand</h2>
        <p>
          Gegenstand des Mietvertrages ist das von Ihnen gebuchte Wohnmobil mit der 
          angegebenen Ausstattung. Das Fahrzeug wird Ihnen in technisch einwandfreiem 
          und sauberem Zustand übergeben.
        </p>

        <h2>4. Mietdauer und Übergabe</h2>
        <p>
          Die Mietzeit beginnt und endet zu den vereinbarten Zeiten. Bei verspäteter 
          Rückgabe können zusätzliche Kosten anfallen. Die Übergabe erfolgt nach 
          Überprüfung des Fahrzeugs und der Vollständigkeit der Ausstattung.
        </p>

        <h2>5. Mietpreis und Zahlung</h2>
        <p>
          Der Mietpreis richtet sich nach der aktuellen Preisliste. Zusätzlich können 
          Kosten für Versicherungen, Reinigung und Kaution anfallen. Die Zahlung erfolgt 
          vor Fahrzeugübergabe.
        </p>

        <h2>6. Kaution</h2>
        <p>
          Es wird eine Kaution in Höhe von 500€ erhoben, die bei ordnungsgemäßer Rückgabe 
          des Fahrzeugs vollständig zurückerstattet wird. Von der Kaution können Kosten 
          für Schäden, Reinigung oder Vertragsverletzungen abgezogen werden.
        </p>

        <h2>7. Versicherung</h2>
        <p>
          Das Fahrzeug ist haftpflichtversichert. Je nach gewähltem Versicherungspaket 
          sind weitere Schäden abgedeckt. Details entnehmen Sie bitte der jeweiligen 
          Versicherungsbeschreibung.
        </p>

        <h2>8. Pflichten des Mieters</h2>
        <ul>
          <li>Sorgfältiger Umgang mit dem Fahrzeug</li>
          <li>Einhaltung der Straßenverkehrsordnung</li>
          <li>Regelmäßige Kontrolle von Öl, Wasser und Reifen</li>
          <li>Unverzügliche Meldung von Schäden oder Pannen</li>
          <li>Rückgabe in sauberem Zustand</li>
        </ul>

        <h2>9. Stornierung</h2>
        <p>
          Eine kostenlose Stornierung ist bis 48 Stunden vor Mietbeginn möglich. 
          Bei späterer Stornierung fallen Gebühren an.
        </p>

        <h2>10. Haftung</h2>
        <p>
          Der Mieter haftet für alle Schäden am Fahrzeug, die durch unsachgemäße 
          Behandlung oder Verschulden entstehen. Die Haftung ist je nach Versicherungspaket 
          begrenzt.
        </p>

        <h2>11. Salvatorische Klausel</h2>
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit 
          der übrigen Bestimmungen unberührt.
        </p>

        <h2>12. Anwendbares Recht</h2>
        <p>
          Es gilt deutsches Recht. Gerichtsstand ist München.
        </p>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Stand: Januar 2024<br />
            CamperQuest GmbH<br />
            Musterstraße 123<br />
            80333 München<br />
            Deutschland
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;