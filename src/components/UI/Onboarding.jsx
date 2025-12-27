import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera } from 'lucide-react';
import './Onboarding.css';

export const Onboarding = () => {
    const { login } = useApp();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            login(name, photo);
        }
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                <div className="brand-header">
                    <h1>AIRSTARK</h1>
                    <p>Espacio de Trabajo Virtual</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="photo-upload-section">
                        <div className="photo-preview" style={{ backgroundImage: photo ? `url(${photo})` : 'none' }}>
                            {!photo && <Camera size={32} opacity={0.5} />}
                        </div>
                        <label className="upload-btn">
                            Subir Foto
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                        </label>
                    </div>

                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Dra. Ana Pérez"
                            required
                        />
                    </div>

                    <button type="submit" className="join-btn">Entrar a la Oficina</button>
                </form>
            </div>
        </div>
    );
};
