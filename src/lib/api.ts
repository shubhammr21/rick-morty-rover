
// Rick and Morty API types and service
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export type CharactersResponse = ApiResponse<Character>;

export interface CharacterFilters {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

const BASE_URL = 'https://rickandmortyapi.com/api';

export const api = {
  getCharacters: async (page: number = 1, filters: CharacterFilters = {}): Promise<CharactersResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.species) params.append('species', filters.species);
    if (filters.gender) params.append('gender', filters.gender);

    const response = await fetch(`${BASE_URL}/character?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.statusText}`);
    }
    return response.json();
  },

  getCharacter: async (id: number): Promise<Character> => {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch character: ${response.statusText}`);
    }
    return response.json();
  },
};
