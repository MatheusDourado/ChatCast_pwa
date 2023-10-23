import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

function Particles() {
	const particlesRef = useRef();

	useFrame((state) => {
		if (particlesRef.current) {
			particlesRef.current.rotation.y += 0.005;
		}
	});

	const particles = useMemo(() => {
		const temp = new THREE.BufferGeometry();
		const count = 1000; // Número de partículas
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 10; // Espaçamento das partículas
		}
		temp.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		return temp;
	}, []);

	return (
		<points ref={particlesRef} geometry={particles}>
			<pointsMaterial attach="material" size={0.05} color="#A2EAF2" />
		</points>
	);
}

export default function ParticleCanvas() {
	return (
		<Canvas style={{ position: 'absolute', top: 0, left: 0}}>
			<Particles />
		</Canvas>
	);
}
