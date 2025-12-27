import React, { useEffect, useState } from 'react';
import { Room } from './Room';
import { Avatar } from './Avatar';
import { RoomControls } from './RoomControls';
import { useApp } from '../../context/AppContext';
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
    const { user, setUser, rooms } = useApp();
    const [activeRoomId, setActiveRoomId] = useState(null);

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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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

    return (
        <div className="floor-plan-container">
            {/* HUD for Room Status */}
            {activeRoomData ? (
                <div className="room-overlay-indicator in-room">
                    Estás en: <strong>{activeRoomData.name}</strong>
                </div>
            ) : (
                <div className="room-overlay-indicator hallway">
                    Pasillo (Espacio Público)
                </div>
            )}

            {/* Room Controls Panel */}
            {activeRoomData && <RoomControls currentRoom={activeRoomData} />}

            <div className="floor-plan-map" onClick={handleMapClick}>
                {ROOM_COORDS.map(coords => {
                    const roomState = getRoomData(coords.id);
                    return (
                        <Room
                            key={coords.id}
                            type={coords.type}
                            label={roomState.name || coords.id}
                            x={coords.x}
                            y={coords.y}
                            width={coords.w}
                            height={coords.h}
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

                {/* Mock other users */}
                <Avatar x={1100} y={200} name="Dra. Sarah" avatarUrl="https://i.pravatar.cc/150?u=1" />
                <Avatar x={1150} y={550} name="Marc" avatarUrl="https://i.pravatar.cc/150?u=2" />
            </div>
        </div>
    );
};
