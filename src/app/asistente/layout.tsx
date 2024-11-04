import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import 'regenerator-runtime/runtime';

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
      <body className={`flex min-h-screen font-segoe-ui antialiased ${inter.className}`}>
        <Sidebar />
        <main className="flex-1 h-full p-6 m-6">

          {children}

        </main>
      </body>
    </html>
  );
}