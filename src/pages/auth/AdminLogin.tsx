import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AuthService from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si déjà connecté
  useEffect(() => {
    if (AuthService.isAuthenticatedAdmin()) {
      navigate("/admin");
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
      const response = await AuthService.login({ email, password });
      
      if (response.success) {
        // Brève pause pour s'assurer que le token est bien stocké
        setTimeout(() => {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans l'interface d'administration",
          });
          navigate("/admin");
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
        <div className="bg-gradient-to-r from-[#334349] to-[#2980BA] p-6 flex justify-center">
          <img 
            src="/renal_trackr.png" 
            alt="Renal Trackr Logo" 
            className="h-28 w-auto drop-shadow-md transition-transform hover:scale-105 duration-300"
          />
        </div>
        <CardHeader className="pt-6 pb-2">
          <CardDescription className="text-center text-base font-medium flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-[#2980BA]" />
            Espace Administrateur
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
                  placeholder="admin@example.com"
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

export default AdminLogin;
