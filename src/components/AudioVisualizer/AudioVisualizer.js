import React from 'react';
import { Canvas, extend, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

extend({ ShaderMaterial: THREE.ShaderMaterial });

const WaterWave = ({ isSpeaking }) => {
    const meshRef = React.useRef();
    const uniforms = {
        time: { value: 1.0 },
        amplitude: { value: isSpeaking ? 0.5 : 0.1 }
    };

    useFrame((state) => {
        if (uniforms.time) {
            uniforms.time.value += 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry attach="geometry" args={[5, 5, 32, 32]} />
            <shaderMaterial
                attach="material"
                uniforms={uniforms}
                vertexShader={`
                    uniform float time;
                    uniform float amplitude;
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        pos.z = sin(pos.x + pos.y + time) * amplitude;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `}
                fragmentShader={`
                    varying vec2 vUv;
                    void main() {
                        gl_FragColor = vec4(0.5 + 0.5 * sin(vUv.x * 10.0), 0.5 + 0.5 * sin(vUv.y * 10.0), 1.0, 1.0);
                    }
                `}
                wireframe
            />
        </mesh>
    );
};

export const AudioVisualizer = ({ isSpeaking }) => {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <WaterWave isSpeaking={isSpeaking} />
        </Canvas>
    );
};
