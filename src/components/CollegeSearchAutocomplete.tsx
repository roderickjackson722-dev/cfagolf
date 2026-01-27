import { useState, useRef, useEffect } from 'react';
import { useAllColleges } from '@/hooks/useColleges';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollegeSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CollegeSearchAutocomplete({
  value,
  onChange,
  placeholder = "Search colleges..."
}: CollegeSearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { data: colleges } = useAllColleges();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter colleges based on input
  const suggestions = colleges?.filter(college =>
    college.name.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 8) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length >= 2);
  };

  const handleSuggestionClick = (collegeName: string) => {
    setInputValue(collegeName);
    onChange(collegeName);
    setIsOpen(false);
  };

  const handleSearch = () => {
    onChange(inputValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-[200px]">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
            className="pl-10 pr-8"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} variant="default" className="shrink-0">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((college) => (
            <button
              key={college.id}
              onClick={() => handleSuggestionClick(college.name)}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
            >
              {college.logo_url ? (
                <img 
                  src={college.logo_url} 
                  alt="" 
                  className="w-8 h-8 object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {college.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{college.name}</p>
                <p className="text-xs text-muted-foreground">
                  {college.state} • {college.division}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-center text-muted-foreground">
          No colleges found matching "{inputValue}"
        </div>
      )}
    </div>
  );
}
