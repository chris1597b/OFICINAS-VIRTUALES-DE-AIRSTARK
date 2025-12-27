import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, VideoOff, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './SelfieView.css';

export const SelfieView = () => {
    const videoRef = useRef(null);
    const { user, media, toggleMic } = useApp();

    useEffect(() => {
        if (user && media.cam) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        // Handle Mic state via tracks
                        stream.getAudioTracks().forEach(track => track.enabled = media.mic);
                    }
                })
                .catch(err => console.error("Error accessing media:", err));
        } else if (videoRef.current) {
            // Stop audio tracks but keep element for layout if needed
            if (videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            videoRef.current.srcObject = null;
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }
    }, [user, media.cam]); // Re-run if camera toggle changes

    // Update Audio Track without re-running stream
    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getAudioTracks().forEach(track => track.enabled = media.mic);
        }
    }, [media.mic]);

    if (!user) return null;

    return (
        <div className="selfie-view-container">
            {media.cam ? (
                <video ref={videoRef} autoPlay muted playsInline className="selfie-video" />
            ) : (
                <div className="camera-off-placeholder">
                    <img src={user.avatar} alt={user.name} />
                    <div className="camera-off-icon"><VideoOff size={16} /></div>
                </div>
            )}

            <div className="selfie-controls">
                <button
                    className={`mic-toggle ${!media.mic ? 'off' : ''}`}
                    onClick={toggleMic}
                    title={media.mic ? "Silenciar" : "Activar Sonido"}
                >
                    {media.mic ? <Mic size={14} /> : <MicOff size={14} />}
                </button>
            </div>
            <div className="selfie-name">{user.name} (Tú)</div>
        </div>
    );
};
