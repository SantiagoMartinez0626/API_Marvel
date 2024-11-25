export interface Favorite {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  characterId: number;
} 