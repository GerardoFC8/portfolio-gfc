"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Hero } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { ImageUploader } from "@/app/(admin)/admin/components/image-uploader";

const supabase = createClient();

export const HeroAdmin = () => {
  const [heroData, setHeroData] = useState<Hero | null>(null);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .limit(1)
      .single(); // Asumimos que solo hay una fila
    if (data) setHeroData(data);
    if (error) {
      console.error("Error fetching hero:", error);
      toast.error("Error al cargar sección Hero", {
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroData) return;

    // --- INICIO DE LA CORRECCIÓN DE PROMESA ---
    const saveOperation = async () => {
      const { data, error } = await supabase
        .from("hero")
        .update(heroData)
        .eq("id", heroData.id)
        .select();

      if (error) {
        throw error;
      }
      return data;
    };

    toast.promise(saveOperation(), {
      loading: "Guardando...",
      success: "Sección Hero actualizada",
      error: (err) => `Error al guardar: ${err.message}`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!heroData) return;
    const { name, value } = e.target;
    setHeroData({ ...heroData, [name]: value });
  };

  const handleUploadSuccess = (url: string) => {
    if (!heroData) return;
    setHeroData({ ...heroData, cv_url: url });
  };

  if (!heroData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sección Hero</CardTitle>
        </CardHeader>
        <CardContent>Cargando...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSave}>
        <CardHeader>
          <CardTitle>Sección Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título (Tu Nombre)</Label>
              <Input
                id="title"
                name="title"
                value={heroData.title}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting_es">Saludo (ES)</Label>
              <Input
                id="greeting_es"
                name="greeting_es"
                value={heroData.greeting_es}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting_en">Saludo (EN)</Label>
              <Input
                id="greeting_en"
                name="greeting_en"
                value={heroData.greeting_en}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle_es">Subtítulo (ES)</Label>
            <Textarea
              id="subtitle_es"
              name="subtitle_es"
              value={heroData.subtitle_es}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle_en">Subtítulo (EN)</Label>
            <Textarea
              id="subtitle_en"
              name="subtitle_en"
              value={heroData.subtitle_en}
              onChange={handleChange}
            />
          </div>
          <ImageUploader
            label="Subir CV (PDF)"
            bucketName="cvs" // Asegúrate de que este bucket exista en Supabase
            currentUrl={heroData.cv_url}
            onUploadSuccess={handleUploadSuccess}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">Guardar Cambios de Hero</Button>
        </CardFooter>
      </form>
    </Card>
  );
};