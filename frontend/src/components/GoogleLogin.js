import React from 'react';

const GoogleLogin = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/login-google`;
    };

    return (
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 text-center">
                    <button class="btn btn-danger btn-block" onClick={handleGoogleLogin}>
                        <i class="material-icons">google</i> Accedi con Google
                    </button>
                </div>
            </div>
        </div>

    );
};

export default GoogleLogin;
