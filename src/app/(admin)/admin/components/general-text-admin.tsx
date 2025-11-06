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
import { Edit, PlusCircle } from "lucide-react";
import { GeneralText } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";

const supabase = createClient();

export const GeneralTextAdmin = () => {
  const [texts, setTexts] = useState<GeneralText[]>([]);
  const [editingItem, setEditingItem] = useState<GeneralText | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("general_text")
      .select("*")
      .order("key", { ascending: true });
    if (data) setTexts(data);
    if (error) {
      console.error("Error fetching general_text:", error);
      toast.error("Error al cargar textos", { description: error.message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("general_text").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar texto", { description: error.message });
    } else {
      toast.success("Texto borrado exitosamente");
      fetchData();
    }
  };

  const openModal = (item: GeneralText | null) => {
    setEditingItem(
      item ? { ...item } : { id: "", key: "", text_es: "", text_en: "" }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const itemToSave = {
      key: editingItem.key,
      text_es: editingItem.text_es,
      text_en: editingItem.text_en,
    };

    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("general_text")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select()
        : await supabase
            .from("general_text")
            .insert(itemToSave)
            .select();

      if (error) {
        throw error;
      }
      return data;
    };

    toast.promise(saveOperation(), {
      loading: "Guardando...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Texto guardado exitosamente";
      },
      error: (err) => {
        return `Error al guardar: ${err.message}`;
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Textos Generales</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Texto
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Clave (Key)</th>
                <th className="p-2 text-left">Español</th>
                <th className="p-2 text-left">Inglés</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {texts.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 font-mono text-sm">{item.key}</td>
                  <td className="p-2">{item.text_es}</td>
                  <td className="p-2">{item.text_en}</td>
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
              {editingItem?.id ? "Editar" : "Crear"} Texto
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="key">Clave (Key)</Label>
              <Input
                id="key"
                name="key"
                value={editingItem?.key}
                onChange={handleChange}
                placeholder="ej. nav_projects"
                required
                disabled={!!editingItem?.id} // No se puede cambiar la key al editar
              />
            </div>
            <div>
              <Label htmlFor="text_es">Texto (ES)</Label>
              <Textarea
                id="text_es"
                name="text_es"
                value={editingItem?.text_es}
                onChange={handleChange}
                placeholder="Texto en español"
                required
              />
            </div>
            <div>
              <Label htmlFor="text_en">Texto (EN)</Label>
              <Textarea
                id="text_en"
                name="text_en"
                value={editingItem?.text_en}
                onChange={handleChange}
                placeholder="Texto en inglés"
                required
              />
            </div>
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