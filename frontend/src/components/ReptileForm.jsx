import React, { useState } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

const ReptileForm = ({ setReptiles }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [morph, setMorph] = useState('');
    const user = useSelector(selectUser);

    const createReptile = async (e) => {
        e.preventDefault();

        try {
            const { data } = await api.post('/reptile', {
                name,
                species,
                morph,
                user: user?._id
            });

            setReptiles(prevReptiles => [...prevReptiles, data]);
            setName('');
            setSpecies('');
            setMorph('');
        } catch (err) {
            console.error('Errore nella creazione del rettile:', err);
        }
    };

    return (
        <form onSubmit={createReptile}>
            <div className="mb-3">
                <label>Nome</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Specie</label>
                <input
                    type="text"
                    className="form-control"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Morph (opzionale)</label>
                <input
                    type="text"
                    className="form-control"
                    value={morph}
                    onChange={(e) => setMorph(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Aggiungi Rettile</button>
        </form>
    );
};

export default ReptileForm;
