import React from 'react';

const Footer = () => {

    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>Informazioni</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-white">Chi siamo</a></li>
                            <li><a href="#" className="text-white">Contatti</a></li>
                            <li><a href="#" className="text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Servizi</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-white">Gestione rettili</a></li>
                            <li><a href="#" className="text-white">Consulenza</a></li>
                            <li><a href="#" className="text-white">Supporto tecnico</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Seguici</h5>
                        <a href="#" className="text-white me-2"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="text-white me-2"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <p className="mb-0">© 2024 Rettilemania. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
