import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthService from "@/services/AuthService";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si déjà connecté
  useEffect(() => {
    if (AuthService.isAuthenticatedDoctor()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await AuthService.doctorLogin({ email, password });
      
      if (response.success) {
        // Brève pause pour s'assurer que le token est bien stocké
        setTimeout(() => {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans l'application Renal Trackr",
          });
          navigate("/dashboard");
        }, 100);
      } else {
        setError(response.message || "Identifiants invalides");
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de la connexion");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#ECE7E3] via-[#FAFAFA] to-[#ECE7E3]">
      <Card className="w-[420px] border-none shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#2980BA] to-[#619DB5] p-6 flex justify-center">
          <img 
            src="/renal_trackr.png" 
            alt="Renal Trackr Logo" 
            className="h-28 w-auto drop-shadow-md transition-transform hover:scale-105 duration-300"
          />
        </div>
        <CardHeader className="pt-6 pb-2">
          <CardDescription className="text-center text-base font-medium flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#2980BA]">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.96 49.96 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.001 50.001 0 0 0 1.4 10.057a.75.75 0 0 1-.23-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 10 13.176v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
            </svg>
            Espace Médecin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          {error && (
            <Alert variant="destructive" className="mb-5 bg-red-50 border-red-300 text-red-800 animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2980BA] font-medium pl-1">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="border-[#91BDC8] focus:border-[#2980BA] h-11 rounded-md ring-offset-white"
                  placeholder="docteur@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <Label htmlFor="password" className="text-[#2980BA] font-medium">Mot de passe</Label>
                  <a href="#" className="text-xs text-[#2980BA] hover:text-[#619DB5] hover:underline">
                    Mot de passe oublié?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="border-[#91BDC8] focus:border-[#2980BA] h-11 rounded-md ring-offset-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button 
              className="w-full h-12 mt-6 bg-gradient-to-r from-[#2980BA] to-[#619DB5] hover:from-[#2980BA] hover:to-[#334349] text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200 text-base"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="absolute bottom-4 text-center text-[#334349] text-sm">
        © {new Date().getFullYear()} Renal Trackr - Application de suivi de la maladie rénale
      </div>
    </div>
  );
};

export default DoctorLogin;
