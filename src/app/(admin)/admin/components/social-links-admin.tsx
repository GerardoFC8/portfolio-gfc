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
import { Edit, PlusCircle } from "lucide-react";
import { SocialLink } from "@/app/(admin)/admin/components/admin-types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/app/(admin)/admin/components/delete-confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Mail,
  MessageSquare,
  Link,
  type LucideIcon,
} from "lucide-react"
const supabase = createClient();

export const SocialLinksAdmin = () => {
  const iconOptions: { value: string; label: string; Icon: LucideIcon }[] = [
    { value: "github", label: "GitHub", Icon: Github },
    { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
    { value: "twitter", label: "Twitter", Icon: Twitter },
    { value: "youtube", label: "YouTube", Icon: Youtube },
    { value: "instagram", label: "Instagram", Icon: Instagram },
    { value: "mail", label: "Correo (Mail)", Icon: Mail },
    { value: "messagesquare", label: "Mensaje (Square)", Icon: MessageSquare },
    { value: "link", label: "Otro (Enlace genérico)", Icon: Link },
  ]
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<SocialLink> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("name", { ascending: true });
    if (data) setLinks(data);
    if (error) {
      console.error("Error fetching social_links:", error);
      toast.error("Error al cargar enlaces", { description: error.message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar enlace", { description: error.message });
    } else {
      toast.success("Enlace borrado exitosamente");
      fetchData();
    }
  };

  const openModal = (item: SocialLink | null) => {
    setEditingItem(
      item
        ? { ...item }
        : {
            name: "",
            url: "",
            display_text_es: "",
            display_text_en: "",
            icon_key: "",
          }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const saveOperation = async () => {
      const { data, error } = editingItem.id
        ? await supabase
            .from("social_links")
            .update(editingItem)
            .eq("id", editingItem.id)
            .select()
        : await supabase
            .from("social_links")
            .insert(editingItem)
            .select();

      if (error) {
        throw error;
      }
      return data;
    };

    toast.promise(saveOperation(), {
      loading: "Guardando enlace...",
      success: () => {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        return "Enlace guardado exitosamente";
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

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Redes Sociales y Enlaces</CardTitle>
        <Button onClick={() => openModal(null)} size="sm">
          <PlusCircle size={16} className="mr-2" />
          Añadir Enlace
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2 text-left">Icono (Key)</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {links.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-sm">{item.url}</td>
                  <td className="p-2 font-mono text-sm">{item.icon_key}</td>
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
              {editingItem?.id ? "Editar" : "Crear"} Enlace
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={editingItem?.name}
                  onChange={handleChange}
                  placeholder="ej. LinkedIn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon_key">Icono</Label>
                <Select
                  name="icon_key"
                  value={editingItem?.icon_key || ""}
                  onValueChange={(value) => {
                    setEditingItem((prev) => ({
                      ...prev,
                      icon_key: value,
                    }))
                  }}
                >
                  <SelectTrigger id="icon_key">
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
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={editingItem?.url}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_text_es">Texto (ES)</Label>
              <Input
                id="display_text_es"
                name="display_text_es"
                value={editingItem?.display_text_es}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_text_en">Texto (EN)</Label>
              <Input
                id="display_text_en"
                name="display_text_en"
                value={editingItem?.display_text_en}
                onChange={handleChange}
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