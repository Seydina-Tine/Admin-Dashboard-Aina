"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  RefreshCw
} from "lucide-react";
import { AuthService, type User, getUserRoleName, formatDate } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function PersonnesBeneficiairesPage() {
  const router = useRouter();
  const [beneficiaires, setBeneficiaires] = useState<User[]>([]);
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchBeneficiaires();
  }, []);

  const fetchBeneficiaires = async () => {
    try {
      setLoading(true);
      const allUsers = await AuthService.getAllUsers();
      
      // Filtrer seulement les bénéficiaires
      const beneficiairesOnly = allUsers.filter(user => 
        user.approle?.nomrole === 'Bénéficiaire'
      );
      
      setBeneficiaires(beneficiairesOnly);
      setFilteredBeneficiaires(beneficiairesOnly);
      
      if (beneficiairesOnly.length === 0) {
        toast.info('Aucun bénéficiaire trouvé dans la base de données');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bénéficiaires:', error);
      toast.error('Erreur lors du chargement des bénéficiaires');
      setBeneficiaires([]);
      setFilteredBeneficiaires([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = beneficiaires;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(user => {
        if (selectedStatus === "actif") return user.isOnline;
        if (selectedStatus === "inactif") return !user.isOnline;
        return true;
      });
    }

    setFilteredBeneficiaires(filtered);
  }, [searchTerm, selectedStatus, beneficiaires]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Chargement des bénéficiaires...</div>
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
            Personnes Bénéficiaires
          </h1>
          <p className="text-gray-600">
            Gérer et consulter les informations des personnes bénéficiaires
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchBeneficiaires}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => toast.info('Fonctionnalité à implémenter')}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Bénéficiaire
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Bénéficiaires</p>
                <p className="text-2xl font-bold">{beneficiaires.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold">
                  {beneficiaires.filter(u => u.isOnline).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Avec Adresse</p>
                <p className="text-2xl font-bold">
                  {beneficiaires.filter(u => u.adresse).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des bénéficiaires */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Bénéficiaires ({filteredBeneficiaires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {beneficiaires.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bénéficiaire trouvé</h3>
              <p className="text-gray-500 mb-4">
                Il n'y a actuellement aucun bénéficiaire dans la base de données.
              </p>
              <Button onClick={fetchBeneficiaires} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          ) : filteredBeneficiaires.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun bénéficiaire trouvé avec les critères sélectionnés.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Nom</th>
                    <th className="text-left p-3 font-semibold">Contact</th>
                    <th className="text-left p-3 font-semibold">Statut</th>
                    <th className="text-left p-3 font-semibold">Adresse</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeneficiaires.map((beneficiaire) => (
                    <tr key={beneficiaire.iduser} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{beneficiaire.prenom} {beneficiaire.nom}</p>
                          <p className="text-sm text-gray-500">ID: {beneficiaire.iduser}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {beneficiaire.mail || 'Non renseigné'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {beneficiaire.tele || 'Non renseigné'}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant={beneficiaire.isOnline ? 'default' : 'destructive'}>
                          {beneficiaire.isOnline ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {beneficiaire.adresse || 'Non renseignée'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/utilisateur/${beneficiaire.iduser}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/utilisateur/${beneficiaire.iduser}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
