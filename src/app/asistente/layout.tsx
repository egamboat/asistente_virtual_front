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
      <div className={`flex min-h-screen font-segoe-ui antialiased ${inter.className}`}>
          <Sidebar />
          <div className="flex-1 transition-all duration-300">
            <div className="p-4 mx-2 mt-6 md:m-6">
              {children}
            </div>
          </div>
      </div>
  );
}
