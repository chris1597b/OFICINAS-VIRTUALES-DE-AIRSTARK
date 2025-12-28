import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText, CheckCircle, Clock, Circle } from 'lucide-react';
import { TeamPanel } from './TeamPanel';
import './Sidebar.css';

export const Sidebar = () => {
    const { rooms, getDeliverableStatus, teamMembers } = useApp();
    const [showTeamPanel, setShowTeamPanel] = useState(false);

    // Filter only office rooms for the list
    const offices = rooms.filter(r => r.id.startsWith('o'));

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completo': return <CheckCircle size={14} className="status-icon completed" />;
            case 'En Proceso': return <Clock size={14} className="status-icon in-progress" />;
            default: return <Circle size={14} className="status-icon start" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completo': return 'completed';
            case 'En Proceso': return 'in-progress';
            default: return 'start';
        }
    };

    return (
        <>
            {showTeamPanel && <TeamPanel onClose={() => setShowTeamPanel(false)} />}

            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-area">
                        <div className="logo-icon">A</div>
                        <span className="logo-text">AIRSTARK</span>
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3 className="section-title">
                        <Users size={16} /> EQUIPO AIRSTARK
                    </h3>
                    <div className="team-grid">
                        {teamMembers.slice(0, 4).map(member => (
                            <div key={member.id} className="mini-avatar-wrapper" title={`${member.name} - ${member.role}`}>
                                <img src={member.avatar} className="mini-avatar" alt={member.name} />
                            </div>
                        ))}
                        {teamMembers.length > 4 && (
                            <div className="mini-avatar more">+{teamMembers.length - 4}</div>
                        )}
                    </div>
                    <button className="view-all-team-btn" onClick={() => setShowTeamPanel(true)}>
                        Ver Todo el Equipo
                    </button>
                </div>

                <div className="sidebar-section flex-grow">
                    <h3 className="section-title">
                        <FileText size={16} /> ENTREGABLES SEMANALES
                    </h3>
                    <div className="deliverables-scroll">
                        {offices.map(office => {
                            const status = getDeliverableStatus(office.id);
                            return (
                                <div key={office.id} className="deliverable-card">
                                    <div className="dev-header">
                                        <span className="dev-name">{office.name}</span>
                                        {getStatusIcon(status)}
                                    </div>
                                    <div className={`dev-status-text ${getStatusClass(status)}`}>
                                        {status}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
};
