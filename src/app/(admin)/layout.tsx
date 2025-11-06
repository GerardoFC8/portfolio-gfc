import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"; // Importa el Toaster

// Este layout es un Server Component que protege la ruta /admin

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ya no necesitamos la lógica de 'pathname' o 'headers'.
  // Si este layout se ejecuta, es porque estamos en '/admin'
  // y SÍ O SÍ debe estar protegido.

  // --- Lógica de protección (siempre se ejecuta) ---
  const supabase = await createClient();

  // 1. Verificar si hay un usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Verificar si el usuario tiene el rol de "admin"
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || roleData?.role !== "admin") {
    // Si no es admin, mostrar error
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">No estás autorizado.</h1>
      </div>
    );
  }

  // 3. Si es admin, renderizar la página de admin
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">{children}</main>
      {/* Añade el Toaster aquí para que las notificaciones funcionen */}
      <Toaster richColors />
    </div>
  );
}