import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [providerData, setProviderData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const handleCustomerRegister = async () => {
    if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.password) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    if (customerData.password !== customerData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive"
      });
      return;
    }

    if (!customerData.acceptTerms) {
      toast({
        title: "Fehler",
        description: "Bitte akzeptieren Sie die AGB.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: customerData.email,
        password: customerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            role: 'customer'
          }
        }
      });

      if (error) {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte überprüfen Sie Ihre E-Mails und bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden können."
        });
        navigate('/login');
      } else if (data.session) {
        // User is immediately logged in (email confirmation disabled)
        toast({
          title: "Registrierung erfolgreich",
          description: "Ihr Kundenkonto wurde erfolgreich erstellt und Sie sind angemeldet!"
        });
        navigate('/dashboard/customer');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };

  const handleProviderRegister = async () => {
    if (!providerData.companyName || !providerData.contactPerson || !providerData.email || !providerData.password) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    if (providerData.password !== providerData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive"
      });
      return;
    }

    if (!providerData.acceptTerms) {
      toast({
        title: "Fehler",
        description: "Bitte akzeptieren Sie die AGB.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: providerData.email,
        password: providerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: providerData.companyName,
            last_name: providerData.contactPerson,
            role: 'provider'
          }
        }
      });

      if (error) {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte überprüfen Sie Ihre E-Mails und bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden können."
        });
        navigate('/login');
      } else if (data.session) {
        // User is immediately logged in (email confirmation disabled)
        toast({
          title: "Registrierung erfolgreich",
          description: "Ihr Anbieter-Konto wurde erfolgreich erstellt und Sie sind angemeldet!"
        });
        navigate('/dashboard/provider');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Registrieren</h1>
          <p className="text-muted-foreground mt-2">
            Erstellen Sie Ihr CamperQuest Konto
          </p>
        </div>

        <Tabs defaultValue="customer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Kunde</span>
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center space-x-1">
              <Building2 className="h-4 w-4" />
              <span>Anbieter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Kunden-Registrierung</span>
                </CardTitle>
                <CardDescription>
                  Registrieren Sie sich als Kunde, um Wohnmobile zu buchen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={customerData.firstName}
                      onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={customerData.lastName}
                      onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer-reg-email">E-Mail *</Label>
                  <Input
                    id="customer-reg-email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-reg-password">Passwort *</Label>
                  <Input
                    id="customer-reg-password"
                    type="password"
                    value={customerData.password}
                    onChange={(e) => setCustomerData({...customerData, password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-confirm-password">Passwort bestätigen *</Label>
                  <Input
                    id="customer-confirm-password"
                    type="password"
                    value={customerData.confirmPassword}
                    onChange={(e) => setCustomerData({...customerData, confirmPassword: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-terms"
                    checked={customerData.acceptTerms}
                    onCheckedChange={(checked) => setCustomerData({...customerData, acceptTerms: !!checked})}
                  />
                  <Label htmlFor="customer-terms" className="text-sm cursor-pointer">
                    Ich akzeptiere die{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      AGB
                    </Link>{" "}
                    und{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                  </Label>
                </div>
                <Button onClick={handleCustomerRegister} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Als Kunde registrieren
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="provider">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Anbieter-Registrierung</span>
                </CardTitle>
                <CardDescription>
                  Registrieren Sie sich als Anbieter, um Wohnmobile anzubieten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Firmenname *</Label>
                  <Input
                    id="companyName"
                    value={providerData.companyName}
                    onChange={(e) => setProviderData({...providerData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Ansprechpartner *</Label>
                  <Input
                    id="contactPerson"
                    value={providerData.contactPerson}
                    onChange={(e) => setProviderData({...providerData, contactPerson: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="provider-reg-email">E-Mail *</Label>
                  <Input
                    id="provider-reg-email"
                    type="email"
                    value={providerData.email}
                    onChange={(e) => setProviderData({...providerData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={providerData.phone}
                    onChange={(e) => setProviderData({...providerData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="provider-reg-password">Passwort *</Label>
                  <Input
                    id="provider-reg-password"
                    type="password"
                    value={providerData.password}
                    onChange={(e) => setProviderData({...providerData, password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="provider-confirm-password">Passwort bestätigen *</Label>
                  <Input
                    id="provider-confirm-password"
                    type="password"
                    value={providerData.confirmPassword}
                    onChange={(e) => setProviderData({...providerData, confirmPassword: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="provider-terms"
                    checked={providerData.acceptTerms}
                    onCheckedChange={(checked) => setProviderData({...providerData, acceptTerms: !!checked})}
                  />
                  <Label htmlFor="provider-terms" className="text-sm cursor-pointer">
                    Ich akzeptiere die{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      AGB
                    </Link>{" "}
                    und{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                  </Label>
                </div>
                <Button onClick={handleProviderRegister} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Als Anbieter registrieren
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Hier anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;