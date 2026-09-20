// SearchBar — text search input with icon
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`search-bar ${className}`}>
    <Search size={16} className="search-icon" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  </div>
);

export default SearchBar;
