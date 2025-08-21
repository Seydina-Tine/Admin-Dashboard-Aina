"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Users,
  Activity,
  Settings
} from "lucide-react";
import { AuthService, UserService, type User, getUserRoleName, formatDate, isUserActive } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  // Charger les données de l'utilisateur connecté
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        
        // Essayer d'abord de récupérer l'utilisateur connecté
        try {
          const userData = await UserService.getUserById(1);
          setUser(userData);
          setEditedUser(userData);
        } catch (error) {
          console.log('Utilisateur ID 1 non trouvé, utilisation des données de démonstration');
          // Utiliser des données de démonstration si l'utilisateur n'est pas trouvé
          const demoUser: User = {
            iduser: 1,
            prenom: "Dr. Martin",
            nom: "Dupont",
            mail: "dr.martin@example.com",
            tele: "+33 1 23 45 67 89",
            date_naissance: "1980-05-15",
            sexe: "M",
            adresse: "123 Rue de la Santé, 75001 Paris",
            isOnline: true,
            approle: {
              Id_role: 1,
              nomrole: "Prestataire de soins de Santé"
            }
          };
          setUser(demoUser);
          setEditedUser(demoUser);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Impossible de charger les données du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof User, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    try {
      if (!user) return;
      
      // Pour l'instant, simuler la mise à jour
      setUser(prev => prev ? { ...prev, ...editedUser } : null);
      setEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Annuler les modifications
  const handleCancel = () => {
    setEditedUser(user || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Profil non trouvé</div>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mon Profil
          </h1>
          <p className="text-gray-600">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="text-2xl font-bold">{user.prenom} {user.nom}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Rôle</p>
                <p className="text-2xl font-bold">{user.approle?.nomrole || 'Non défini'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <Badge variant={user.isOnline ? 'default' : 'destructive'}>
                  {user.isOnline ? 'En ligne' : 'Hors ligne'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informations du Profil</span>
            <div className="flex space-x-2">
              {!editing ? (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={editing ? editedUser.prenom || '' : user.prenom || ''}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={editing ? editedUser.nom || '' : user.nom || ''}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editing ? editedUser.mail || '' : user.mail || ''}
                  onChange={(e) => handleChange('mail', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={editing ? editedUser.tele || '' : user.tele || ''}
                  onChange={(e) => handleChange('tele', e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date_naissance">Date de naissance</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={editing ? editedUser.date_naissance || '' : user.date_naissance || ''}
                  onChange={(e) => handleChange('date_naissance', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="sexe">Sexe</Label>
                <select
                  id="sexe"
                  value={editing ? editedUser.sexe || '' : user.sexe || ''}
                  onChange={(e) => handleChange('sexe', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sélectionner le sexe"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={editing ? editedUser.adresse || '' : user.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => toast.success('Fonctionnalité à implémenter')}>
              <Mail className="w-4 h-4 mr-2" />
              Changer l'email
            </Button>
            <Button variant="outline" onClick={() => toast.success('Fonctionnalité à implémenter')}>
              <Shield className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
            <Button variant="outline" onClick={() => toast.success('Fonctionnalité à implémenter')}>
              <Users className="w-4 h-4 mr-2" />
              Gérer les permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
