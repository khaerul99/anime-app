import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// --- Tipe Data (Sesuaikan dengan respons Jikan API yang sebenarnya) ---
// Tipe dasar untuk satu objek Anime (ambil hanya properti yang Anda butuhkan)
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
  // ... properti lain yang relevan untuk Detail Page
};

// Tipe untuk state slice Anime
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
    // Dipanggil saat pencarian dimulai (untuk menampilkan loading)
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      state.error = null; // Hapus error saat memulai pencarian baru
    },
    // Menyimpan query pencarian
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    // Menyimpan hasil pencarian dan data paginasi
    setSearchResults(state, action: PayloadAction<{ data: Anime[]; pagination: { current_page: number; last_visible_page: number; items: { total: number } } }>) {
      state.searchResults = action.payload.data;
      state.currentPage = action.payload.pagination.current_page;
      state.lastPage = action.payload.pagination.last_visible_page;
      state.totalItems = action.payload.pagination.items.total;
      state.isLoading = false;
    },
    // Menyimpan anime yang dipilih untuk Halaman Detail
    setSelectedAnime(state, action: PayloadAction<Anime | null>) {
      state.selectedAnime = action.payload;
    },
    // Menyimpan error (misalnya: gagal jaringan)
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Mengubah halaman saat paginasi (ini akan memicu API call di komponen)
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
      // Atur loading di komponen SearchPage saat halaman berubah
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