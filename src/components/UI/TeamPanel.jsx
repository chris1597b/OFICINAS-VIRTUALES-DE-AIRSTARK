import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin } from 'lucide-react';
import './TeamPanel.css';

export const TeamPanel = ({ onClose }) => {
    const { teamMembers, getAssignedRooms } = useApp();

    return (
        <div className="team-panel-overlay" onClick={onClose}>
            <div className="team-panel-container" onClick={(e) => e.stopPropagation()}>
                <div className="team-panel-header">
                    <h2>Equipo AIRSTARK</h2>
                    <button className="close-team-panel" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="team-panel-content">
                    <div className="team-grid-layout">
                        {teamMembers.map(member => {
                            const assignedRooms = getAssignedRooms(member.id);
                            return (
                                <div key={member.id} className={`team-member-card ${member.isActive ? 'active' : 'inactive'}`}>
                                    <div className="member-avatar-section">
                                        <img src={member.avatar} alt={member.name} className="member-avatar-large" />
                                        <div className={`status-indicator ${member.isActive ? 'online' : 'offline'}`}>
                                            {member.isActive ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </div>
                                    <div className="member-details-section">
                                        <h3 className="member-name-large">{member.name}</h3>
                                        <p className="member-role-large">{member.role}</p>

                                        <div className="assigned-areas-section">
                                            <div className="areas-header">
                                                <MapPin size={14} />
                                                <span>Áreas Asignadas</span>
                                            </div>
                                            <div className="areas-badges">
                                                {assignedRooms.length > 0 ? (
                                                    assignedRooms.map(room => (
                                                        <span key={room.id} className="area-badge">
                                                            {room.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="no-areas">Sin áreas asignadas</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
