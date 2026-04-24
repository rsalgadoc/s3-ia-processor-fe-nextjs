import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import ConfigureAmplify from './components/ConfigureAmplify';
import AuthenticatorWrapper from "./AuthenticatorWrapper"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AWS Serverless Projects",
  description: "Soluciones serverless en AWS"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplify />
        <AuthenticatorWrapper>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1">
                {/* BARRA SUPERIOR PARA MÓVIL */}
                <header className="flex h-16 items-center gap-4 border-b px-4 md:hidden">
                  <SidebarTrigger />
                  <span className="font-semibold">AWS Serverless Projects</span>
                </header>
                
                <div className="p-4 md:p-6">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </AuthenticatorWrapper>
      </body>
    </html>
  )
}
