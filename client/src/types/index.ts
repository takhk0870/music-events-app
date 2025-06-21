export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  favorites: number[];
}

export interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  artists: string[];
  price: string;
  scale: string;
  links: Link[];
  genre: string;
  region: string;
  source?: string;
  title?: string;
  venue?: string;
  ticket_price?: string;
  image?: string;
  createdAt?: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  toggleFavorite: (eventId: number) => void;
  artistFavorites: string[];
  toggleArtistFavorite: (artist: string) => void;
  handleEventSubmit: (eventData: Omit<Event, 'id' | 'createdAt'>) => void;
  handleEventDelete: (id: number) => void;
}

export interface EventFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  artists: string[];
  price: string;
  scale: string;
  links: Link[];
  genre: string;
  region: string;
} 