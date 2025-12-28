import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, FileText, CheckSquare, Edit2, Plus, X, LogOut, Users } from 'lucide-react';
import './RoomControls.css';

export const RoomControls = ({ currentRoom, onClose, onExitRoom }) => {
    const {
        updateRoomName,
        updateRoomNote,
        addChatMessage,
        subscribeToChat,
        deliverables,
        addDeliverable,
        toggleDeliverable,
        teamMembers,
        user: currentUser
    } = useApp();

    const [activeTab, setActiveTab] = useState('chat');
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(currentRoom.name);
    const [message, setMessage] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const [roomChat, setRoomChat] = useState([]);

    useEffect(() => {
        setNewName(currentRoom.name);
        // Subscribe to chat for this room
        const unsubscribe = subscribeToChat(currentRoom.id, (messages) => {
            setRoomChat(messages);
        });
        return () => unsubscribe();
    }, [currentRoom, subscribeToChat]);

    const handleNameSave = () => {
        updateRoomName(currentRoom.id, newName);
        setIsEditingName(false);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            addChatMessage(currentRoom.id, message);
            setMessage('');
        }
    };

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addDeliverable(currentRoom.id, newTodo);
            setNewTodo('');
        }
    };

    const roomTodos = deliverables[currentRoom.id] || [];

    return (
        <div className="room-controls-panel">
            <div className="room-header">
                <div className="header-left">
                    {isEditingName ? (
                        <div className="name-edit-box">
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="name-input"
                                autoFocus
                            />
                            <button onClick={handleNameSave} className="save-btn">Guardar</button>
                        </div>
                    ) : (
                        <h3 className="room-title">
                            {currentRoom.name}
                            <button onClick={() => setIsEditingName(true)} className="edit-icon" title="Cambiar Nombre">
                                <Edit2 size={12} />
                            </button>
                        </h3>
                    )}
                </div>
                <div className="header-actions">
                    <button className="close-panel-btn danger" onClick={() => {
                        if (window.confirm('¿Salir de esta oficina? Serás movido al pasillo.')) {
                            onExitRoom();
                            onClose();
                        }
                    }} title="Abandonar Habitación">
                        <LogOut size={18} />
                    </button>
                    <button className="close-panel-btn" onClick={onClose} title="Cerrar Panel">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="tabs">
                <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                    <MessageSquare size={14} /> Chat
                </button>
                <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                    <FileText size={14} /> Notas
                </button>
                <button className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>
                    <CheckSquare size={14} /> Entregables
                </button>
                <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
                    <Users size={14} /> Equipo
                </button>
            </div>

            <div className="panel-content">
                {activeTab === 'chat' && (
                    <div className="chat-view">
                        <div className="messages-list">
                            {roomChat.length === 0 && <div className="empty-state">No hay mensajes aún.</div>}
                            {roomChat.map((msg, idx) => (
                                <div key={idx} className="chat-msg">
                                    <span className="msg-user">{msg.user}:</span> {msg.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input-area">
                            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje..." />
                        </form>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="notes-view">
                        <textarea
                            className="notes-area"
                            value={currentRoom.notes || ''}
                            onChange={(e) => updateRoomNote(currentRoom.id, e.target.value)}
                            placeholder="Anota algo importante aquí..."
                        />
                    </div>
                )}

                {activeTab === 'todos' && (
                    <div className="todos-view">
                        <div className="todo-list-scroll">
                            {roomTodos.length === 0 && <div className="empty-state">No hay entregables asignados.</div>}
                            {roomTodos.map(todo => (
                                <div key={todo.id} className={`todo-item-row ${todo.completed ? 'completed' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleDeliverable(currentRoom.id, todo.id)}
                                    />
                                    <span>{todo.text}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddTodo} className="chat-input-area">
                            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Nuevo entregable..." />
                            <button type="submit" className="add-icon"><Plus size={16} /></button>
                        </form>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="team-view">
                        <div className="team-subheader">Responsables del Área</div>
                        <div className="assigned-members">
                            {currentRoom.members?.map(mId => {
                                const member = teamMembers.find(tm => tm.id === mId);
                                if (!member) return null;
                                return (
                                    <div key={member.id} className="member-card-mini">
                                        <img src={member.avatar} alt={member.name} />
                                        <div className="member-info">
                                            <div className="m-name">{member.name}</div>
                                            <div className="m-role">{member.role}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="team-subheader">En esta sala ahora</div>
                        <div className="users-in-room">
                            <div className="online-user-tag">
                                <div className="online-dot"></div>
                                <img src={currentUser.avatar} alt={currentUser.name} className="user-mini-img" />
                                <span>{currentUser.name} (Tú)</span>
                            </div>
                            {/* Aquí se podrían mapear otros usuarios si hubiera sistema multi-usuario */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
