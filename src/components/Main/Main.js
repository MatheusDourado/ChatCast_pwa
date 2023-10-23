import React, { useState, useEffect, useRef } from 'react';
import Button from "../Button/Button";
import useRecognition from '../../hooks/useRecognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import useCanvasDrawing from '../../hooks/useCanvasDrawing';

export default function Main() {
    const [showConversarButton, setShowConversarButton] = useState(true);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showMicrofoneButton, setShowMicrofoneButton] = useState(false);
    const isMobile = window.innerWidth <= 600;
    const { startListening, stopListening, isAISpeaking } = useRecognition();
    const canvasRef = useRef(null); 

    useCanvasDrawing(canvasRef);

    useEffect(() => {
        if (showCanvas && isMobile) {
            setShowMicrofoneButton(true);
        } else {
        }
    }, [showCanvas, isMobile]);

    const handleConversarClick = () => {
        setShowConversarButton(false);
        setShowCanvas(true);
        
        if (!isMobile) {
            startListening()
        }
    };

    return (
        <>
            <main className="relative">
                {showConversarButton && (
                    <Button className="mb-4 px-4 py-2 rounded font-semibold start-button" onClick={handleConversarClick}>
                        Conversar
                    </Button>
                )}

                {showCanvas && (
                    <canvas ref={canvasRef} className="p-6 rounded-lg shadow-lg w-96 h-48 audio-visualizer"></canvas>
                )}

                {showMicrofoneButton && !isAISpeaking && isMobile && (
                    <Button
                        className="absolute right-8 top-3/4 mt-3  text-xl p-3 text-white rounded-full shadow-lg w-16 h-16 start-button"
                        onTouchStart={startListening}
                        onTouchEnd={stopListening}>
                        <FontAwesomeIcon icon={faMicrophone} color="#fff" />
                    </Button>
                )}

                {showMicrofoneButton && isAISpeaking && isMobile && (
                    <Button
                        className="absolute right-8 top-3/4 mt-3  text-xl p-3 text-white rounded-full shadow-lg w-16 h-16 start-button"
                        disabled={true}>
                        <FontAwesomeIcon icon={faMicrophoneSlash} color="#fff" />
                    </Button>
                )}
            </main>
        </>
    );
}
