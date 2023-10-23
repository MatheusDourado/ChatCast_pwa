import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const useAudioVisualizer = () => {
    const meshRef = useRef(null);
    const rendererRef = useRef(new THREE.WebGLRenderer());
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    useEffect(() => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        meshRef.current = new THREE.Mesh(geometry, material);
        sceneRef.current.add(meshRef.current);
        cameraRef.current.position.z = 5;
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            let source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
        });

        function animate() {
            let audioData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(audioData);

            // Atualize sua malha com base nos dados de áudio:
            if (meshRef.current) {
                meshRef.current.scale.y = 1 + (audioData[0] / 255);
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);

            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            // Aqui você pode adicionar qualquer limpeza necessária quando o componente for desmontado.
        };
    }, []);

    const startVisualizer = () => {};
    const stopVisualizer = () => {};

    return { startVisualizer, stopVisualizer };
}

export default useAudioVisualizer;
