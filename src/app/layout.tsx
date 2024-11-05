import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import 'remixicon/fonts/remixicon.css'

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
      <body className={`flex min-h-screen font-segoe-ui antialiased ${inter.className}`}>
        <main className="">
            {children}
        </main>
      </body>
    </html>
  );
}
