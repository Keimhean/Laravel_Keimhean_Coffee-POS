import { useTheme } from '../context/ThemeContext';

interface CategoryFilterProps {
  categories: any[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { dark } = useTheme();
  
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-[#FF9D6F] text-white'
            : dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? 'bg-[#FF9D6F] text-white'
              : dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
