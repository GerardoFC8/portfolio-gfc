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
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, PlusCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Project } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import { ArrayInput } from "@/app/(admin)/admin/components/array-input";
import { ImageUploader, GalleryUploader } from "@/app/(admin)/admin/components/image-uploader";

const supabase = createClient();

export const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true });
    if (data) setProjects(data);
    if (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error al cargar proyectos", { description: error.message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar proyecto", { description: error.message });
    } else {
      toast.success("Proyecto borrado exitosamente");
      fetchData();
    }
  };

  const openModal = (item: Project | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            // Valores por defecto para un nuevo proyecto
            order: (projects.length + 1) * 10,
            title_es: "",
            title_en: "",
            description_es: "",
            description_en: "",
            image_url: "",
            gallery_urls: [],
            tech: [],
            live_url: "",
            github_url: "",
          }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Asegurarse de que los campos numéricos y arrays estén correctos
    const itemToSave = {
      ...editingItem,
      order: Number(editingItem.order) || 0,
      tech: editingItem.tech || [],
      gallery_urls: editingItem.gallery_urls || [],
    };

    // --- INICIO DE LA CORRECCIÓN DE PROMESA ---
    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("projects")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select()
        : await supabase
            .from("projects")
            .insert(itemToSave)
            .select();

      if (error) {
        throw error;
      }
      return data;
    };

    toast.promise(saveOperation(), {
      // --- FIN DE LA CORRECCIÓN DE PROMESA ---
      loading: "Guardando proyecto...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Proyecto guardado exitosamente";
      },
      error: (err) => `Error al guardar: ${err.message}`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleArrayChange = (name: "tech" | "gallery_urls", values: string[]) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [name]: values });
  };

  const handleImageUpload = (url: string) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, image_url: url });
  };

  const handleGalleryUpload = (url: string) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      gallery_urls: [...(editingItem.gallery_urls || []), url],
    });
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const newProjects = [...projects];
    const [movedItem] = newProjects.splice(index, 1);
    newProjects.splice(newIndex, 0, movedItem);

    const updates = newProjects.map((item, idx) => ({
      id: item.id,
      order: (idx + 1) * 10, // Multiplicar por 10 da espacio para inserciones
    }));

    const { error } = await supabase.from("projects").upsert(updates);
    if (error) {
      toast.error("Error al reordenar", { description: error.message });
    } else {
      toast.success("Orden actualizado");
      fetchData();
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Proyectos</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Proyecto
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Orden</th>
                <th className="p-2 text-left">Título (ES)</th>
                <th className="p-2 text-left">Tecnologías</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(index, "down")}
                      disabled={index === projects.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Button>
                  </td>
                  <td className="p-2">{item.title_es}</td>
                  <td className="p-2 text-xs">{item.tech.join(", ")}</td>
                  <td className="p-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openModal(item)}
                    >
                      <Edit size={16} />
                    </Button>
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Editar" : "Crear"} Proyecto
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={editingItem?.order}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_es">Título (ES)</Label>
                <Input
                  id="title_es"
                  name="title_es"
                  value={editingItem?.title_es}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_en">Título (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={editingItem?.title_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_es">Descripción (ES)</Label>
              <Textarea
                id="description_es"
                name="description_es"
                value={editingItem?.description_es}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">Descripción (EN)</Label>
              <Textarea
                id="description_en"
                name="description_en"
                value={editingItem?.description_en}
                onChange={handleChange}
              />
            </div>

            <ImageUploader
              label="Imagen Principal"
              bucketName="projects" // Asegúrate de que este bucket exista
              currentUrl={editingItem?.image_url || null}
              onUploadSuccess={handleImageUpload}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="live_url">URL (En vivo)</Label>
                <Input
                  id="live_url"
                  name="live_url"
                  value={editingItem?.live_url}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">URL (GitHub)</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={editingItem?.github_url}
                  onChange={handleChange}
                />
              </div>
            </div>
            <ArrayInput
              label="Tecnologías"
              values={editingItem?.tech || []}
              onChange={(values) => handleArrayChange("tech", values)}
            />

            <GalleryUploader
              label="Subir a Galería"
              bucketName="projects"
              onUploadSuccess={handleGalleryUpload}
            />
            <ArrayInput
              label="Galería de Imágenes (URLs)"
              values={editingItem?.gallery_urls || []}
              onChange={(values) => handleArrayChange("gallery_urls", values)}
              placeholder="Añadir URL manualmente o subir"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};