import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, User, Building2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirectUserByRole(session.user.id);
    }
  };

  const redirectUserByRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        // Default redirect if profile fetch fails
        navigate('/dashboard/customer');
        return;
      }
      
      if (profile) {
        switch (profile.role) {
          case 'customer':
            navigate('/dashboard/customer');
            break;
          case 'provider':
            navigate('/dashboard/provider');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/dashboard/customer');
        }
      } else {
        // If no profile found, default to customer dashboard
        navigate('/dashboard/customer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Default redirect if there's an exception
      navigate('/dashboard/customer');
    }
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        let errorMessage = "Ein Fehler ist aufgetreten.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort oder registrieren Sie sich zuerst.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Bitte bestätigen Sie zunächst Ihre E-Mail-Adresse. Überprüfen Sie Ihr E-Mail-Postfach.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Kein Benutzer mit dieser E-Mail-Adresse gefunden. Bitte registrieren Sie sich zuerst.";
        }
        
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Anmeldung erfolgreich",
          description: "Willkommen zurück!"
        });
        
        redirectUserByRole(data.user.id);
      }
    } catch (error) {
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
          <h1 className="text-3xl font-bold">Anmelden</h1>
          <p className="text-muted-foreground mt-2">
            Melden Sie sich in Ihrem CamperQuest Konto an
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Falls Sie sich gerade registriert haben, müssen Sie möglicherweise erst Ihre E-Mail-Adresse bestätigen, bevor Sie sich anmelden können.
            </p>
          </div>
        </div>

        <Tabs defaultValue="customer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Kunde</span>
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center space-x-1">
              <Building2 className="h-4 w-4" />
              <span>Anbieter</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Kunden-Login</span>
                </CardTitle>
                <CardDescription>
                  Melden Sie sich als Kunde an, um Wohnmobile zu buchen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer-email">E-Mail</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-password">Passwort</Label>
                  <Input
                    id="customer-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="provider">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Anbieter-Login</span>
                </CardTitle>
                <CardDescription>
                  Melden Sie sich als Anbieter an, um Ihre Wohnmobile zu verwalten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider-email">E-Mail</Label>
                  <Input
                    id="provider-email"
                    type="email"
                    placeholder="anbieter@firma.de"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="provider-password">Passwort</Label>
                  <Input
                    id="provider-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Admin-Login</span>
                </CardTitle>
                <CardDescription>
                  Administrativer Zugang zur Plattform-Verwaltung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin E-Mail</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@camperquest.de"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Admin Passwort</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center space-y-2">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            Passwort vergessen?
          </Link>
          <p className="text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Hier registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;