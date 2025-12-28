import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Edit2, Save, XCircle } from 'lucide-react';
import './TeamPanel.css';

export const TeamPanel = ({ onClose }) => {
    const {
        teamMembers,
        getAssignedRooms,
        rooms,
        updateMemberRole,
        assignMemberToRoom,
        removeMemberFromRoom
    } = useApp();

    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editRole, setEditRole] = useState('');

    const handleStartEdit = (member) => {
        setEditingMemberId(member.id);
        setEditRole(member.role);
    };

    const handleSaveEdit = () => {
        if (editingMemberId && editRole.trim()) {
            updateMemberRole(editingMemberId, editRole.trim());
        }
        setEditingMemberId(null);
        setEditRole('');
    };

    const handleCancelEdit = () => {
        setEditingMemberId(null);
        setEditRole('');
    };

    const handleToggleRoom = (memberId, roomId, isAssigned) => {
        if (isAssigned) {
            removeMemberFromRoom(memberId, roomId);
        } else {
            assignMemberToRoom(memberId, roomId);
        }
    };

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
                            const isEditing = editingMemberId === member.id;

                            return (
                                <div key={member.id} className={`team-member-card ${member.isActive ? 'active' : 'inactive'} ${isEditing ? 'editing' : ''}`}>
                                    {/* Controles de edición en la parte superior */}
                                    <div className="card-edit-controls">
                                        {isEditing ? (
                                            <>
                                                <button className="edit-action-btn save" onClick={handleSaveEdit} title="Guardar">
                                                    <Save size={16} />
                                                </button>
                                                <button className="edit-action-btn cancel" onClick={handleCancelEdit} title="Cancelar">
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <button className="edit-action-btn edit" onClick={() => handleStartEdit(member)} title="Editar miembro">
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="member-avatar-section">
                                        <img src={member.avatar} alt={member.name} className="member-avatar-large" />
                                        <div className={`status-indicator ${member.isActive ? 'online' : 'offline'}`}>
                                            {member.isActive ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </div>

                                    <div className="member-details-section">
                                        <h3 className="member-name-large">{member.name}</h3>

                                        {/* Rol editable */}
                                        {isEditing ? (
                                            <div className="role-edit-container">
                                                <label className="edit-label">Rol / Cargo:</label>
                                                <input
                                                    type="text"
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value)}
                                                    className="role-edit-input"
                                                    placeholder="Ingresa el rol..."
                                                />
                                            </div>
                                        ) : (
                                            <p className="member-role-large">{member.role}</p>
                                        )}

                                        {/* Áreas asignadas - editable cuando está en modo edición */}
                                        <div className="assigned-areas-section">
                                            <div className="areas-header">
                                                <MapPin size={14} />
                                                <span>Áreas Asignadas</span>
                                            </div>

                                            {isEditing ? (
                                                <div className="areas-checkboxes">
                                                    {rooms.map(room => {
                                                        const isAssigned = assignedRooms.some(r => r.id === room.id);
                                                        return (
                                                            <label key={room.id} className="area-checkbox-item">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAssigned}
                                                                    onChange={() => handleToggleRoom(member.id, room.id, isAssigned)}
                                                                />
                                                                <span>{room.name}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
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
                                            )}
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
