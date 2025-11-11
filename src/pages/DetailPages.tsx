import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../store/store';
import { setSelectedAnime, setError } from '../store/animeSlice';
import { getAnimeById } from '../api/jikanApi'; // Fungsi API untuk detail

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedAnime = useSelector((state: RootState) => state.anime.selectedAnime);
  const error = useSelector((state: RootState) => state.anime.error);

  useEffect(() => {
    if (!id) {
        navigate('/');
        return;
    }

    const fetchDetail = async () => {
      
        if (selectedAnime && selectedAnime.mal_id === parseInt(id)) {
            return;
        }

       
        try {
           
            dispatch(setSelectedAnime(null)); 
            dispatch(setError(null));
            
            const data = await getAnimeById(parseInt(id));
            dispatch(setSelectedAnime(data));
        }  catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Gagal mengambil detail.";
            console.error("Detail error:", errorMessage);
            dispatch(setError(`Gagal memuat detail: ${errorMessage}`));
        }
    };
    
    fetchDetail();
  }, [id, navigate, dispatch, selectedAnime]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">ERROR: {error}</p>;
  }

  if (!selectedAnime) {
    return <p className="text-center mt-10">Memuat detail anime...</p>;
  }

  if (selectedAnime.mal_id !== parseInt(id!)) {
      return <p className="text-center mt-10">Memuat detail anime...</p>;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-4">{selectedAnime.title}</h1>
      <div className="md:flex">
        <img
          src={selectedAnime.images.jpg.image_url}
          alt={selectedAnime.title}
          className="w-full md:w-1/3 object-cover rounded-lg shadow-md mb-4 md:mb-0 md:mr-6"
        />
        <div className="md:w-2/3">
          <p className="text-xl mb-4">
            **Skor:** {selectedAnime.score || 'N/A'} | **Episode:** {selectedAnime.episodes || 'N/A'}
          </p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Sinopsis</h2>
          <p className="text-gray-700 leading-relaxed">{selectedAnime.synopsis}</p>
          
        </div>
      </div>
      <button 
        onClick={() => navigate('/')} 
        className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        Kembali ke Pencarian
      </button>
    </div>
  );
};

export default DetailPage;