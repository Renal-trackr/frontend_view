import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  UserCircle,
  Bell,
  Shield,
  Smartphone,
  Users,
  Building,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "notifications", "security", "practice"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="practice">
            <Building className="mr-2 h-4 w-4" />
            <span>Cabinet</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Prénom
                  </label>
                  <Input id="firstName" defaultValue="Dr. Richard" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input id="lastName" defaultValue="Dupont" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" defaultValue="richard.dupont@example.com" type="email" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="specialty" className="text-sm font-medium">
                    Spécialité
                  </label>
                  <Input id="specialty" defaultValue="Néphrologue" />
                </div>
              </div>
              <Button className="mt-4">Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez quand et comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes patients</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour les alertes patient
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels de rendez-vous</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour les rendez-vous à venir
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications par email en plus de l'application
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Changer le mot de passe</p>
                  <div className="grid grid-cols-1 gap-4">
                    <Input type="password" placeholder="Mot de passe actuel" />
                    <Input type="password" placeholder="Nouveau mot de passe" />
                    <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
                  </div>
                  <Button className="mt-2">Mettre à jour le mot de passe</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire à votre compte
                  </p>
                  <Button variant="outline">Configurer 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du cabinet</CardTitle>
              <CardDescription>
                Gérez les informations de votre cabinet médical
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="practiceName" className="text-sm font-medium">
                    Nom du cabinet
                  </label>
                  <Input id="practiceName" defaultValue="Centre de Néphrologie Paris" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Adresse
                  </label>
                  <Input id="address" defaultValue="15 rue de la Santé" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Téléphone
                  </label>
                  <Input id="phone" defaultValue="01 23 45 67 89" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email du cabinet
                  </label>
                  <Input id="email" defaultValue="contact@nephro-paris.fr" type="email" />
                </div>
              </div>
              <Button className="mt-4">Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
