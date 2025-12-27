import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    googleProvider,
    db
} from '../firebase';
import {
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import {
    doc,
    setDoc,
    onSnapshot,
    collection,
    addDoc,
    updateDoc,
    query,
    orderBy,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // User State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Media State
    const [media, setMedia] = useState({ mic: true, cam: true });

    // Domain State
    const [rooms, setRooms] = useState([]);
    const [deliverables, setDeliverables] = useState({});
    const [chats, setChats] = useState({ global: [] });

    const toggleMic = () => setMedia(prev => ({ ...prev, mic: !prev.mic }));
    const toggleCam = () => setMedia(prev => ({ ...prev, cam: !prev.cam }));

    // Firebase Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL,
                    email: firebaseUser.email,
                    x: 750,
                    y: 500
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Firestore Sync: Rooms
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
            const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (roomsData.length > 0) {
                setRooms(roomsData);
            } else {
                // Initial Seed if empty
                const initialRooms = [
                    { id: 'o1', name: 'Oficina 1', notes: '' },
                    { id: 'o2', name: 'Oficina 2', notes: '' },
                    { id: 'm1', name: 'Sala de Juntas', notes: '' },
                    { id: 'lab', name: 'Laboratorio de Innovación', notes: '' },
                ];
                setRooms(initialRooms);
            }
        });
        return unsubscribe;
    }, []);

    // Firestore Sync: Deliverables
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "deliverables"), (snapshot) => {
            const devData = {};
            snapshot.docs.forEach(doc => {
                devData[doc.id] = doc.data().items || [];
            });
            setDeliverables(devData);
        });
        return unsubscribe;
    }, []);

    // Authentication Logic
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            // Fallback para desarrollo si no hay config
            alert("No se pudo conectar con Google. Verifica tu configuración de Firebase.");
        }
    };

    const logout = () => signOut(auth);

    // Room Actions
    const updateRoomName = async (id, newName) => {
        try {
            await setDoc(doc(db, "rooms", id), { name: newName }, { merge: true });
        } catch (e) { console.error(e); }
    };

    const updateRoomNote = async (id, note) => {
        try {
            await setDoc(doc(db, "rooms", id), { notes: note }, { merge: true });
        } catch (e) { console.error(e); }
    };

    // Deliverable Actions
    const addDeliverable = async (roomId, text) => {
        const newItem = { id: Date.now(), text, completed: false };
        try {
            await setDoc(doc(db, "deliverables", roomId), {
                items: arrayUnion(newItem)
            }, { merge: true });
        } catch (e) { console.error(e); }
    };

    const toggleDeliverable = async (roomId, itemId) => {
        const roomItems = deliverables[roomId] || [];
        const newItems = roomItems.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        try {
            await setDoc(doc(db, "deliverables", roomId), { items: newItems }, { merge: true });
        } catch (e) { console.error(e); }
    };

    const getDeliverableStatus = (roomId) => {
        const list = deliverables[roomId] || [];
        if (list.length === 0) return 'Sin Asignar';
        const completed = list.filter(i => i.completed).length;
        if (completed === 0) return 'Iniciando';
        if (completed === list.length) return 'Completo';
        return 'En Proceso';
    };

    // Chat Actions
    const addChatMessage = async (contextId, text) => {
        if (!user) return;
        try {
            await addDoc(collection(db, `chats_${contextId}`), {
                id: Date.now(),
                user: user.name,
                text,
                timestamp: new Date()
            });
        } catch (e) { console.error(e); }
    };

    // Sync Chat (Ejemplo para una sala activa)
    const subscribeToChat = (contextId, callback) => {
        const q = query(collection(db, `chats_${contextId}`), orderBy("timestamp", "asc"));
        return onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => doc.data());
            callback(msgs);
        });
    };

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            loading,
            loginWithGoogle,
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
            getDeliverableStatus
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
