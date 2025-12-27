import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, FileText, CheckSquare, Edit2, Plus, Trash2 } from 'lucide-react';
import './RoomControls.css';

export const RoomControls = ({ currentRoom }) => {
    const { updateRoomName, updateRoomNote, chats, addChatMessage, deliverables, addDeliverable, toggleDeliverable } = useApp();
    const [activeTab, setActiveTab] = useState('chat'); // chat | notes | todos
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(currentRoom.name);
    const [message, setMessage] = useState('');
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        setNewName(currentRoom.name);
    }, [currentRoom]);

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

    const roomChat = chats[currentRoom.id] || [];
    const roomTodos = deliverables[currentRoom.id] || [];

    return (
        <div className="room-controls-panel">
            <div className="room-header">
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

            <div className="tabs">
                <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                    <MessageSquare size={14} /> Chat
                </button>
                <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                    <FileText size={14} /> Notas
                </button>
                <button className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>
                    <CheckSquare size={14} /> Tareas
                </button>
            </div>

            <div className="panel-content">
                {activeTab === 'chat' && (
                    <div className="chat-view">
                        <div className="messages-list">
                            {roomChat.length === 0 && <div className="empty-state">No hay mensajes.</div>}
                            {roomChat.map(msg => (
                                <div key={msg.id} className="chat-msg">
                                    <span className="msg-user">{msg.user}:</span> {msg.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input-area">
                            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enviar mensaje..." />
                        </form>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="notes-view">
                        <textarea
                            className="notes-area"
                            value={currentRoom.notes || ''}
                            onChange={(e) => updateRoomNote(currentRoom.id, e.target.value)}
                            placeholder="Deja una nota para esta sala..."
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
                            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Agregar entregable..." />
                            <button type="submit" className="add-icon"><Plus size={16} /></button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
