import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { dark } = useTheme();
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-6 pr-14 py-3.5 rounded-full outline-none transition-colors ${
          dark 
            ? 'bg-gray-800 text-white placeholder-gray-400 border border-gray-700' 
            : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200'
        }`}
      />
      <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full transition-colors ${
        dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
      }`}>
        <Search className={`w-5 h-5 ${dark ? 'text-gray-300' : 'text-gray-600'}`} />
      </button>
    </div>
  );
}
