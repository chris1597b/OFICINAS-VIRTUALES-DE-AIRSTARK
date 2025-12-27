import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, Settings, Hand, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import classNames from 'classnames';
import './Toolbar.css';

export const Toolbar = ({ toggleSidebar }) => {
    const { media, toggleMic, toggleCam } = useApp();

    return (
        <div className="toolbar-container">
            <div className="toolbar-island">
                {/* Mobile Menu Trigger - Visible on mobile via CSS usually or we can just add it here always */}
                <button className="tool-btn mobile-only" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>

                <div className="separator mobile-only" />

                <button
                    className={classNames('tool-btn', { active: media.mic })}
                    onClick={toggleMic}
                    title={media.mic ? "Desactivar Micrófono" : "Activar Micrófono"}
                >
                    {media.mic ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                    className={classNames('tool-btn', { active: media.cam })}
                    onClick={toggleCam}
                    title={media.cam ? "Desactivar Cámara" : "Activar Cámara"}
                >
                    {media.cam ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                <div className="separator" />

                <button className="tool-btn" title="Compartir Pantalla">
                    <Monitor size={20} />
                </button>

                <button className="tool-btn" title="Levantar la Mano">
                    <Hand size={20} />
                </button>

                <div className="separator" />

                <button className="tool-btn secondary" title="Configuración">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};
