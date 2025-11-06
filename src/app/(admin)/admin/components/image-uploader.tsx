"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ImageUploaderProps {
  bucketName: string; // "projects", "technologies", "cvs"
  currentUrl: string | null;
  onUploadSuccess: (url: string) => void;
  label: string;
}

const supabase = createClient();

export const ImageUploader = ({
  bucketName,
  currentUrl,
  onUploadSuccess,
  label,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }

    setIsUploading(true);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
      toast.error("Error al subir el archivo.", { description: error.message });
      return;
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData.publicUrl) {
      setIsUploading(false);
      toast.error("Error al obtener la URL pública del archivo.");
      return;
    }

    setIsUploading(false);
    onUploadSuccess(publicUrlData.publicUrl);
    setFile(null); // Limpiar el input
    toast.success("Archivo subido exitosamente.");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          accept="image/*,.pdf" // Aceptar imágenes y PDFs (para el CV)
        />
        <Button type="button" onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <Upload size={16} className="mr-2" />
          )}
          Subir
        </Button>
      </div>
      {currentUrl && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Archivo actual:</p>
          {bucketName !== "cvs" ? (
            <img
              src={currentUrl}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded-md border border-border"
            />
          ) : (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ver CV
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Componente especial para la galería de proyectos
export const GalleryUploader = ({
  bucketName,
  onUploadSuccess,
  label,
}: {
  bucketName: string;
  onUploadSuccess: (url: string) => void;
  label: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }

    setIsUploading(true);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      setIsUploading(false);
      toast.error("Error al subir el archivo.", { description: error.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData.publicUrl) {
      setIsUploading(false);
      toast.error("Error al obtener la URL pública del archivo.");
      return;
    }

    setIsUploading(false);
    onUploadSuccess(publicUrlData.publicUrl); // Llama al callback para añadir la URL
    setFile(null); // Limpiar el input
    toast.success("Imagen de galería subida.");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          accept="image/*"
        />
        <Button type="button" onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <Upload size={16} className="mr-2" />
          )}
          Añadir a Galería
        </Button>
      </div>
    </div>
  );
};