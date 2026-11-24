"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Star,
  History,
  Gauge,
  LayoutDashboard,
  Globe,
  Monitor,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Service } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import { ArrayInput } from "@/app/(admin)/admin/components/array-input";

const supabase = createClient();

// Claves de ícono que entiende el sitio público (ver services.tsx)
const iconOptions: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "history", label: "Modernización", Icon: History },
  { value: "gauge", label: "Optimización", Icon: Gauge },
  {
    value: "layout-dashboard",
    label: "Sistemas a medida",
    Icon: LayoutDashboard,
  },
  { value: "globe", label: "Webs", Icon: Globe },
  { value: "monitor", label: "Escritorio", Icon: Monitor },
  { value: "wrench", label: "Genérico", Icon: Wrench },
];

const DEFAULT_ICON = "wrench";

// Componente estático (fuera del render) para mostrar el ícono de una clave.
function ServiceIcon({
  iconKey,
  size = 20,
}: {
  iconKey: string | undefined;
  size?: number;
}) {
  switch (iconKey) {
    case "history":
      return <History size={size} />;
    case "gauge":
      return <Gauge size={size} />;
    case "layout-dashboard":
      return <LayoutDashboard size={size} />;
    case "globe":
      return <Globe size={size} />;
    case "monitor":
      return <Monitor size={size} />;
    default:
      return <Wrench size={size} />;
  }
}

export const ServicesAdmin = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true });
    if (data) setItems(data);
    if (error) {
      console.error("Error fetching services:", error);
      toast.error("Error al cargar servicios", {
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar servicio", { description: error.message });
    } else {
      toast.success("Servicio borrado exitosamente");
      fetchData();
    }
  };

  const openModal = (item: Service | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            order: (items.length + 1) * 10,
            icon: DEFAULT_ICON,
            featured: false,
            title_es: "",
            title_en: "",
            description_es: "",
            description_en: "",
            items_es: [],
            items_en: [],
          },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const itemToSave = {
      ...editingItem,
      order: Number(editingItem.order) || 0,
      icon: editingItem.icon || DEFAULT_ICON,
      featured: Boolean(editingItem.featured),
      items_es: editingItem.items_es || [],
      items_en: editingItem.items_en || [],
    };

    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("services")
            .update(itemToSave)
            .eq("id", editingItem.id)
            .select()
        : await supabase.from("services").insert(itemToSave).select();

      if (error) throw error;
      return data;
    };

    toast.promise(saveOperation(), {
      loading: "Guardando servicio...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Servicio guardado exitosamente";
      },
      error: (err) => `Error al guardar: ${err.message}`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleArrayChange = (
    name: "items_es" | "items_en",
    values: string[],
  ) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [name]: values });
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, movedItem);

    // Se envía la fila completa: title_es/title_en son NOT NULL sin default.
    const updates = newItems.map((item, idx) => ({
      ...item,
      id: item.id,
      order: (idx + 1) * 10,
    }));

    const { error } = await supabase.from("services").upsert(updates);
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
        <CardTitle>Servicios</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Servicio
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Orden</th>
                <th className="p-2 text-left">Ícono</th>
                <th className="p-2 text-left">Título (ES)</th>
                <th className="p-2 text-left">Destacado</th>
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
                  <td className="p-2" title={item.icon}>
                    <ServiceIcon iconKey={item.icon} />
                  </td>
                  <td className="p-2">{item.title_es}</td>
                  <td className="p-2">
                    {item.featured ? (
                      <Star
                        size={16}
                        className="text-primary fill-primary"
                        aria-label="Destacado"
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
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
              {editingItem?.id ? "Editar" : "Crear"} Servicio
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
                <Label htmlFor="icon">Ícono</Label>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
                    <ServiceIcon iconKey={editingItem?.icon} />
                  </div>
                  <Select
                    name="icon"
                    value={editingItem?.icon || DEFAULT_ICON}
                    onValueChange={(value) => {
                      setEditingItem((prev) => ({
                        ...prev,
                        icon: value,
                      }));
                    }}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Selecciona un ícono" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(({ value, label, Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={Boolean(editingItem?.featured)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setEditingItem((prev) => ({ ...prev, featured: checked }));
                }}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="featured">Destacar esta tarjeta</Label>
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

            <ArrayInput
              label="Qué incluye (ES)"
              values={editingItem?.items_es || []}
              onChange={(values) => handleArrayChange("items_es", values)}
              placeholder="Añadir elemento..."
            />

            <ArrayInput
              label="Qué incluye (EN)"
              values={editingItem?.items_en || []}
              onChange={(values) => handleArrayChange("items_en", values)}
              placeholder="Add item..."
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
