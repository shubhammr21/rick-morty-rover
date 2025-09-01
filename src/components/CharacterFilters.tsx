
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { CharacterFilters } from '@/lib/api';

interface CharacterFiltersProps {
  filters: CharacterFilters;
  onFiltersChange: (filters: CharacterFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const CharacterFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  isLoading = false 
}: CharacterFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<CharacterFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof CharacterFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    onFiltersChange(localFilters);
    onSearch();
  };

  const handleClear = () => {
    const emptyFilters: CharacterFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onSearch();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value && value.length > 0);

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Search & Filter</h3>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name-search">Name</Label>
            <div className="relative">
              <Input
                id="name-search"
                placeholder="Search by name..."
                value={localFilters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={localFilters.status || ''} 
              onValueChange={(value) => handleFilterChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="alive">Alive</SelectItem>
                <SelectItem value="dead">Dead</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Species</Label>
            <Select 
              value={localFilters.species || ''} 
              onValueChange={(value) => handleFilterChange('species', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All species</SelectItem>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="alien">Alien</SelectItem>
                <SelectItem value="humanoid">Humanoid</SelectItem>
                <SelectItem value="robot">Robot</SelectItem>
                <SelectItem value="cronenberg">Cronenberg</SelectItem>
                <SelectItem value="disease">Disease</SelectItem>
                <SelectItem value="poopybutthole">Poopybutthole</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select 
              value={localFilters.gender || ''} 
              onValueChange={(value) => handleFilterChange('gender', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="genderless">Genderless</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="portal-glow"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CharacterFiltersComponent;
