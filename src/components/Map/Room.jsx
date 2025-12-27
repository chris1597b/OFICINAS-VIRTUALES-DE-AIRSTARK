import React from 'react';
import './Room.css';

export const Room = ({ id, x, y, width, height, type, label }) => {
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
        </div>
    );
};
