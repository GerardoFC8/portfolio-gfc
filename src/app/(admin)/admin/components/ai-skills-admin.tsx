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
import { AISkill } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import { ImageUploader } from "@/app/(admin)/admin/components/image-uploader";

const supabase = createClient();

export const AISkillsAdmin = () => {
  const [items, setItems] = useState<AISkill[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<AISkill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("ai_skills")
      .select("*")
      .order("order", { ascending: true });
    if (data) setItems(data);
    if (error) {
      console.error("Error fetching ai_skills:", error);
      toast.error("Error al cargar habilidades de IA", {
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ai_skills").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar habilidad", { description: error.message });
    } else {
      toast.success("Habilidad borrada exitosamente");
      fetchData();
    }
  };

  const openModal = (item: AISkill | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            order: (items.length + 1) * 10,
            name: "",
            logo_url: "",
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

    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("ai_skills")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select()
        : await supabase.from("ai_skills").insert(itemToSave).select();

      if (error) throw error;
      return data;
    };

    toast.promise(saveOperation(), {
      loading: "Guardando habilidad...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Habilidad guardada exitosamente";
      },
      error: (err) => `Error al guardar: ${err.message}`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, movedItem);

    const updates = newItems.map((item, idx) => ({
      ...item,
      id: item.id,
      order: (idx + 1) * 10,
    }));

    const { error } = await supabase.from("ai_skills").upsert(updates);
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
        <CardTitle>Habilidades con Agentes de IA</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Habilidad
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
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
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
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Button>
                  </td>
                  <td className="p-2">
                    {/* Admin-only preview thumbnail; no LCP benefit. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
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
              {editingItem?.id ? "Editar" : "Crear"} Habilidad de IA
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
            <ImageUploader
              label="Logo"
              bucketName="ai_skills"
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
