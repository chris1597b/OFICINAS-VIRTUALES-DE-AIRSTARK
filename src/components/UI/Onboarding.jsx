import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, LogIn } from 'lucide-react';
import './Onboarding.css';

export const Onboarding = () => {
    const { loginWithGoogle, login } = useApp();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) login(name, photo);
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                <div className="brand-header">
                    <h1>AIRSTARK</h1>
                    <p>Oficina Virtual HealthTech</p>
                </div>

                <div className="login-options">
                    <button className="google-login-btn" onClick={loginWithGoogle}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        Entrar con cuenta de Google
                    </button>

                    <div className="divider">
                        <span>O entrar como invitado</span>
                    </div>

                    <form onSubmit={handleManualSubmit}>
                        <div className="photo-upload-section">
                            <div className="photo-preview" style={{ backgroundImage: photo ? `url(${photo})` : 'none' }}>
                                {!photo && <Camera size={24} opacity={0.5} />}
                            </div>
                            <label className="upload-btn">
                                Foto
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                            </label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre..."
                                required
                            />
                        </div>

                        <button type="submit" className="join-btn">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
