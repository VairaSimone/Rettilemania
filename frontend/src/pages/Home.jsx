import React, { useEffect, useState } from 'react';
import api from '../services/api.js'; // Usa l'API con gli interceptor
import ReptileForm from '../components/ReptileForm.jsx';
import { selectUser } from '../features/userSlice.jsx';
import { useSelector } from 'react-redux';

const Home = () => {
  const [reptiles, setReptiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);  

  useEffect(() => {
    const fetchReptiles = async () => {
      try {
        const { data } = await api.get(`/reptile/${user?._id}/allreptile`); 
        setReptiles(data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento dei rettili');
        console.log(err)
        setLoading(false);
      }
    };

    fetchReptiles();
  }, []);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;

  // Funzione per eliminare un rettile
  const deleteReptile = async (id) => {
    try {
      await api.delete(`/reptile/${id}`);
      setReptiles(reptiles.filter(reptile => reptile._id !== id));
    } catch (err) {
      console.error('Errore nell\'eliminazione del rettile:', err);
    }
  };

  return (
    <div className="container">
      <h2>La tua Dashboard dei rettili</h2>

      <ReptileForm setReptiles={setReptiles} />

      {reptiles.length === 0 ? (
        <p>Non hai rettili registrati.</p>
      ) : (
        <div className="row">
          {reptiles.map((reptile) => (
            <div key={reptile._id} className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{reptile.name} ({reptile.species})</h5>
                  <p><strong>Morph:</strong> {reptile.morph || 'Non specificato'}</p>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteReptile(reptile._id)}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
