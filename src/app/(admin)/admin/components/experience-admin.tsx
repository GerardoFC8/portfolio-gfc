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
import { Experience } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import { ArrayInput } from "@/app/(admin)/admin/components/array-input";

const supabase = createClient();

export const ExperienceAdmin = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order", { ascending: true });
    if (data) setExperience(data);
    if (error) {
      console.error("Error fetching experience:", error);
      toast.error("Error al cargar experiencia", {
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar experiencia", {
        description: error.message,
      });
    } else {
      toast.success("Experiencia borrada exitosamente");
      fetchData();
    }
  };

  const openModal = (item: Experience | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            order: (experience.length + 1) * 10,
            position_es: "",
            position_en: "",
            company: "",
            period_es: "",
            period_en: "",
            description_items_es: [],
            description_items_en: [],
            technologies: [],
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
      description_items_es: editingItem.description_items_es || [],
      description_items_en: editingItem.description_items_en || [],
      technologies: editingItem.technologies || [],
    };

    // --- INICIO DE LA CORRECCIÓN ---
    // 1. Definimos una función async que maneja la lógica de guardado.
    const saveOperation = async () => {
      // Usamos 'let' para la respuesta
      const { data, error } = editingItem.id
        ? await supabase
            .from("experience")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select() // .select() es opcional pero bueno para consistencia
        : await supabase
            .from("experience")
            .insert(itemToSave)
            .select();
      
      // 2. Si Supabase devuelve un error, lo lanzamos (throw)
      //    Esto hará que la promesa de toast.promise se 'rechace'.
      if (error) {
        throw error;
      }
      
      // 3. Si todo va bien, devolvemos la data (o nada).
      return data;
    };

    // 4. Pasamos la *invocación* de nuestra función a toast.promise.
    //    saveOperation() devuelve una Promise real que toast.promise entiende.
    toast.promise(saveOperation(), {
      loading: "Guardando experiencia...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Experiencia guardada exitosamente";
      },
      error: (err) => `Error al guardar: ${err.message}`, // Aquí 'err' es el error que lanzamos
    });
    // --- FIN DE LA CORRECCIÓN ---
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleArrayChange = (
    name: "technologies" | "description_items_es" | "description_items_en",
    values: string[]
  ) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [name]: values });
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= experience.length) return;

    const newExperience = [...experience];
    const [movedItem] = newExperience.splice(index, 1);
    newExperience.splice(newIndex, 0, movedItem);

    const updates = newExperience.map((item, idx) => ({
      id: item.id,
      order: (idx + 1) * 10,
    }));

    const { error } = await supabase.from("experience").upsert(updates);
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
        <CardTitle>Experiencia</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Experiencia
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Orden</th>
                <th className="p-2 text-left">Cargo (ES)</th>
                <th className="p-2 text-left">Empresa</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {experience.map((item, index) => (
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
                      disabled={index === experience.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Button>
                  </td>
                  <td className="p-2">{item.position_es}</td>
                  <td className="p-2">{item.company}</td>
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
              {editingItem?.id ? "Editar" : "Crear"} Experiencia
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
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={editingItem?.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position_es">Cargo (ES)</Label>
                <Input
                  id="position_es"
                  name="position_es"
                  value={editingItem?.position_es}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position_en">Cargo (EN)</Label>
                <Input
                  id="position_en"
                  name="position_en"
                  value={editingItem?.position_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period_es">Periodo (ES)</Label>
                <Input
                  id="period_es"
                  name="period_es"
                  value={editingItem?.period_es}
                  onChange={handleChange}
                  placeholder="ej. 2022 - Presente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period_en">Periodo (EN)</Label>
                <Input
                  id="period_en"
                  name="period_en"
                  value={editingItem?.period_en}
                  onChange={handleChange}
                  placeholder="ej. 2022 - Present"
                />
              </div>
            </div>

            <ArrayInput
              label="Descripciones (ES)"
              values={editingItem?.description_items_es || []}
              onChange={(values) =>
                handleArrayChange("description_items_es", values)
              }
            />

            <ArrayInput
              label="Descripciones (EN)"
              values={editingItem?.description_items_en || []}
              onChange={(values) =>
                handleArrayChange("description_items_en", values)
              }
            />

            <ArrayInput
              label="Tecnologías"
              values={editingItem?.technologies || []}
              onChange={(values) => handleArrayChange("technologies", values)}
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