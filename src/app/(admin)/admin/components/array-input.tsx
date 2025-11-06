"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

// Componente para editar arrays de strings (como 'tech' o 'gallery_urls')
export const ArrayInput = ({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue && !values.includes(inputValue)) {
      onChange([...values, inputValue]);
      setInputValue("");
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder || `Añadir ${label.toLowerCase()}...`}
        />
        <Button type="button" onClick={handleAdd}>
          Añadir
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md min-h-10">
        {values.map((value, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
          >
            <span className="text-sm max-w-xs truncate" title={value}>
              {value}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="text-primary hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};