"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  MapPin,
  Phone,
  Mail,
  Clock,
  UserCheck,
  UserX
} from "lucide-react";
import { AuthService, type User } from "@/lib/api";

export default function StatistiquesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await AuthService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const aidants = users.filter(u => u.approle?.nomrole === 'Proche Aidant').length;
    const beneficiaires = users.filter(u => u.approle?.nomrole === 'Bénéficiaire').length;
    const prestataires = users.filter(u => u.approle?.nomrole === 'Prestataire de soins de Santé').length;
    const actifs = users.filter(u => u.isOnline).length;
    const inactifs = totalUsers - actifs;
    const avecAdresse = users.filter(u => u.adresse).length;
    const avecEmail = users.filter(u => u.mail).length;
    const avecTelephone = users.filter(u => u.tele).length;

    return {
      totalUsers,
      aidants,
      beneficiaires,
      prestataires,
      actifs,
      inactifs,
      avecAdresse,
      avecEmail,
      avecTelephone
    };
  };

  const getAgeDistribution = () => {
    const now = new Date();
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-65': 0,
      '65+': 0
    };

    users.forEach(user => {
      if (user.date_naissance) {
        const birthDate = new Date(user.date_naissance);
        const age = now.getFullYear() - birthDate.getFullYear();
        
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else if (age <= 65) ageGroups['51-65']++;
        else ageGroups['65+']++;
      }
    });

    return ageGroups;
  };

  const getGenderDistribution = () => {
    const male = users.filter(u => u.sexe === 'M').length;
    const female = users.filter(u => u.sexe === 'F').length;
    const unspecified = users.filter(u => !u.sexe || (u.sexe !== 'M' && u.sexe !== 'F')).length;
    
    return { male, female, unspecified };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des statistiques...</div>
      </div>
    );
  }

  const stats = getStats();
  const ageDistribution = getAgeDistribution();
  const genderDistribution = getGenderDistribution();

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Statistiques
        </h1>
        <p className="text-gray-600">
          Analyse et visualisation des données de l'application
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{stats.actifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="w-8 h-8 text-red-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Inactifs</p>
                <p className="text-2xl font-bold">{stats.inactifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Taux d'Activité</p>
                <p className="text-2xl font-bold">
                  {stats.totalUsers > 0 ? Math.round((stats.actifs / stats.totalUsers) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution par rôles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Distribution par Rôles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Proches Aidants</span>
              <Badge variant="default">{stats.aidants}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Bénéficiaires</span>
              <Badge variant="secondary">{stats.beneficiaires}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Prestataires de Santé</span>
              <Badge variant="outline">{stats.prestataires}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Distribution par Âge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>0-18 ans</span>
              <Badge variant="default">{ageDistribution['0-18']}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>19-30 ans</span>
              <Badge variant="secondary">{ageDistribution['19-30']}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>31-50 ans</span>
              <Badge variant="outline">{ageDistribution['31-50']}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>51-65 ans</span>
              <Badge variant="default">{ageDistribution['51-65']}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>65+ ans</span>
              <Badge variant="secondary">{ageDistribution['65+']}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Distribution par Genre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Masculin</span>
              <Badge variant="default">{genderDistribution.male}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Féminin</span>
              <Badge variant="secondary">{genderDistribution.female}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Non spécifié</span>
              <Badge variant="outline">{genderDistribution.unspecified}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations de contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Utilisateurs avec Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.avecEmail}</p>
              <p className="text-sm text-gray-600">
                {stats.totalUsers > 0 ? Math.round((stats.avecEmail / stats.totalUsers) * 100) : 0}% du total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Utilisateurs avec Téléphone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.avecTelephone}</p>
              <p className="text-sm text-gray-600">
                {stats.totalUsers > 0 ? Math.round((stats.avecTelephone / stats.totalUsers) * 100) : 0}% du total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Utilisateurs avec Adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.avecAdresse}</p>
              <p className="text-sm text-gray-600">
                {stats.totalUsers > 0 ? Math.round((stats.avecAdresse / stats.totalUsers) * 100) : 0}% du total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et visualisations */}
      <Card>
        <CardHeader>
          <CardTitle>Visualisations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Graphiques et visualisations avancées à implémenter</p>
            <p className="text-sm mt-2">
              Intégration de Chart.js ou Recharts pour des graphiques interactifs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
