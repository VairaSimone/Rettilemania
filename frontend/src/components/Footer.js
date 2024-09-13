import React from 'react';

const Footer = () => {

    return (
    <footer class="bg-dark text-white mt-5 p-4 text-center">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>Informazioni</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white">Chi siamo</a></li>
                        <li><a href="#" class="text-white">Contatti</a></li>
                        <li><a href="#" class="text-white">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Servizi</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white">Gestione rettili</a></li>
                        <li><a href="#" class="text-white">Consulenza</a></li>
                        <li><a href="#" class="text-white">Supporto tecnico</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Seguici</h5>
                    <a href="#" class="text-white me-2"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="text-white me-2"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12">
                    <p class="mb-0">© 2024 Rettilemania. Tutti i diritti riservati.</p>
                </div>
            </div>
        </div>
    </footer>

    );
};

export default Footer;
