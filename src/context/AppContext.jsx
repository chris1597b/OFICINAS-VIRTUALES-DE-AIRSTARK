import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Claves para LocalStorage
// Miembros del equipo global
let TEAM_MEMBERS = [
    { id: 'tm1', name: 'Alex Rivera', role: 'Director Creativo', avatar: 'https://i.pravatar.cc/150?u=alex', isActive: true, x: 1100, y: 200 },
    { id: 'tm2', name: 'Sofia Chen', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/150?u=sofia', isActive: true, x: 1150, y: 550 },
    { id: 'tm3', name: 'Marco Rossi', role: 'Diseñador UI/UX', avatar: 'https://i.pravatar.cc/150?u=marco', isActive: false },
    { id: 'tm4', name: 'Elena Vance', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=elena', isActive: true, x: 200, y: 650 },
    { id: 'tm5', name: 'Lucas Meyer', role: 'Backend Engineer', avatar: 'https://i.pravatar.cc/150?u=lucas', isActive: false },
    { id: 'tm6', name: 'Ana Silva', role: 'QA Specialist', avatar: 'https://i.pravatar.cc/150?u=ana', isActive: true, x: 450, y: 200 },
];

const STORAGE_KEYS = {
    USER: 'airstark_user',
    ROOMS: 'airstark_rooms',
    DELIVERABLES: 'airstark_deliverables',
    CHATS: 'airstark_chats',
    TEAM_MEMBERS: 'airstark_team_members'
};

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [media, setMedia] = useState({ mic: true, cam: true });

    // Estado inicial de salas con miembros asignados
    const initialRooms = [
        { id: 'o1', name: 'Oficina 1', notes: '', members: ['tm1', 'tm3'] },
        { id: 'o2', name: 'Oficina 2', notes: '', members: ['tm2'] },
        { id: 'o3', name: 'Oficina 3', notes: '', members: ['tm4', 'tm6'] },
        { id: 'o4', name: 'Oficina 4', notes: '', members: ['tm5'] },
        { id: 'o5', name: 'Oficina 5', notes: '', members: ['tm1'] },
        { id: 'o6', name: 'Oficina 6', notes: '', members: ['tm2', 'tm5'] },
        { id: 'o7', name: 'Oficina 7', notes: '', members: ['tm3'] },
        { id: 'o8', name: 'Oficina 8', notes: '', members: ['tm4'] },
        { id: 'o9', name: 'Oficina 9', notes: '', members: ['tm6'] },
        { id: 'o10', name: 'Oficina 10', notes: '', members: ['tm1', 'tm2'] },
        { id: 'm1', name: 'Sala de Juntas', notes: '', members: ['tm1', 'tm2', 'tm4'] },
        { id: 'lab', name: 'Laboratorio de Innovación', notes: '', members: ['tm2', 'tm5'] },
    ];

    const [rooms, setRooms] = useState(initialRooms);
    const [deliverables, setDeliverables] = useState({});
    const [chats, setChats] = useState({ global: [] });
    const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);

    // Cargar datos al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const savedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
        const savedDeliverables = localStorage.getItem(STORAGE_KEYS.DELIVERABLES);
        const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
        const savedTeamMembers = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);

        if (savedUser) setUser(JSON.parse(savedUser));

        // Si hay salas guardadas, nos aseguramos de que tengan los miembros actualizados
        if (savedRooms) {
            const parsedRooms = JSON.parse(savedRooms);
            const mergedRooms = initialRooms.map(room => {
                const saved = parsedRooms.find(r => r.id === room.id);
                return { ...room, ...saved, members: saved?.members || room.members };
            });
            setRooms(mergedRooms);
        } else {
            setRooms(initialRooms);
        }

        if (savedDeliverables) setDeliverables(JSON.parse(savedDeliverables));
        if (savedChats) setChats(JSON.parse(savedChats));
        if (savedTeamMembers) setTeamMembers(JSON.parse(savedTeamMembers));

        setLoading(false);
    }, []);

    // Guardar datos cuando cambien
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
            localStorage.setItem(STORAGE_KEYS.DELIVERABLES, JSON.stringify(deliverables));
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
            localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(teamMembers));
        }
    }, [rooms, deliverables, chats, teamMembers, loading]);

    const toggleMic = () => setMedia(prev => ({ ...prev, mic: !prev.mic }));
    const toggleCam = () => setMedia(prev => ({ ...prev, cam: !prev.cam }));

    const login = (username, password, avatarUrl = null) => {
        // Credenciales solicitadas por el usuario
        if (username.toLowerCase() === 'christopher' && password === 'christopher1597') {
            const newUser = {
                id: 'chris-1597',
                name: 'Christopher',
                avatar: avatarUrl || 'https://i.pravatar.cc/150?u=chris',
                x: 750,
                y: 500
            };
            setUser(newUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
    };

    const updateRoomName = (id, newName) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, name: newName } : r));
    };

    const updateRoomNote = (id, note) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, notes: note } : r));
    };

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
        const completedCount = list.filter(i => i.completed).length;
        if (completedCount === 0) return 'Iniciando';
        if (completedCount === list.length) return 'Completo';
        return 'En Proceso';
    };

    const addChatMessage = (contextId, text) => {
        if (!user) return;
        setChats(prev => ({
            ...prev,
            [contextId]: [...(prev[contextId] || []), {
                id: Date.now(),
                user: user.name,
                text,
                timestamp: new Date()
            }]
        }));
    };

    // Mock de suscripción para mantener compatibilidad con RoomControls
    const subscribeToChat = (contextId, callback) => {
        callback(chats[contextId] || []);
        // En una app real sin server, esto no hace nada reactivo por sí solo 
        // a menos que usemos un EventBus o similar, pero para un solo usuario basta.
        return () => { };
    };

    // Actualizar el callback del chat cuando el estado de chats cambia
    // (Simplificación para que funcione localmente)
    useEffect(() => {
        // Esto es redundante porque React ya re-renderiza los componentes que usan context
    }, [chats]);

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            logout,
            media,
            toggleMic,
            toggleCam,
            rooms,
            updateRoomName,
            updateRoomNote,
            chats,
            addChatMessage,
            subscribeToChat,
            deliverables,
            addDeliverable,
            toggleDeliverable,
            getDeliverableStatus,
            teamMembers,
            getAssignedRooms: (memberId) => {
                return rooms.filter(room => room.members?.includes(memberId));
            },
            updateMemberRole: (memberId, newRole) => {
                setTeamMembers(prev => prev.map(m =>
                    m.id === memberId ? { ...m, role: newRole } : m
                ));
            },
            assignMemberToRoom: (memberId, roomId) => {
                setRooms(prev => prev.map(r => {
                    if (r.id === roomId) {
                        const members = r.members || [];
                        if (!members.includes(memberId)) {
                            return { ...r, members: [...members, memberId] };
                        }
                    }
                    return r;
                }));
            },
            removeMemberFromRoom: (memberId, roomId) => {
                setRooms(prev => prev.map(r => {
                    if (r.id === roomId && r.members) {
                        return { ...r, members: r.members.filter(id => id !== memberId) };
                    }
                    return r;
                }));
            },
            deleteMember: (memberId) => {
                if (window.confirm('¿Estás seguro de eliminar este miembro del equipo?')) {
                    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
                    setRooms(prev => prev.map(r => ({
                        ...r,
                        members: r.members?.filter(id => id !== memberId) || []
                    })));
                }
            }
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
