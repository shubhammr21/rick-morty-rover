import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, MapPin, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CharacterDetails = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();

  const {
    data: character,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => api.getCharacter(Number(characterId)),
    retry: 2,
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Refreshed!",
        description: "Character details updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh character details.",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-destructive text-xl mb-4">Character not found</div>
        <Button onClick={() => navigate('/')} variant="outline">
          Back to Characters
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span>Loading character details...</span>
        </div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  const statusVariant = 
    character.status === 'Alive' ? 'default' : 
    character.status === 'Dead' ? 'destructive' : 
    'secondary';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={goBack}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Characters
        </Button>
        
        <Button
          onClick={handleRefresh}
          disabled={isFetching}
          variant="outline"
          size="sm"
          className="portal-glow"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Character details card */}
      <Card className="overflow-hidden">
        <div className="md:flex">
          {/* Character image */}
          <div className="md:w-1/3">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover min-h-96"
            />
          </div>

          {/* Character info */}
          <div className="md:w-2/3 p-6">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    {character.name}
                  </CardTitle>
                  <Badge variant={statusVariant} className="mb-4">
                    {character.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-0 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Species</h3>
                  <p className="text-muted-foreground">{character.species}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Gender</h3>
                  <p className="text-muted-foreground">{character.gender}</p>
                </div>
                
                {character.type && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Type</h3>
                    <p className="text-muted-foreground">{character.type}</p>
                  </div>
                )}
              </div>

              {/* Location info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Current Location</h3>
                </div>
                <p className="text-muted-foreground pl-7">{character.location.name}</p>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Origin</h3>
                </div>
                <p className="text-muted-foreground pl-7">{character.origin.name}</p>
              </div>

              {/* Episodes */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Episodes</h3>
                <p className="text-muted-foreground">
                  Appeared in {character.episode.length} episode{character.episode.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Created date */}
              <div className="flex items-center space-x-2 pt-4 border-t border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Created: {new Date(character.created).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CharacterDetails;