"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Composant Badge local pour éviter les problèmes d'import
const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "secondary" | "destructive" | "outline"; className?: string }) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground"
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Filter,
  Download,
  Eye,
  Edit,
  RefreshCw
} from "lucide-react";
import { AuthService, UserService, type User, getUserRoleName, formatDate, isUserActive } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function TableauDeBord() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [roles, setRoles] = useState<any[]>([]);

  // Charger les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        AuthService.getAllUsers(),
        AuthService.getAllRoles()
      ]);
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setFilteredUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.mail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === "all" || getUserRoleName(user) === selectedRole;
      const matchesStatus = selectedStatus === "all" || (selectedStatus === 'actif' ? isUserActive(user) : !isUserActive(user));
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => isUserActive(u)).length;
    
    // Debug des rôles
    console.log('Rôles des utilisateurs:', users.map(u => ({ 
      nom: u.prenom + ' ' + u.nom, 
      role: getUserRoleName(u),
      roleObject: u.approle,
      roleId: u.approle?.Id_role,
      roleName: u.approle?.nomrole
    })));
    
    const aidants = users.filter(u => getUserRoleName(u) === 'Proche Aidant').length;
    const beneficiaires = users.filter(u => getUserRoleName(u) === 'Bénéficiaire').length;
    
    console.log('Comptage:', { aidants, beneficiaires });
    console.log('Tous les rôles disponibles:', roles);
    
    return { totalUsers, activeUsers, aidants, beneficiaires };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-lg text-gray-600">Chargement du tableau de bord...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Gestion des utilisateurs et des profils</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter les données
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Proches Aidants</p>
                <p className="text-2xl font-bold">{stats.aidants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Personnes Bénéficiaires</p>
                <p className="text-2xl font-bold">{stats.beneficiaires}</p>
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
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtrer par rôle"
            >
              <option key="all" value="all">Tous les rôles</option>
              {Array.isArray(roles) && roles.length > 0 && roles.map((role, index) => (
                <option key={role.Id_role || `role-${index}`} value={role.nomrole}>
                  {role.nomrole}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtrer par statut"
            >
              <option key="all" value="all">Tous les statuts</option>
              <option key="actif" value="actif">Actif</option>
              <option key="inactif" value="inactif">Inactif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Nom</th>
                  <th className="text-left p-3 font-semibold">Contact</th>
                  <th className="text-left p-3 font-semibold">Rôle</th>
                  <th className="text-left p-3 font-semibold">Statut</th>
                  <th className="text-left p-3 font-semibold">Date de création</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                                 {filteredUsers.map((user) => (
                   <tr key={user.iduser} className="border-b hover:bg-gray-50">
                                         <td className="p-3">
                       <div>
                         <p className="font-medium">{user.prenom} {user.nom}</p>
                         <p className="text-sm text-gray-500">ID: {user.iduser}</p>
                       </div>
                     </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm">{user.mail}</p>
                        <p className="text-sm text-gray-500">{user.tele}</p>
                      </div>
                    </td>
                                         <td className="p-3">
                                               <Badge variant={getUserRoleName(user) === 'Proche Aidant' ? 'default' : 'secondary'}>
                          {getUserRoleName(user)}
                        </Badge>
                     </td>
                     <td className="p-3">
                       <Badge variant={isUserActive(user) ? 'default' : 'destructive'}>
                         {isUserActive(user) ? 'Actif' : 'Inactif'}
                       </Badge>
                     </td>
                     <td className="p-3 text-sm text-gray-600">
                       {user.date_naissance ? formatDate(user.date_naissance) : 'N/A'}
                     </td>
                                         <td className="p-3">
                       <div className="flex space-x-2">
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => router.push(`/utilisateur/${user.iduser}`)}
                         >
                           <Eye className="w-4 h-4 mr-1" />
                           Voir
                         </Button>
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => router.push(`/utilisateur/${user.iduser}`)}
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {users.length === 0 ? (
                <div className="space-y-2">
                  <p>Aucun utilisateur trouvé dans la base de données.</p>
                  <Button variant="outline" onClick={fetchUsers}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              ) : (
                <p>Aucun utilisateur trouvé avec les critères sélectionnés.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
