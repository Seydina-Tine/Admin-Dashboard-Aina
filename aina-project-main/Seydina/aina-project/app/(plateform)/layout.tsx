import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  BarChart3, 
  Video,
  User,
  LogOut
} from "lucide-react";

interface PlatformLayoutProps {
  children: ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900">AINA Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/profil">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation secondaire */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link href="/tableau-de-bord">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <Home className="w-4 h-4" />
                <span>Tableau de Bord</span>
              </Button>
            </Link>
            <Link href="/personnes-beneficiaires">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <Users className="w-4 h-4" />
                <span>Personnes Bénéficiaires</span>
              </Button>
            </Link>
            <Link href="/rendez-vous">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <Calendar className="w-4 h-4" />
                <span>Rendez-vous</span>
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </Button>
            </Link>
            <Link href="/statistiques">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <BarChart3 className="w-4 h-4" />
                <span>Statistiques</span>
              </Button>
            </Link>
            <Link href="/visioconference">
              <Button variant="ghost" className="flex items-center space-x-2 py-4">
                <Video className="w-4 h-4" />
                <span>Visio-conférence</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
