# @perch733/react-usefilter-hook

A lightweight and reusable React hook for filtering lists with accent normalization, punctuation removal, and TypeScript support.  
Ideal for search bars, dynamic lists, admin dashboards, e-commerce filters, etc.

---

## 🔥 Features

- 🔠 Removes accents (á → a)
- ✂️ Removes punctuation and special characters
- 🔎 Case-insensitive search
- ⚛️ Fully typed with TypeScript
- 🔁 Auto-updates when `data` changes
- 🔧 Accepts custom error component
- 🧩 Framework-agnostic, works in any React project

---

## 📦 Installation

```sh
npm install @perch733/react-usefilter-hook
```

or

```sh
yarn add @perch733/react-usefilter-hook

```

## 🚀 Usage Example (Basic)

```tsx
import { useFilter } from "@perch733/react-usefilter-hook";

const products = [
  { title: "Cámara Fotográfica" },
  { title: "Microfono" },
  { title: "Cable HDMI" },
];

export default function App() {
  const { filterText, filteredData, handleFilterChange } = useFilter(
    products,
    "title",
    <p>No results found</p>
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search..."
        value={filterText}
        onChange={handleFilterChange}
      />

      <ul>
        {filteredData.map((p, i) => (
          <li key={i}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🎯 Advanced Example

```tsx
const { filterText, filteredData, error, handleFilterChange } = useFilter(
  users,
  "name",
  <div style={{ color: "red" }}>No users found</div>
);

return (
  <>
    <input
      type="text"
      placeholder="Search users"
      value={filterText}
      onChange={handleFilterChange}
    />

    {filteredData.length === 0
      ? error
      : filteredData.map((u) => <p key={u.id}>{u.name}</p>)}
  </>
);
```

## 🧠 API Reference

```tsx
useFilter<T>(data, key, errorComponent);
```

| Param            | Type              | Description                       |
| ---------------- | ----------------- | --------------------------------- |
| `data`           | `T[]`             | Array of objects to filter        |
| `key`            | `keyof T`         | Object field used for filtering   |
| `errorComponent` | `React.ReactNode` | Element displayed when no matches |

## Returns

| Property             | Type                                 | Description                           |
| -------------------- | ------------------------------------ | ------------------------------------- |
| `filterText`         | `string`                             | Current normalized search text        |
| `filteredData`       | `T[]`                                | List filtered according to user input |
| `error`              | `React.ReactNode \| null`            | Error component if no matches         |
| `handleFilterChange` | `(e: ChangeEvent<HTMLInputElement>)` | Input handler                         |

### ⚙️ How filtering works

- This hook automatically:

- Converts text to lowercase

- Removes accents (áéíóú → aeiou)

- Removes punctuation and special characters

- Performs a normalized comparison

- Filters in real time as the user types

### 💡 When to use this hook?

- Product search inputs

- Admin panel filters

- Searchable dropdowns

- User lists

- Blog post search

- Table filtering

- Autocomplete components

## 📁 Project Structure

Your installation will contain:

```

dist/
  ├─ cjs/
  ├─ esm/
  ├─ types/
src/
README.md
```

## 👤 Author / Autor

**Percy Chuzon**
📧 [contacto@percychuzon.com](mailto:contacto@percychuzon.com)
🌐 [https://wwww.percychuzon.com](https://www.percychuzon.com)
