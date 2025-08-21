// Configuration de l'API
const API_BASE_URL = 'http://localhost:9001';

// Types basés sur vos entités Java
export interface User {
  iduser: number;
  nom: string;
  prenom: string;
  mail: string;
  sexe?: string;
  date_naissance?: string;
  adresse?: string;
  tele: string;
  numero_permis?: string;
  titre_professionel?: string;
  photoUrl?: string;
  approle: Role;
  isOnline: boolean;
  isFirstlogin: boolean;
  fonctionnalites?: NomFonctionnalite[];
  beneficiaires?: User[];
}

export interface Role {
  Id_role: number;
  nomrole: string;
}

export interface NomFonctionnalite {
  id: number;
  nom: string;
  description?: string;
}

export interface Contact {
  id: number;
  senderId: number;
  receiverId: number;
  dateCreation: string;
}

export interface Notification {
  id: number;
  senderId: number;
  receiverId: number;
  title: string;
  message: string;
  type_notification: string;
  dateCreation: string;
  notificationStatus: string;
}

// Service d'authentification
export class AuthService {
  static async login(identifier: string, password: string) {
    const formData = new FormData();
    formData.append('identifier', identifier);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Échec de la connexion');
    }

    const data = await response.json();
    return data;
  }

  static async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer l\'utilisateur actuel');
    }

    return response.json();
  }

  static async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/auth/users`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les utilisateurs');
    }

    return response.json();
  }

  static async getUsersByRole(roleId: number): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/auth/users/by-role?roleId=${roleId}`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les utilisateurs par rôle');
    }

    return response.json();
  }

  static async getAllRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les rôles');
    }

    return response.json();
  }
}

// Service de gestion des utilisateurs
export class UserService {
  static async createUser(userData: Partial<User>): Promise<User> {
    const formData = new FormData();
    
    // Ajouter tous les champs utilisateur
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la création: ${errorText}`);
    }

    return response.json();
  }

  static async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Impossible de mettre à jour l\'utilisateur');
    }

    return response.json();
  }

  static async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Impossible de supprimer l\'utilisateur');
    }
  }

  static async getUserById(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Utilisateur non trouvé');
    }

    return response.json();
  }
}

// Service de gestion des contacts
export class ContactService {
  static async getContactsByReceiver(receiverId: number): Promise<Contact[]> {
    const response = await fetch(`${API_BASE_URL}/auth/contacts/${receiverId}`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les contacts');
    }

    return response.json();
  }

  static async getContactsBySender(senderId: number): Promise<Contact[]> {
    const response = await fetch(`${API_BASE_URL}/auth/contacts/envoyer/${senderId}`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les contacts');
    }

    return response.json();
  }

  static async createContact(senderId: number, receiverId: number): Promise<void> {
    const formData = new FormData();
    formData.append('senderId', senderId.toString());
    formData.append('receiverId', receiverId.toString());

    const response = await fetch(`${API_BASE_URL}/auth/contacts`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Impossible de créer le contact');
    }
  }
}

// Service de gestion des notifications
export class NotificationService {
  static async getNotificationsByReceiver(receiverId: number): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/auth/notifications/${receiverId}`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les notifications');
    }

    return response.json();
  }

  static async createNotification(
    senderId: number, 
    receiverId: number, 
    title: string, 
    message: string, 
    type: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('senderId', senderId.toString());
    formData.append('receiverId', receiverId.toString());
    formData.append('title', title);
    formData.append('message', message);
    formData.append('type_notification', type);

    const response = await fetch(`${API_BASE_URL}/auth/notifications`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Impossible de créer la notification');
    }
  }
}

// Utilitaires
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const getUserFullName = (user: User): string => {
  return `${user.prenom} ${user.nom}`;
};

export const getUserRoleName = (user: User): string => {
  return user.approle?.nomrole || 'Rôle non défini';
};

export const isUserActive = (user: User): boolean => {
  return user.isOnline || false;
};
