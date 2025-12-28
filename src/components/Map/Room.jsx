import React from 'react';
import { Settings2 } from 'lucide-react';
import './Room.css';

export const Room = ({ id, x, y, width, height, type, label, onOpenControls, assignedMembers = [] }) => {
    return (
        <div
            className={`room type-${type}`}
            style={{
                left: x,
                top: y,
                width: width,
                height: height
            }}
            onClick={onOpenControls}
        >
            <div className="room-label">{label}</div>
            <div className="room-floor"></div>

            {/* Avatares de miembros asignados */}
            {assignedMembers.length > 0 && (
                <div className="room-assigned-avatars">
                    {assignedMembers.slice(0, 4).map((member, index) => (
                        <img
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            className="assigned-avatar"
                            title={member.name}
                            style={{ zIndex: 10 - index }}
                        />
                    ))}
                    {assignedMembers.length > 4 && (
                        <div className="assigned-avatar-more">
                            +{assignedMembers.length - 4}
                        </div>
                    )}
                </div>
            )}

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
