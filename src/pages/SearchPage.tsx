import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../store/store";
import {
  setLoading,
  setSearchResults,
  setError,
  setSearchQuery,
  setCurrentPage,
} from "../store/animeSlice";
import debounce from "lodash.debounce";
import AnimeCard from "../components/AnimeCard"; 
import Pagination from "../components/Pagination"; 
import { searchAnime } from "../api/jikanApi"; 

const DEBOUNCE_TIME = 250;
let abortController: AbortController | null = null; 

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    searchResults,
    isLoading,
    error,
    searchQuery,
    currentPage,
    lastPage,
  } = useSelector((state: RootState) => state.anime);
  const performSearch = useCallback(
    async (query: string, page: number) => {
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      if (!query.trim()) {
        dispatch(
          setSearchResults({
            data: [],
            pagination: {
              current_page: 1,
              last_visible_page: 1,
              items: { total: 0 },
            },
          })
        );
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
    const data = await searchAnime(query, page, abortController.signal);
    dispatch(setSearchResults(data));
  } catch (err) {

    if (err instanceof Error && err.name === 'CanceledError' || err instanceof Error && err.message === 'AbortError') { 
        
        console.log('Request aborted (ignored):', query);
        return; 
    }
    
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";

    console.error("Search error (fatal):", errorMessage);
    dispatch(setError(`Gagal memuat hasil: ${errorMessage}`)); 
    dispatch(setSearchResults({ data: [], pagination: { current_page: 1, last_visible_page: 1, items: { total: 0 } } }));
  }
    },
    [dispatch]
  );

  // --- Debounce untuk Input Pencarian ---
  const debouncedSearch = useMemo(() => {
    const handler = (query: string) => {
      dispatch(setCurrentPage(1));
      performSearch(query, 1);
    };

    return debounce(handler, DEBOUNCE_TIME);
  }, [performSearch, dispatch]);

  // --- Handler Input ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    dispatch(setSearchQuery(newQuery));
    debouncedSearch(newQuery);
  };

  // --- Handler Paginasi ---
  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
    performSearch(searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage, performSearch]); 

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
      debouncedSearch.cancel(); 
    };
  }, [debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Cari Anime..."
        value={searchQuery}
        onChange={handleInputChange}
        className="w-full p-3 mb-6 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
      />

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-center text-xl">Memuat hasil...</p>
      ) : searchResults.length === 0 && searchQuery.length > 0 ? (
        <p className="text-center text-xl text-gray-500">
          Tidak ada hasil untuk "{searchQuery}". Coba kata kunci lain.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;
