import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending reset email
    setIsSubmitted(true);
    toast({
      title: "E-Mail gesendet",
      description: "Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet."
    });
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Passwort vergessen</h1>
          <p className="text-muted-foreground mt-2">
            Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Passwort zurücksetzen</span>
            </CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Überprüfen Sie Ihr E-Mail-Postfach"
                : "Wir senden Ihnen einen Link zum Zurücksetzen per E-Mail"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <>
                <div>
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Link senden
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">E-Mail gesendet!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Falls ein Konto mit der E-Mail-Adresse <strong>{email}</strong> existiert, 
                    haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Keine E-Mail erhalten?</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Erneut versuchen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;