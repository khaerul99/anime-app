import axios from "axios";
import { type Anime } from "../store/animeSlice";

const BASE_URL = "https://api.jikan.moe/v4";

interface SearchResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

interface DetailResponse {
  data: Anime;
}

/**
 * Mencari Anime
 * @param query Kata kunci pencarian.
 * @param page Halaman saat ini.
 * @param signal AbortSignal untuk membatalkan permintaan.
 * @returns Data hasil pencarian dan paginasi.
 */

export const searchAnime = async (
  query: string,
  page: number,
  signal: AbortSignal
): Promise<SearchResponse> => {
  const url = `${BASE_URL}/anime?q=${encodeURIComponent(
    query
  )}&page=${page}&limit=20`;


  try {
    const response = await axios.get<SearchResponse>(url, { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("AbortError"); 
    }

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        throw new Error("API Rate Limit terlampaui. Coba lagi sebentar.");
      }
    }
    throw new Error("Gagal mengambil data dari Jikan API.");
  }
};

/**
 * Mengambil detail anime berdasarkan ID
 * @param id MAL ID dari anime.
 * @returns Data anime lengkap.
 */

export const getAnimeById = async (id: number): Promise<Anime> => {
  const url = `${BASE_URL}/anime/${id}/full`;

  try {
    const response = await axios.get<DetailResponse>(url);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil data.";
    throw new Error(`Gagal mengambil detail anime. Detail: ${errorMessage}`);
  }
};
