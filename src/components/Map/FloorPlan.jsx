import React, { useEffect, useState, useRef } from 'react';
import { Room } from './Room';
import { Avatar } from './Avatar';
import { RoomControls } from './RoomControls';
import { useApp } from '../../context/AppContext';
import { ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import './FloorPlan.css';

// Room coordinates used for rendering bounds/collisions
const ROOM_COORDS = [
    { id: 'o1', type: 'private', x: 100, y: 100, w: 150, h: 200 },
    { id: 'o2', type: 'private', x: 260, y: 100, w: 150, h: 200 },
    { id: 'o3', type: 'private', x: 420, y: 100, w: 150, h: 200 },
    { id: 'o4', type: 'private', x: 580, y: 100, w: 150, h: 200 },
    { id: 'o5', type: 'private', x: 740, y: 100, w: 150, h: 200 },
    { id: 'o6', type: 'private', x: 100, y: 600, w: 150, h: 200 },
    { id: 'o7', type: 'private', x: 260, y: 600, w: 150, h: 200 },
    { id: 'o8', type: 'private', x: 420, y: 600, w: 150, h: 200 },
    { id: 'o9', type: 'private', x: 580, y: 600, w: 150, h: 200 },
    { id: 'o10', type: 'private', x: 740, y: 600, w: 150, h: 200 },
    { id: 'm1', type: 'meeting', x: 1000, y: 100, w: 300, h: 250 },
    { id: 'lab', type: 'innovation', x: 1000, y: 450, w: 300, h: 350 },
];

export const FloorPlan = () => {
    const { user, setUser, rooms, teamMembers } = useApp();
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState(null); // Modal state
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef(null);

    // Keyboard Movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!user) return;
            const STEP = 20; // Faster movement
            let dx = 0;
            let dy = 0;

            // Prevent scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp': dy = -STEP; break;
                case 'ArrowDown': dy = STEP; break;
                case 'ArrowLeft': dx = -STEP; break;
                case 'ArrowRight': dx = STEP; break;
                default: return;
            }

            if (dx !== 0 || dy !== 0) {
                setUser(prev => ({
                    ...prev,
                    x: Math.max(0, Math.min(1500, prev.x + dx)),
                    y: Math.max(0, Math.min(1000, prev.y + dy))
                }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [user, setUser]);

    // Click Movement
    const handleMapClick = (e) => {
        if (!user) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        setUser(prev => ({ ...prev, x, y }));
    };

    // Check Room Intersection
    useEffect(() => {
        if (!user) return;
        const current = ROOM_COORDS.find(r =>
            user.x >= r.x && user.x <= r.x + r.w &&
            user.y >= r.y && user.y <= r.y + r.h
        );
        setActiveRoomId(current ? current.id : null);
    }, [user]);

    // Helper to get room data from context by ID
    const getRoomData = (id) => rooms.find(r => r.id === id) || {};

    const activeRoomData = activeRoomId ? getRoomData(activeRoomId) : null;
    const selectedRoomData = selectedRoomId ? getRoomData(selectedRoomId) : null;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const handleLocateMe = () => {
        if (!user || !containerRef.current) return;
        const container = containerRef.current;
        const targetX = (user.x * zoom) - (container.clientWidth / 2);
        const targetY = (user.y * zoom) - (container.clientHeight / 2);

        container.scrollTo({
            left: targetX,
            top: targetY,
            behavior: 'smooth'
        });
    };

    return (
        <div className="floor-plan-wrapper">
            {/* HUD para Room Status - Siempre visible */}
            {activeRoomData ? (
                <div className="room-overlay-indicator in-room">
                    Estás en: <strong>{activeRoomData.name}</strong>
                </div>
            ) : (
                <div className="room-overlay-indicator hallway">
                    Pasillo (Espacio Público)
                </div>
            )}

            {/* Map Controls - Siempre visibles */}
            <div className="map-controls">
                <button className="control-btn" onClick={handleZoomIn} title="Acercar">
                    <ZoomIn size={18} />
                </button>
                <button className="control-btn" onClick={handleZoomOut} title="Alejar">
                    <ZoomOut size={18} />
                </button>
                <button className="control-btn" onClick={handleLocateMe} title="Ubicarme">
                    <LocateFixed size={18} />
                </button>
            </div>

            {/* Room Controls Modal - Opens when room icon clicked */}
            {selectedRoomData && (
                <div className="modal-overlay" onClick={() => setSelectedRoomId(null)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <RoomControls
                            currentRoom={selectedRoomData}
                            onClose={() => setSelectedRoomId(null)}
                            onExitRoom={() => setUser(prev => ({ ...prev, x: 750, y: 500 }))}
                        />
                    </div>
                </div>
            )}

            <div className="floor-plan-container" ref={containerRef}>
                <div
                    className="floor-plan-map"
                    onClick={handleMapClick}
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left'
                    }}
                >
                    {ROOM_COORDS.map(coords => {
                        const roomState = getRoomData(coords.id);
                        return (
                            <Room
                                key={coords.id}
                                id={coords.id}
                                type={coords.type}
                                label={roomState.name || coords.id}
                                x={coords.x}
                                y={coords.y}
                                width={coords.w}
                                height={coords.h}
                                onOpenControls={() => setSelectedRoomId(coords.id)}
                            />
                        );
                    })}

                    {/* User Avatar */}
                    {user && (
                        <Avatar
                            x={user.x - 24} // Center offset
                            y={user.y - 24}
                            name={user.name}
                            avatarUrl={user.avatar}
                            isMe={true}
                        />
                    )}

                    {/* Active Team Members Avatars */}
                    {teamMembers.filter(m => m.isActive && m.x && m.y).map(member => (
                        <Avatar
                            key={member.id}
                            x={member.x - 24}
                            y={member.y - 24}
                            name={member.name}
                            avatarUrl={member.avatar}
                            isMe={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
