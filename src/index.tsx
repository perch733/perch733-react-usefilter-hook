"use client";

import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";

/**
 * 🔠 Normaliza texto para facilitar búsquedas:
 * - Convierte a minúsculas
 * - Elimina tildes (á → a)
 * - Elimina signos de puntuación
 * - Quita espacios sobrantes
 */

/** 🔠 Elimina tildes, signos, y pasa todo a minúsculas */
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD") // separa letras con tildes en componentes
    .replace(/[\u0300-\u036f]/g, "") // elimina los diacríticos (tildes)
    .replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!]/g, "") // elimina signos
    .toLowerCase()
    .trim();
}

/**
 * ────────────────────────────────────────────────────────────────
 * 📌 useFilter — Hook reutilizable para filtrar listas de datos
 * ────────────────────────────────────────────────────────────────
 *
 * ✔ Permite filtrar un array (data) según un campo específico (key)
 * ✔ Devuelve:
 *    - filterText → texto escrito por el usuario (raw)
 *    - filteredData → lista filtrada
 *    - error → componente mostrado cuando no hay resultados
 *    - handleFilterChange → manejador para input de búsqueda
 *
 * @template T Tipo genérico del array a filtrar
 *
 * @param {T[]} data
 *        Lista completa de objetos que se desea filtrar
 *
 * @param {keyof T} key
 *        Propiedad del objeto que se usará para filtrar (ej: "title")
 *
 * @param {React.ReactNode} errorComponent
 *        Componente mostrado si no se encuentran resultados
 *
 * @returns {{
 *   filterText: string,
 *   filteredData: T[],
 *   error: React.ReactNode,
 *   handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
 * }}
 *
 * @Error
 *  Se activa cuando:
 *  - El usuario escribe algo
 *  - No existen resultados coincidentes
 *
 *  Puedes usarlo para mostrar:
 *  <p>No se encontró nada</p>
 *
 * ────────────────────────────────────────────────────────────────
 */

type UseFilterReturn<T> = {
  filterText: string;
  filteredData: T[];
  error: React.ReactNode;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useFilter = <T,>(
  data: T[],
  key: keyof T,
  errorComponent: React.ReactNode
): UseFilterReturn<T> => {
  const [filterText, setFilterText] = useState<string>("");

  /** Maneja el texto que escribe el usuario en el input */
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  /** Filtra la lista de forma eficiente usando useMemo */
  const { filteredData, error } = useMemo(() => {
    // Si no hay texto, devolvemos todo sin error
    if (!filterText) {
      return { filteredData: data, error: null };
    }

    const searchText = normalizarTexto(filterText);
    
    const filtered = data.filter((item) => {
      const valorCampo = String(item[key]);
      return normalizarTexto(valorCampo).includes(searchText);
    });

    return {
      filteredData: filtered,
      error: filtered.length === 0 ? errorComponent : null
    };
  }, [data, filterText, key, errorComponent]);

  return {
    filterText,
    filteredData,
    error,
    handleFilterChange,
  };
};
