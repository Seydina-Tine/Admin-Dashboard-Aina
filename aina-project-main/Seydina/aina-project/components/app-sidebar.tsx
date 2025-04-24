import { BarChart2, Bell, Calendar, CalendarClock, Home, Inbox, Search, Settings, User, Users, Video } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Profil",
    url: "/",
    icon: User,
  },
  {
    title: "Personnes beneficiaires",
    url: "/beneficiary-list",
    icon: Users,
  },
  {
    title: "Rendez vous",
    url: "/rendez-vous",
    icon: CalendarClock,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
 
  {
    title: "Statistiques",
    url: "#",
    icon: BarChart2,
  },
  {
    title: "Visio conférence",
    url: "#",
    icon: Video,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{fontSize:25,marginBottom:25}}>Aina</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}