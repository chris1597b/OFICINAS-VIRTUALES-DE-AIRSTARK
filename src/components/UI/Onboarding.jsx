import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, Lock, User } from 'lucide-react';
import './Onboarding.css';

export const Onboarding = () => {
    const { login } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(username, password, photo);
        if (!success) {
            setError('Credenciales incorrectas. Intente de nuevo.');
        }
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                <div className="brand-header">
                    <h1>AIRSTARK</h1>
                    <p>Oficina Virtual HealthTech</p>
                </div>

                <div className="login-section">
                    <h2 className="login-title">Iniciar Sesión</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="photo-upload-container">
                            <label htmlFor="photo-input" className="photo-upload-label">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="photo-preview-img" />
                                ) : (
                                    <div className="photo-placeholder">
                                        <Camera size={32} />
                                        <span>Subir Foto</span>
                                    </div>
                                )}
                            </label>
                            <input
                                id="photo-input"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden-file-input"
                            />
                        </div>

                        <div className="input-group">
                            <label><User size={14} /> Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nombre de usuario"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><Lock size={14} /> Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                            />
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button type="submit" className="join-btn">Entrar a la Oficina</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
