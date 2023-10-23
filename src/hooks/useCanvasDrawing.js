import { useCallback, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

function useCanvasDrawing(canvasRef) {
    const { isSpeaking } = useChat();

    const drawWaves = (canvasContext, width, height) => {
        const centerY = height / 2;
        canvasContext.fillStyle = '#024959';
        canvasContext.fillRect(0, 0, width, height);

        const numOfBars = 5;
        const barWidth = 10;
        const gap = 5;
        let x = (width - numOfBars * (barWidth + gap)) / 2;

        for (let i = 0; i < numOfBars; i++) {
            const barHeight = Math.random() * (height - 50) + 25;
            canvasContext.fillStyle = '#A2EAF2';
            canvasContext.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
            x += barWidth + gap;
        }
    };

    let angle = 0;
    const drawLoading = useCallback((canvasContext, width, height) => {
        const centerX = width / 2;
        const centerY = height / 2;

        canvasContext.fillStyle = '#024959';
        canvasContext.fillRect(0, 0, width, height);

        const maxRadius = 40;
        const radius = (1 + Math.sin(angle)) * 0.5 * maxRadius;

        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        canvasContext.fillStyle = '#A2EAF2';
        canvasContext.fill();

        angle += 0.05;
    }, [])

    const draw = useCallback(() => {
        if (!canvasRef.current) return;

        const canvasContext = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        if (isSpeaking) {
            drawWaves(canvasContext, width, height);
        } else {
            drawLoading(canvasContext, width, height);
        }

        requestAnimationFrame(draw);
    }, [canvasRef, drawLoading, isSpeaking]);

    useEffect(() => {
        if (canvasRef.current) {
            requestAnimationFrame(draw);
        }

        // Limpeza ao desmontar
        return () => {
            cancelAnimationFrame(draw);
        };
    }, [draw, canvasRef.current]);

    return { draw };
}

export default useCanvasDrawing;
