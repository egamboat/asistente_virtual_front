import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import 'remixicon/fonts/remixicon.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asistente Virtual",
  description: "Asistente Vitual para Docentes de UNEMI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`min-h-screen font-segoe-ui antialiased ${inter.className}`}>
        <ToastContainer />

        <main className="">
          {children}
        </main>
      </body>

    </html>
  );
}
