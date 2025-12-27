import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText, CheckCircle, Clock, Circle } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
    const { rooms, getDeliverableStatus } = useApp();

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
                {/* Simplified User List */}
                <div className="team-grid">
                    {/* Mock avatars for visual density */}
                    {[1, 2, 3, 4].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="mini-avatar" />
                    ))}
                    <div className="mini-avatar more">+6</div>
                </div>
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
    );
};
