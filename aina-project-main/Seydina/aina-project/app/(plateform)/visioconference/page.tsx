"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Users,
  Calendar,
  Clock,
  Plus,
  Settings,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Appel {
  id: string;
  titre: string;
  participants: string[];
  date: string;
  heure: string;
  duree: string;
  statut: 'planifié' | 'en_cours' | 'terminé' | 'annulé';
  type: 'consultation' | 'suivi' | 'urgence' | 'formation';
}

export default function VisioconferencePage() {
  const [appels, setAppels] = useState<Appel[]>([]);
  const [appelEnCours, setAppelEnCours] = useState<Appel | null>(null);
  const [loading, setLoading] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);
  const [nouveauAppel, setNouveauAppel] = useState({
    titre: '',
    date: '',
    heure: '',
    type: 'consultation'
  });

  useEffect(() => {
    fetchAppels();
  }, []);

  const fetchAppels = async () => {
    try {
      setLoading(true);
      
      // TODO: Remplacer par l'appel API réel une fois l'endpoint créé
      // const response = await fetch('/api/visioconference');
      // const data = await response.json();
      
      // Pour l'instant, tableau vide car pas d'endpoint backend
      const data: Appel[] = [];
      
      setAppels(data);
      
      if (data.length === 0) {
        toast.info('Aucun appel vidéo trouvé dans la base de données');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des appels:', error);
      toast.error('Erreur lors du chargement des appels');
      setAppels([]);
    } finally {
      setLoading(false);
    }
  };

  const demarrerAppel = (appel: Appel) => {
    setAppelEnCours(appel);
    toast.success(`Appel démarré : ${appel.titre}`);
  };

  const terminerAppel = () => {
    if (appelEnCours) {
      setAppels(prev => prev.map(a => 
        a.id === appelEnCours.id ? { ...a, statut: 'terminé' } : a
      ));
      toast.success('Appel terminé');
      setAppelEnCours(null);
    }
  };

  const creerAppel = () => {
    if (!nouveauAppel.titre || !nouveauAppel.date || !nouveauAppel.heure) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const nouvelAppel: Appel = {
      id: Date.now().toString(),
      titre: nouveauAppel.titre,
      participants: ['Vous'],
      date: nouveauAppel.date,
      heure: nouveauAppel.heure,
      duree: '30 min',
      statut: 'planifié',
      type: nouveauAppel.type as any
    };

    setAppels(prev => [...prev, nouvelAppel]);
    setNouveauAppel({ titre: '', date: '', heure: '', type: 'consultation' });
    toast.success('Nouvel appel créé');
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'planifié': return 'default';
      case 'en_cours': return 'default';
      case 'terminé': return 'secondary';
      case 'annulé': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'default';
      case 'suivi': return 'secondary';
      case 'urgence': return 'destructive';
      case 'formation': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Chargement des appels...</div>
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
            Visioconférence
          </h1>
          <p className="text-gray-600">
            Gérer et rejoindre vos appels vidéo médicaux
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchAppels}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => document.getElementById('nouveau-appel')?.scrollIntoView()}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Appel
          </Button>
        </div>
      </div>

      {/* Appel en cours */}
      {appelEnCours && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Video className="w-5 h-5 mr-2" />
              Appel en cours : {appelEnCours.titre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-green-700">
                  Participants : {appelEnCours.participants.join(', ')}
                </span>
                <span className="text-sm text-green-700">
                  Durée : {appelEnCours.duree}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={microphone ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMicrophone(!microphone)}
                >
                  {microphone ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={camera ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCamera(!camera)}
                >
                  {camera ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={terminerAppel}
                >
                  <PhoneOff className="w-4 h-4 mr-1" />
                  Terminer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Video className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Appels</p>
                <p className="text-2xl font-bold">{appels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Planifiés</p>
                <p className="text-2xl font-bold">
                  {appels.filter(a => a.statut === 'planifié').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {appels.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold">
                  {appels.reduce((total, a) => total + a.participants.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Créer un nouvel appel */}
      <Card id="nouveau-appel">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Créer un Nouvel Appel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Titre de l'appel"
              value={nouveauAppel.titre}
              onChange={(e) => setNouveauAppel(prev => ({ ...prev, titre: e.target.value }))}
            />
            <Input
              type="date"
              value={nouveauAppel.date}
              onChange={(e) => setNouveauAppel(prev => ({ ...prev, date: e.target.value }))}
            />
            <Input
              type="time"
              value={nouveauAppel.heure}
              onChange={(e) => setNouveauAppel(prev => ({ ...prev, heure: e.target.value }))}
            />
            <select
              value={nouveauAppel.type}
              onChange={(e) => setNouveauAppel(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="consultation">Consultation</option>
              <option value="suivi">Suivi</option>
              <option value="urgence">Urgence</option>
              <option value="formation">Formation</option>
            </select>
          </div>
          <div className="mt-4">
            <Button onClick={creerAppel}>
              <Video className="w-4 h-4 mr-2" />
              Créer l'Appel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des appels */}
      <Card>
        <CardHeader>
          <CardTitle>Appels Planifiés</CardTitle>
        </CardHeader>
        <CardContent>
          {appels.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun appel trouvé</h3>
              <p className="text-gray-500 mb-4">
                Il n'y a actuellement aucun appel vidéo dans la base de données.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Les appels apparaîtront ici une fois l'intégration backend complétée.
                </p>
                <Button onClick={fetchAppels} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          ) : appels.filter(a => a.statut === 'planifié').length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun appel planifié pour le moment.</p>
              <p className="text-sm mt-2">Créez un nouvel appel pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appels.filter(a => a.statut === 'planifié').map((appel) => (
                <div key={appel.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{appel.titre}</h3>
                        <Badge variant={getTypeColor(appel.type)}>
                          {appel.type.charAt(0).toUpperCase() + appel.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(appel.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appel.heure} ({appel.duree})
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {appel.participants.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => demarrerAppel(appel)}
                        disabled={!!appelEnCours}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Démarrer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.info('Fonctionnalité à implémenter')}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.info('Fonctionnalité à implémenter')}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Options
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des appels */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Appels</CardTitle>
        </CardHeader>
        <CardContent>
          {appels.filter(a => a.statut !== 'planifié').length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun appel terminé pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appels.filter(a => a.statut !== 'planifié').map((appel) => (
                <div key={appel.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{appel.titre}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{new Date(appel.date).toLocaleDateString('fr-FR')} à {appel.heure}</span>
                        <Badge variant={getStatutColor(appel.statut)}>
                          {appel.statut.charAt(0).toUpperCase() + appel.statut.slice(1)}
                        </Badge>
                      </div>
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
