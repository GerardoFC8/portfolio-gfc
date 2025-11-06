"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Technology } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import { ImageUploader } from "@/app/(admin)/admin/components/image-uploader";

const supabase = createClient();

export const TechnologiesAdmin = () => {
  const [tech, setTech] = useState<Technology[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Technology> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("order", { ascending: true });
    if (data) setTech(data);
    if (error) {
      console.error("Error fetching technologies:", error);
      toast.error("Error al cargar tecnologías", {
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("technologies").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar tecnología", {
        description: error.message,
      });
    } else {
      toast.success("Tecnología borrada exitosamente");
      fetchData();
    }
  };

  const openModal = (item: Technology | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            order: (tech.length + 1) * 10,
            name: "",
            logo_url: "",
            category: "knowledge",
          }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const itemToSave = {
      ...editingItem,
      order: Number(editingItem.order) || 0,
    };

    // --- INICIO DE LA CORRECCIÓN ---
    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("technologies")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select()
        : await supabase
            .from("technologies")
            .insert(itemToSave)
            .select();

      if (error) {
        throw error;
      }
      return data;
    };

    toast.promise(saveOperation(), {
      // --- FIN DE LA CORRECCIÓN ---
      loading: "Guardando tecnología...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Tecnología guardada exitosamente";
      },
      error: (err) => `Error al guardar: ${err.message}`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleImageUpload = (url: string) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, logo_url: url });
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tech.length) return;

    const newTech = [...tech];
    const [movedItem] = newTech.splice(index, 1);
    newTech.splice(newIndex, 0, movedItem);

    const updates = newTech.map((item, idx) => ({
      ...item,
      id: item.id,
      order: (idx + 1) * 10,
    }));

    const { error } = await supabase.from("technologies").upsert(updates);
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
        <CardTitle>Tecnologías</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Tecnología
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Orden</th>
                <th className="p-2 text-left">Logo</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Categoría</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tech.map((item, index) => (
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
                      disabled={index === tech.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Button>
                  </td>
                  <td className="p-2">
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Editar" : "Crear"} Tecnología
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={editingItem?.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                name="category"
                value={editingItem?.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="dominant">Dominante</option>
                <option value="knowledge">Conocimiento</option>
              </select>
            </div>
            <ImageUploader
              label="Logo"
              bucketName="technologies" // Asegúrate de que este bucket exista
              currentUrl={editingItem?.logo_url || null}
              onUploadSuccess={handleImageUpload}
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