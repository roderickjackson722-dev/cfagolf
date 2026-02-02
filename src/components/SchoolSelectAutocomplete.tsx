import { useState, useRef, useEffect } from 'react';
import { useAllColleges } from '@/hooks/useColleges';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, X, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolSelectAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCollegeSelect?: (collegeId: string | null, collegeName: string) => void;
  selectedCollegeId?: string | null;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  allowCustom?: boolean;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SchoolSelectAutocomplete({
  value,
  onChange,
  onCollegeSelect,
  selectedCollegeId,
  placeholder = "Search colleges...",
  label = "School",
  showLabel = true,
  allowCustom = true,
  customValue = '',
  onCustomChange,
  disabled = false,
  className,
}: SchoolSelectAutocompleteProps) {
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
    college.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    college.state.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 8) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(newValue.length >= 2);
    // Clear college selection when typing
    if (onCollegeSelect) {
      onCollegeSelect(null, newValue);
    }
  };

  const handleSuggestionClick = (college: { id: string; name: string }) => {
    setInputValue(college.name);
    onChange(college.name);
    if (onCollegeSelect) {
      onCollegeSelect(college.id, college.name);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    if (onCollegeSelect) {
      onCollegeSelect(null, '');
    }
    inputRef.current?.focus();
  };

  const selectedCollege = selectedCollegeId 
    ? colleges?.find(c => c.id === selectedCollegeId) 
    : null;

  return (
    <div ref={wrapperRef} className={cn("relative space-y-2", className)}>
      {showLabel && <Label>{label}</Label>}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          className="pl-9 pr-8"
          disabled={disabled}
        />
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected College Preview */}
      {selectedCollege && (
        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-primary/20">
          {selectedCollege.logo_url ? (
            <img 
              src={selectedCollege.logo_url} 
              alt="" 
              className="w-6 h-6 object-contain rounded"
            />
          ) : (
            <GraduationCap className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">{selectedCollege.name}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {selectedCollege.division}
          </Badge>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((college) => (
            <button
              key={college.id}
              type="button"
              onClick={() => handleSuggestionClick(college)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b border-border/50 last:border-0",
                selectedCollegeId === college.id && "bg-primary/10"
              )}
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-center text-muted-foreground text-sm">
          No colleges found matching "{inputValue}"
          {allowCustom && (
            <p className="text-xs mt-1">You can use this as a custom school name</p>
          )}
        </div>
      )}

      {/* Custom school option */}
      {allowCustom && onCustomChange && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter custom
              </span>
            </div>
          </div>
          <Input
            placeholder="Custom school name..."
            value={customValue}
            onChange={(e) => {
              onCustomChange(e.target.value);
              if (e.target.value && onCollegeSelect) {
                onCollegeSelect(null, '');
                setInputValue('');
                onChange('');
              }
            }}
            disabled={!!selectedCollegeId || disabled}
          />
        </>
      )}
    </div>
  );
}
