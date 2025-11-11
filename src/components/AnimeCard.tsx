import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedAnime, type Anime } from '../store/animeSlice';
import { type AppDispatch } from '../store/store';

interface AnimeCardProps {
  anime: Anime; 
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCardClick = () => {
    dispatch(setSelectedAnime(anime));
  };

  return (
    <Link 
      to={`/anime/${anime.mal_id}`} 
      onClick={handleCardClick}
      className="block bg-white w-80 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <div className="relative h-64  overflow-hidden">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {anime.score && (
          <div className="absolute top-2 left-2 bg-[#3c6e71] text-white text-sm font-bold px-3 py-1 rounded-full">
            ⭐ {anime.score.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Judul Anime */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors duration-300">
          {anime.title}
        </h3>
        {/* Sinopsis Singkat */}
        <p className="text-blue-600 text-sm line-clamp-3 ">
          {anime.synopsis || 'Tidak ada sinopsis yang tersedia.'}
        </p>
      </div>
    </Link>
  );
};

export default AnimeCard;