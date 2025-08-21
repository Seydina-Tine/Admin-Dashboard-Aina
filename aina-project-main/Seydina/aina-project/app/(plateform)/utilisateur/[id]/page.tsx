"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Activity
} from "lucide-react";
import { UserService, type User, getUserRoleName, formatDate, isUserActive } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ProfilUtilisateur() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserService.getUserById(userId);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Utilisateur non trouvé');
        router.push('/tableau-de-bord');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleChange = (field: keyof User, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      
      const updatedUser = await UserService.updateUser(user.iduser, editedUser);
      setUser(updatedUser);
      setEditing(false);
      toast.success('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement de l'utilisateur...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Utilisateur non trouvé</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/tableau-de-bord')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profil de {user.prenom} {user.nom}
            </h1>
            <p className="text-gray-600">Gérer les informations de cet utilisateur</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                {editing ? (
                  <Input
                    value={editedUser.prenom || ''}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.prenom}</p>
                )}
              </div>
              <div>
                <Label>Nom</Label>
                {editing ? (
                  <Input
                    value={editedUser.nom || ''}
                    onChange={(e) => handleChange('nom', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.nom}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label>Email</Label>
              {editing ? (
                <Input
                  type="email"
                  value={editedUser.mail || ''}
                  onChange={(e) => handleChange('mail', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{user.mail || 'Non renseigné'}</p>
              )}
            </div>

            <div>
              <Label>Téléphone</Label>
              {editing ? (
                <Input
                  value={editedUser.tele || ''}
                  onChange={(e) => handleChange('tele', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{user.tele}</p>
              )}
            </div>

            <div>
              <Label>Sexe</Label>
              {editing ? (
                <select
                  value={editedUser.sexe || ''}
                  onChange={(e) => handleChange('sexe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  aria-label="Sélectionner le sexe"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              ) : (
                <p className="text-sm text-gray-600">{user.sexe || 'Non renseigné'}</p>
              )}
            </div>

            <div>
              <Label>Date de naissance</Label>
              {editing ? (
                <Input
                  type="date"
                  value={editedUser.date_naissance || ''}
                  onChange={(e) => handleChange('date_naissance', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  {user.date_naissance ? formatDate(user.date_naissance) : 'Non renseigné'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles et statut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Rôle et Statut
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rôle</Label>
              <Badge variant="default" className="mt-1">
                {getUserRoleName(user)}
              </Badge>
            </div>

            <div>
              <Label>Statut</Label>
              <Badge variant={isUserActive(user) ? 'default' : 'destructive'} className="mt-1">
                {isUserActive(user) ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            <div>
              <Label>Première connexion</Label>
              <p className="text-sm text-gray-600">
                {user.isFirstlogin ? 'Oui' : 'Non'}
              </p>
            </div>

            {user.titre_professionel && (
              <div>
                <Label>Titre professionnel</Label>
                {editing ? (
                  <Input
                    value={editedUser.titre_professionel || ''}
                    onChange={(e) => handleChange('titre_professionel', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.titre_professionel}</p>
                )}
              </div>
            )}

            {user.numero_permis && (
              <div>
                <Label>Numéro de permis</Label>
                {editing ? (
                  <Input
                    value={editedUser.numero_permis || ''}
                    onChange={(e) => handleChange('numero_permis', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.numero_permis}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Adresse */}
      {user.adresse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Input
                value={editedUser.adresse || ''}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="Adresse complète"
              />
            ) : (
              <p className="text-sm text-gray-600">{user.adresse}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Relations et fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bénéficiaires (si c'est un aidant) */}
        {user.beneficiaires && user.beneficiaires.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Personnes Bénéficiaires ({user.beneficiaires.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.beneficiaires.map((beneficiaire) => (
                  <div key={beneficiaire.iduser} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{beneficiaire.prenom} {beneficiaire.nom}</span>
                    <Badge variant="secondary">{getUserRoleName(beneficiaire)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fonctionnalités */}
        {user.fonctionnalites && user.fonctionnalites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Fonctionnalités ({user.fonctionnalites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.fonctionnalites.map((fonctionnalite) => (
                  <Badge key={fonctionnalite.id} variant="outline">
                    {fonctionnalite.nom}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
