'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function IcosahedronMesh({ mouseRef }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.25
    const targetX = mouseRef.current.y * 0.45
    const targetZ = -mouseRef.current.x * 0.25
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.06
    meshRef.current.rotation.z += (targetZ - meshRef.current.rotation.z) * 0.06
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial color="#29b6f6" wireframe />
    </mesh>
  )
}

export default function ThreeScene({ t }) {
  const [, setMouse] = useState({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      mouseRef.current = { x, y }
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Radial glow behind 3D object */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(41,182,246,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }} onCreated={({ gl }) => gl.setClearColor('#05091a', 1)}>
          <ambientLight intensity={0.2} />
          <pointLight position={[4, 4, 4]} color="#29b6f6" intensity={4} />
          <IcosahedronMesh mouseRef={mouseRef} />
        </Canvas>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white mb-3 text-center px-6">
          {t.heading}
        </h2>
        <p className="text-base sm:text-lg font-light mb-2 text-center px-6" style={{ color: 'rgba(41,182,246,0.8)' }}>
          {t.tagline}
        </p>
        <p className="text-sm text-white/40 font-light mb-8 text-center px-6">
          {t.sub}
        </p>
        <button
          className="pointer-events-auto px-10 py-4 rounded-full text-sm font-bold tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-85"
          style={{ background: '#29b6f6', color: '#05091a' }}
          onClick={() => {
            const target = document.getElementById('contact')
            if (!target) return
            const start = window.scrollY
            const end = target.getBoundingClientRect().top + window.scrollY - 56
            const distance = end - start
            const duration = 1200
            const startTime = performance.now()
            const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
            const step = (now) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              window.scrollTo(0, start + distance * ease(progress))
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }}
        >
          {t.cta}
        </button>
      </div>
    </>
  )
}
