"use client"

import { Cloud, Contact, Home, Settings, Zap, CheckSquare, DollarSign, CloudUpload, Files } from "lucide-react"
import { useEffect } from "react" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: CloudUpload,
  },
  {
    title: "Files",
    url: "/files",
    icon: Files,
  },
/*   {
    title: "Deals",
    url: "/deals",
    icon: DollarSign,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Contact,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Zap,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  }, */
]

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar() // Obtén estas funciones

  // Cierra el menú automáticamente cada vez que cambia la ruta
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  return (
     <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cloud className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold">AWS SP</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/photo.jpg"
              alt="Rodrigo Salgado"
              className="object-cover"
            />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Rodrigo Salgado</span>
            <span className="text-xs text-muted-foreground">AWS Certified Developer</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
