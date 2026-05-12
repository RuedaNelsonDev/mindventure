import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';

// ───────── Mar: plano subdividido con oscilacion sinusoidal ─────────
function Mar() {
  const meshRef = useRef();

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const positions = mesh.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z =
        Math.sin(x * 0.3 + t * 0.7) * 0.15 +
        Math.sin(y * 0.4 + t * 0.5) * 0.15;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
      <planeGeometry args={[200, 200, 50, 50]} />
      <meshStandardMaterial
        color="#4a9fd1"
        transparent
        opacity={0.85}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// ───────── Arena ─────────
function Arena() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#f4e3b2" roughness={1} />
    </mesh>
  );
}

// ───────── Sol (esfera visual) ─────────
function Sol() {
  return (
    <mesh position={[15, 8, -20]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshBasicMaterial color="#ffe066" />
    </mesh>
  );
}

// ───────── Palmera (tronco + 5 hojas) ─────────
function Palmera({ position }) {
  const hojas = [
    [0, 0, 0],
    [0.5, -0.2, 0.5],
    [-0.5, -0.2, 0.5],
    [0.5, -0.2, -0.5],
    [-0.5, -0.2, -0.5],
  ];

  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 4, 12]} />
        <meshStandardMaterial color="#6b4226" roughness={0.9} />
      </mesh>
      {hojas.map((h, i) => (
        <mesh key={i} position={[h[0], 4 + h[1], h[2]]}>
          <sphereGeometry args={[0.9, 12, 12]} />
          <meshStandardMaterial color="#2d5a27" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ───────── Esfera de respiracion ─────────
// Ciclo de 14s: 4s inhalar (1 → 1.5), 4s mantener (1.5), 6s exhalar (1.5 → 1).
function EsferaRespiracion({ onCambioFase }) {
  const meshRef = useRef();
  const faseRef = useRef(null);
  const onCambioFaseRef = useRef(onCambioFase);

  useEffect(() => {
    onCambioFaseRef.current = onCambioFase;
  }, [onCambioFase]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime % 14;
    let scale;
    let fase;

    if (t < 4) {
      scale = 1 + (t / 4) * 0.5;
      fase = 'inhalar';
    } else if (t < 8) {
      scale = 1.5;
      fase = 'mantener';
    } else {
      scale = 1.5 - ((t - 8) / 6) * 0.5;
      fase = 'exhalar';
    }

    mesh.scale.setScalar(scale);
    mesh.rotation.y = state.clock.elapsedTime * 0.1;

    if (fase !== faseRef.current) {
      faseRef.current = fase;
      onCambioFaseRef.current?.(fase);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#a8e6cf"
        transparent
        opacity={0.65}
        roughness={0.2}
        metalness={0.4}
        emissive="#a8e6cf"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

// ───────── Componente principal ─────────
export default function EscenaPlaya({ onCambioFase }) {
  // Audio loop. El archivo /public/sounds/olas.mp3 NO esta incluido.
  // Para obtenerlo: descarga un loop de "ocean waves" desde
  // https://pixabay.com/sound-effects/search/ocean%20waves/ (atribucion libre)
  // y guardalo en frontend/public/sounds/olas.mp3.
  // Si no esta presente, el catch evita que falle silenciosamente.
  useEffect(() => {
    let audio;
    try {
      audio = new Audio('/sounds/olas.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Audio bloqueado por autoplay policy o archivo ausente — sin escenario sonoro.
      });
    } catch {
      // ignore
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 60 }} dpr={[1, 2]}>
      <Sky sunPosition={[5, 1, 0]} turbidity={6} rayleigh={1} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffe4a3"
      />

      <Mar />
      <Arena />
      <Sol />

      <Palmera position={[-5, -1, -3]} />
      <Palmera position={[4, -1, -5]} />
      <Palmera position={[-3, -1, -8]} />

      <EsferaRespiracion onCambioFase={onCambioFase} />

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        target={[0, 2, 0]}
      />
    </Canvas>
  );
}
