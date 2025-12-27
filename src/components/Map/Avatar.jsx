import React from 'react';
import './Avatar.css';

export const Avatar = ({ x, y, name, avatarUrl, isMe }) => {
    return (
        <div
            className={`avatar-container ${isMe ? 'is-me' : ''}`}
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div className="avatar-circle">
                <img src={avatarUrl} alt={name} />
            </div>
            <div className="avatar-label">{name}</div>
        </div>
    );
};
