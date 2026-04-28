'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSphere(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const ref2 = useRef<THREE.Points>(null!);
  
  // 2500개의 메인 입자
  const sphere = useMemo(() => {
    const count = 2500;
    const points = new Float32Array(count * 3);
    const radius = 1.5;
    
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.pow(Math.random(), 1 / 3);
      
      points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  // 100개의 큰 빛나는 입자 (스타일용)
  const stars = useMemo(() => {
    const count = 100;
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2 * Math.pow(Math.random(), 1 / 3);
      points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
      // 미세한 트윙클 효과
      (ref.current.material as any).opacity = 0.4 + Math.sin(time * 2) * 0.2;
    }
    if (ref2.current) {
      ref2.current.rotation.x += delta / 15;
      ref2.current.rotation.y += delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={ref2} positions={stars} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8a2be2"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function NetworkBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-space-black pointer-events-none">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <Canvas 
        camera={{ position: [0, 0, 1.2] }}
        dpr={[1, 1.5]} // 더 보수적인 DPR로 성능 확보
        performance={{ min: 0.5 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ParticleSphere />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-black/50 to-space-black pointer-events-none" />
    </div>
  );
}
