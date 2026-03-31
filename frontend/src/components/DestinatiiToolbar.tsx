import type { CategoryFilter } from '../types/destinatii'

type DestinatiiToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  activeCategory: CategoryFilter
  onCategoryChange: (value: CategoryFilter) => void
  chipOrder: CategoryFilter[]
  categoryLabel: Record<CategoryFilter, string>
}

export function DestinatiiToolbar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  chipOrder,
  categoryLabel,
}: DestinatiiToolbarProps) {
  return (
    <div className="destinations-toolbar" aria-label="Căutare și filtre">
      <label className="search" aria-label="Caută destinații">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input
          id="search"
          type="search"
          placeholder="Caută (ex: Orhei, vinărie, Nistru...)"
          autoComplete="off"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="chips" role="group" aria-label="Filtre categorie">
        {chipOrder.map((category) => (
          <button
            key={category}
            className={`chip ${activeCategory === category ? 'active' : ''}`}
            type="button"
            onClick={() => onCategoryChange(category)}
          >
            {categoryLabel[category]}
          </button>
        ))}
      </div>
    </div>
  )
}
