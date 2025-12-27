import React from 'react';
import { Settings2 } from 'lucide-react';
import './Room.css';

export const Room = ({ id, x, y, width, height, type, label, onOpenControls }) => {
    return (
        <div
            className={`room type-${type}`}
            style={{
                left: x,
                top: y,
                width: width,
                height: height
            }}
        >
            <div className="room-label">{label}</div>
            <div className="room-floor"></div>

            <button
                className="room-interact-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenControls();
                }}
                title="Abrir Controles"
            >
                <Settings2 size={16} />
            </button>
        </div>
    );
};
