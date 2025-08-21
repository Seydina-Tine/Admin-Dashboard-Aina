"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Bell, 
  Mail, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  lu: boolean;
  expediteur: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // TODO: Remplacer par l'appel API réel une fois l'endpoint créé
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      
      // Pour l'instant, tableau vide car pas d'endpoint backend
      const data: Notification[] = [];
      
      setNotifications(data);
      setFilteredNotifications(data);
      
      if (data.length === 0) {
        toast.info('Aucune notification trouvée dans la base de données');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
      setNotifications([]);
      setFilteredNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = notifications;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.expediteur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter(notif => notif.type === selectedType);
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(notif => {
        if (selectedStatus === "lu") return notif.lu;
        if (selectedStatus === "non-lu") return !notif.lu;
        return true;
      });
    }

    setFilteredNotifications(filtered);
  }, [searchTerm, selectedType, selectedStatus, notifications]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'default';
      case 'success': return 'default';
      case 'warning': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'info': return 'Information';
      case 'success': return 'Succès';
      case 'warning': return 'Avertissement';
      case 'error': return 'Erreur';
      default: return type;
    }
  };

  const marquerCommeLu = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lu: true } : notif
      )
    );
    toast.success('Notification marquée comme lue');
  };

  const supprimerNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification supprimée');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Chargement des notifications...</div>
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
            Notifications
          </h1>
          <p className="text-gray-600">
            Consultez et gérez vos notifications système
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchNotifications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setNotifications(prev => prev.map(notif => ({ ...notif, lu: true })));
              toast.success('Toutes les notifications marquées comme lues');
            }}
            disabled={notifications.length === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Non lues</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => !n.lu).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Lues</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.lu).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => 
                    new Date(n.date).toDateString() === new Date().toDateString()
                  ).length}
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
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="info">Information</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="non-lu">Non lues</option>
              <option value="lu">Lues</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Notifications ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification trouvée</h3>
              <p className="text-gray-500 mb-4">
                Il n'y a actuellement aucune notification dans la base de données.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Les notifications apparaîtront ici une fois l'intégration backend complétée.
                </p>
                <Button onClick={fetchNotifications} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune notification trouvée avec les critères sélectionnés.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border rounded-lg ${
                    notif.lu ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-blue-600">
                          {getTypeIcon(notif.type)}
                        </div>
                        <div>
                          <h3 className={`font-medium ${!notif.lu ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notif.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{notif.expediteur}</span>
                            <span>{new Date(notif.date).toLocaleString('fr-FR')}</span>
                            <Badge variant={getTypeColor(notif.type)}>
                              {getTypeLabel(notif.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-7">{notif.message}</p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {!notif.lu && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => marquerCommeLu(notif.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Marquer lu
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => supprimerNotification(notif.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
