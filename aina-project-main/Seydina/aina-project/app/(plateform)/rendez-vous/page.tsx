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
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Mail,
  Plus,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

interface RendezVous {
  id: number;
  date: string;
  heure: string;
  patient: string;
  medecin: string;
  specialite: string;
  statut: 'planifié' | 'confirmé' | 'annulé' | 'terminé';
  notes?: string;
  adresse?: string;
}

export default function RendezVousPage() {
  const router = useRouter();
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [filteredRendezVous, setFilteredRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      
      // TODO: Remplacer par l'appel API réel une fois l'endpoint créé
      // const response = await fetch('/api/rendez-vous');
      // const data = await response.json();
      
      // Pour l'instant, tableau vide car pas d'endpoint backend
      const data: RendezVous[] = [];
      
      setRendezVous(data);
      setFilteredRendezVous(data);
      
      if (data.length === 0) {
        toast.info('Aucun rendez-vous trouvé dans la base de données');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
      setRendezVous([]);
      setFilteredRendezVous([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = rendezVous;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(rdv =>
        rdv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rdv.medecin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rdv.specialite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(rdv => rdv.statut === selectedStatus);
    }

    // Filtre par date
    if (selectedDate) {
      filtered = filtered.filter(rdv => rdv.date === selectedDate);
    }

    setFilteredRendezVous(filtered);
  }, [searchTerm, selectedStatus, selectedDate, rendezVous]);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'planifié': return 'default';
      case 'confirmé': return 'default';
      case 'annulé': return 'destructive';
      case 'terminé': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Chargement des rendez-vous...</div>
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
            Rendez-vous
          </h1>
          <p className="text-gray-600">
            Gérer et consulter les rendez-vous médicaux
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchRendezVous}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => toast.info('Fonctionnalité à implémenter')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total RDV</p>
                <p className="text-2xl font-bold">{rendezVous.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Planifiés</p>
                <p className="text-2xl font-bold">
                  {rendezVous.filter(rdv => rdv.statut === 'planifié').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold">
                  {rendezVous.filter(rdv => rdv.statut === 'confirmé').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {rendezVous.filter(rdv => rdv.date === new Date().toISOString().split('T')[0]).length}
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
                  placeholder="Rechercher par patient, médecin ou spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="planifié">Planifié</option>
              <option value="confirmé">Confirmé</option>
              <option value="annulé">Annulé</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Rendez-vous ({filteredRendezVous.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rendezVous.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
              <p className="text-gray-500 mb-4">
                Il n'y a actuellement aucun rendez-vous dans la base de données.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Les rendez-vous apparaîtront ici une fois l'intégration backend complétée.
                </p>
                <Button onClick={fetchRendezVous} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          ) : filteredRendezVous.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous trouvé avec les critères sélectionnés.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Date & Heure</th>
                    <th className="text-left p-3 font-semibold">Patient</th>
                    <th className="text-left p-3 font-semibold">Médecin</th>
                    <th className="text-left p-3 font-semibold">Spécialité</th>
                    <th className="text-left p-3 font-semibold">Statut</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRendezVous.map((rdv) => (
                    <tr key={rdv.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{new Date(rdv.date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-sm text-gray-500">{rdv.heure}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{rdv.patient}</p>
                          {rdv.adresse && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {rdv.adresse}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{rdv.medecin}</p>
                          <p className="text-sm text-gray-500">{rdv.specialite}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-gray-600">{rdv.specialite}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant={getStatusColor(rdv.statut)}>
                          {rdv.statut.charAt(0).toUpperCase() + rdv.statut.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.info('Fonctionnalité à implémenter')}
                          >
                            Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.info('Fonctionnalité à implémenter')}
                          >
                            Supprimer
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
