import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { api, Character } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const CharacterList = () => {
  const navigate = useNavigate();
  
  // Get current page from URL or default to 1
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = Number(urlParams.get('page')) || 1;
    setCurrentPage(pageFromUrl);
  }, []);

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['characters', currentPage],
    queryFn: () => api.getCharacters(currentPage),
    retry: 2,
  });

  const columns: ColumnDef<Character>[] = [
    {
      accessorKey: 'image',
      header: '',
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.name}
          className="w-16 h-16 rounded-lg object-cover ring-2 ring-primary/20"
        />
      ),
      size: 80,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const variant = 
          status === 'Alive' ? 'default' : 
          status === 'Dead' ? 'destructive' : 
          'secondary';
        
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'species',
      header: 'Species',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.species}</span>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.location.name}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Refreshed!",
        description: "Character list updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh character list.",
        variant: "destructive",
      });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Update URL with new page
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url);
  };

  const handleRowClick = (character: Character) => {
    navigate(`/character/${character.id}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-destructive text-xl mb-4">Error loading characters</div>
        <Button onClick={handleRefresh} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Characters</h2>
          <p className="text-muted-foreground">
            Showing page {currentPage} of {data?.info.pages || 0}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={isFetching}
          variant="outline"
          className="portal-glow"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Character table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-medium text-muted-foreground"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading characters...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {data.info.count} characters
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!data.info.prev || isFetching}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm bg-muted rounded">
              {currentPage} / {data.info.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!data.info.next || isFetching}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterList;