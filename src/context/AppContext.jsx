import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // User State
    const [user, setUser] = useState(null); // { name, avatar, id }

    // Media State
    const [media, setMedia] = useState({ mic: true, cam: true });

    const toggleMic = () => setMedia(prev => ({ ...prev, mic: !prev.mic }));
    const toggleCam = () => setMedia(prev => ({ ...prev, cam: !prev.cam }));

    // App State
    const [rooms, setRooms] = useState([
        { id: 'o1', name: 'Oficina 1', notes: '' },
        { id: 'o2', name: 'Oficina 2', notes: '' },
        { id: 'o3', name: 'Oficina 3', notes: '' },
        { id: 'o4', name: 'Oficina 4', notes: '' },
        { id: 'o5', name: 'Oficina 5', notes: '' },
        { id: 'o6', name: 'Oficina 6', notes: '' },
        { id: 'o7', name: 'Oficina 7', notes: '' },
        { id: 'o8', name: 'Oficina 8', notes: '' },
        { id: 'o9', name: 'Oficina 9', notes: '' },
        { id: 'o10', name: 'Oficina 10', notes: '' },
        { id: 'm1', name: 'Sala de Juntas', notes: '' },
        { id: 'lab', name: 'Laboratorio de Innovación', notes: '' },
    ]);

    // Deliverables State { [roomId]: [{ id, text, completed }] }
    const [deliverables, setDeliverables] = useState({
        'o1': [{ id: 1, text: 'Definir Roadmap Q1', completed: true }, { id: 2, text: 'Presupuesto Inicial', completed: false }],
        'o2': [{ id: 1, text: 'Wireframes App', completed: false }],
        'o3': [],
    });

    const addDeliverable = (roomId, text) => {
        setDeliverables(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), { id: Date.now(), text, completed: false }]
        }));
    };

    const toggleDeliverable = (roomId, itemId) => {
        setDeliverables(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || []).map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        }));
    };

    const getDeliverableStatus = (roomId) => {
        const list = deliverables[roomId] || [];
        if (list.length === 0) return 'Sin Asignar';
        const completed = list.filter(i => i.completed).length;
        if (completed === 0) return 'Iniciando';
        if (completed === list.length) return 'Completo';
        return 'En Proceso';
    };

    const [chats, setChats] = useState({
        global: [],
        // room_id: []
    });

    const login = (name, photo) => {
        setUser({
            id: Date.now().toString(),
            name,
            avatar: photo || `https://ui-avatars.com/api/?name=${name}&background=random`,
            x: 750, // Start center
            y: 500
        });
    };

    const updateRoomName = (id, newName) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, name: newName } : r));
    };

    const updateRoomNote = (id, note) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, notes: note } : r));
    };

    const addChatMessage = (contextId, message) => {
        setChats(prev => ({
            ...prev,
            [contextId]: [...(prev[contextId] || []), {
                id: Date.now(),
                user: user.name,
                text: message,
                timestamp: new Date()
            }]
        }));
    };

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            login,
            media,
            toggleMic,
            toggleCam,
            rooms,
            updateRoomName,
            updateRoomNote,
            chats,
            addChatMessage,
            deliverables,
            addDeliverable,
            toggleDeliverable,
            getDeliverableStatus
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
