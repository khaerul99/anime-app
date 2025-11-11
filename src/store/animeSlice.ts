import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  episodes: number | null;
  score: number | null;
};

interface AnimeState {
  searchResults: Anime[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  totalItems: number;
  searchQuery: string;
  selectedAnime: Anime | null;
}

const initialState: AnimeState = {
  searchResults: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  totalItems: 0,
  searchQuery: '',
  selectedAnime: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      state.error = null; 
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSearchResults(state, action: PayloadAction<{ data: Anime[]; pagination: { current_page: number; last_visible_page: number; items: { total: number } } }>) {
      state.searchResults = action.payload.data;
      state.currentPage = action.payload.pagination.current_page;
      state.lastPage = action.payload.pagination.last_visible_page;
      state.totalItems = action.payload.pagination.items.total;
      state.isLoading = false;
    },
    setSelectedAnime(state, action: PayloadAction<Anime | null>) {
      state.selectedAnime = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setLoading,
  setSearchQuery,
  setSearchResults,
  setSelectedAnime,
  setError,
  setCurrentPage,
} = animeSlice.actions;

export default animeSlice.reducer;