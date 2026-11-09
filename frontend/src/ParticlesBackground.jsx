import { useEffect, useState } from 'react';
// O try/catch aqui evita que o app quebre se a lib não estiver instalada
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground({ themeColor }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    }).catch(err => console.error("Erro nas partículas:", err));
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            color: { value: themeColor },
            links: { color: themeColor, distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { enable: true, speed: 0.8 },
            number: { value: 50 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />
    );
  }
  return null;
}