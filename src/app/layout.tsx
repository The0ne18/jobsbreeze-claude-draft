import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { SupabaseAuthProvider } from "@/components/providers/SupabaseAuthProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobsBreeze - Contractor Business Management",
  description: "Streamline your contracting business with easy-to-use estimates, invoices, and client management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SupabaseAuthProvider>
            <AuthProvider>
              <NextAuthProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </NextAuthProvider>
            </AuthProvider>
          </SupabaseAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
