// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Il servizio Axios per le query
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2'; // Per le statistiche (grafico a barre)

const Dashboard = () => {
    const [reptiles, setReptiles] = useState([]);
    const [newReptile, setNewReptile] = useState({ name: '', species: '', morph: '', birthDate: '' });
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Fetch dei rettili dell'utente autenticato
        const fetchReptiles = async () => {
            try {
                const response = await api.get('/reptile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReptiles(response.data);
            } catch (error) {
                console.error('Errore durante il fetch dei rettili:', error);
            }
        };
        fetchReptiles();
    }, [token]);

    const handleAddReptile = async () => {
        try {
            const response = await api.post('/reptile', newReptile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReptiles([...reptiles, response.data]);
            setNewReptile({ name: '', species: '', morph: '', birthDate: '' });
        } catch (error) {
            console.error('Errore durante l\'aggiunta del rettile:', error);
        }
    };

    // Statistiche sui rettili
    const speciesCount = reptiles.reduce((acc, reptile) => {
        acc[reptile.species] = (acc[reptile.species] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(speciesCount),
        datasets: [
            {
                label: 'Numero di rettili per specie',
                data: Object.values(speciesCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={8}>
                    <h2>I tuoi rettili</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Specie</th>
                                <th>Morph</th>
                                <th>Data di nascita</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reptiles.map((reptile) => (
                                <tr key={reptile._id}>
                                    <td>{reptile.name}</td>
                                    <td>{reptile.species}</td>
                                    <td>{reptile.morph}</td>
                                    <td>{new Date(reptile.birthDate).toLocaleDateString()}</td>
                                    <td>
                                        <Button variant="warning" className="me-2">Modifica</Button>
                                        <Button variant="danger">Elimina</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={4}>
                    <h2>Aggiungi un nuovo rettile</h2>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci il nome"
                                value={newReptile.name}
                                onChange={(e) => setNewReptile({ ...newReptile, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSpecies">
                            <Form.Label>Specie</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci la specie"
                                value={newReptile.species}
                                onChange={(e) => setNewReptile({ ...newReptile, species: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formMorph">
                            <Form.Label>Morph</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci il morph"
                                value={newReptile.morph}
                                onChange={(e) => setNewReptile({ ...newReptile, morph: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBirthDate">
                            <Form.Label>Data di nascita</Form.Label>
                            <Form.Control
                                type="date"
                                value={newReptile.birthDate}
                                onChange={(e) => setNewReptile({ ...newReptile, birthDate: e.target.value })}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleAddReptile} className="mt-3">
                            Aggiungi rettile
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={12}>
                    <h2>Statistiche sui tuoi rettili</h2>
                    <Bar data={chartData} />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
