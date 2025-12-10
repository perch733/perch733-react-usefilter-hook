import { useState, useEffect } from "react";
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
 *    - filterText → texto escrito por el usuario
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
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [error, setError] = useState<React.ReactNode>(null);

  /** Maneja el texto que escribe el usuario en el input */
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = normalizarTexto(e.target.value);
    setFilterText(searchText);
  };

  /** Filtra la lista cada vez que cambia el texto o los datos */
  useEffect(() => {
    const filteredItems = data.filter((item) => {
      const valorCampo = String(item[key]);
      return normalizarTexto(valorCampo).includes(filterText);
    });

    setFilteredData(filteredItems);

    if (filteredItems.length === 0 && filterText !== "") {
      setError(errorComponent);
    } else {
      setError(null);
    }
  }, [data, filterText, key]);

  return {
    filterText,
    filteredData,
    error,
    handleFilterChange,
  };
};
