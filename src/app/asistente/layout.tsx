import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import 'regenerator-runtime/runtime';
import { Providers } from '../providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nomi",
  description: "Asistente Vitual para Docentes de UNEMI",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`flex h-full font-segoe-ui antialiased ${inter.className}`}>
          <Sidebar />
          <main className="flex-1 transition-all duration-300">
            <div className="p-4 m-6">
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}
