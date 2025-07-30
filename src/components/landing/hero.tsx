"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Github } from "lucide-react";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/auth-provider";

const InteractiveStar = ({
  position,
  baseSize = 0.1,
  color = "white",
  starIndex,
  mousePosition,
}: {
  position: [number, number, number];
  baseSize?: number;
  color?: string;
  starIndex: number;
  mousePosition: THREE.Vector2;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentIntensity, setCurrentIntensity] = useState(1.2);
  const [currentColor, setCurrentColor] = useState(color);

  useFrame((state) => {
    if (meshRef.current) {
      const worldPos = meshRef.current.position.clone();
      const screenPos = worldPos.project(state.camera);
      const distance = mousePosition.distanceTo(
        new THREE.Vector2(screenPos.x, screenPos.y),
      );

      let targetIntensity = 1.2;
      let targetColor = color;

      if (distance < 0.3) {
        const proximity = 1 - distance / 0.3;
        targetIntensity = 1.2 + proximity * 0.3;
        targetColor = proximity > 0.5 ? "#FFD700" : color;
      }

      const lerpFactor = 0.1;
      const newIntensity =
        currentIntensity + (targetIntensity - currentIntensity) * lerpFactor;

      setCurrentIntensity(newIntensity);
      setCurrentColor(targetColor);

      meshRef.current.rotation.z =
        state.clock.elapsedTime * 0.5 + starIndex * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[baseSize * 0.3, 4, 4]} />
      <meshBasicMaterial
        color={currentColor}
        transparent
        opacity={currentIntensity}
      />
      <pointLight
        intensity={currentIntensity * 3}
        distance={4}
        color={currentColor}
        decay={1.5}
      />
    </mesh>
  );
};

const ConstellationLine = ({
  start,
  end,
  opacity = 0.2,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  opacity?: number;
}) => {
  const geometry = useMemo(() => {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [start, end]);

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: "#444444",
            transparent: true,
            opacity: opacity * 0.8,
          }),
        )
      }
    />
  );
};

const ShootingStar = ({
  active,
  startPosition,
  endPosition,
}: {
  active: boolean;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    if (active && meshRef.current) {
      setProgress((prev) => {
        const newProgress = prev + 0.02;
        if (newProgress >= 1) {
          return 0;
        }
        return newProgress;
      });

      const x =
        startPosition[0] + (endPosition[0] - startPosition[0]) * progress;
      const y =
        startPosition[1] + (endPosition[1] - startPosition[1]) * progress;
      const z =
        startPosition[2] + (endPosition[2] - startPosition[2]) * progress;

      meshRef.current.position.set(x, y, z);

      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = Math.sin(progress * Math.PI) * 0.8;
      }
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 6]} />
      <meshBasicMaterial color="#FFD700" transparent />
    </mesh>
  );
};

const NightSky = () => {
  const { pointer } = useThree();
  const [mousePosition] = useState(new THREE.Vector2());
  const [shootingStarActive, setShootingStarActive] = useState(false);

  const stars = useMemo(() => {
    const starArray = [];
    const starColors = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const lightStarColors = ["#0088FF", "#0066CC", "#9955AA", "#CC3366"];

    for (let i = 0; i < 600; i++) {
      let x, y, z;

      if (i < 200) {
        x = (Math.random() - 0.5) * 150;
        y = (Math.random() - 0.5) * 80 + 10;
        z = (Math.random() - 0.5) * 150;
      } else if (i < 400) {
        x = (Math.random() - 0.5) * 100;
        y = (Math.random() - 0.5) * 60 + 5;
        z = (Math.random() - 0.5) * 100;
      } else {
        x = (Math.random() - 0.5) * 80;
        y = Math.random() * 70 - 30;
        z = (Math.random() - 0.5) * 80;
      }

      const size = Math.random() * 0.2 + 0.03;
      const colorIndex = Math.floor(Math.random() * starColors.length);
      const isColoredStar = Math.random() > 0.85;
      const darkColor = isColoredStar ? starColors[colorIndex] : "white";
      const lightColor = isColoredStar
        ? lightStarColors[colorIndex]
        : "#1a1a1a";

      starArray.push({
        position: [x, y, z] as [number, number, number],
        size,
        darkColor,
        lightColor,
        index: i,
      });
    }
    return starArray;
  }, []);

  const constellations = useMemo(() => {
    const connections = [];
    for (let i = 0; i < 40; i++) {
      const star1 = stars[Math.floor(Math.random() * stars.length)];
      const star2 = stars[Math.floor(Math.random() * stars.length)];

      if (star1 !== star2) {
        const distance = new THREE.Vector3(...star1.position).distanceTo(
          new THREE.Vector3(...star2.position),
        );

        if (distance < 20) {
          connections.push({
            start: new THREE.Vector3(...star1.position),
            end: new THREE.Vector3(...star2.position),
          });
        }
      }
    }
    return connections;
  }, [stars]);

  useFrame(() => {
    mousePosition.copy(pointer);
    if (Math.random() < 0.002) {
      setShootingStarActive(true);
      setTimeout(() => setShootingStarActive(false), 2000);
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />

      {stars.map((star) => (
        <InteractiveStar
          key={star.index}
          position={star.position}
          baseSize={star.size}
          color={star.lightColor}
          starIndex={star.index}
          mousePosition={mousePosition}
        />
      ))}

      {constellations.map((connection, index) => (
        <ConstellationLine
          key={index}
          start={connection.start}
          end={connection.end}
          opacity={0.08}
        />
      ))}

      <ShootingStar
        active={shootingStarActive}
        startPosition={[-50, 30, -50]}
        endPosition={[50, 10, 50]}
      />
    </>
  );
};

const Button = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
}) => {
  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/20 dark:border-white/20 px-10 text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-gray-400/30 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-gray-400/20 text-black dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#00000080_50%,#000000_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#ffffff80_50%,#ffffff_100%)]" />
      <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl">
        <button
          onClick={onClick}
          className="inline-flex h-14 rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 text-black dark:text-white border-[2px] border-black/20 dark:border-white/20 hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-gray-400/30 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-gray-400/20 transition-all px-10 gap-2 text-sm font-medium whitespace-nowrap cursor-pointer outline-none"
        >
          {children}
        </button>
      </div>
    </span>
  );
};

export default function Hero() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { openLogin } = useAuthModal();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      openLogin();
    }
  };

  return (
    <motion.section className="relative h-full grid place-content-center overflow-hidden px-4 py-24 text-gray-200">
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-3xl bg-gradient-to-br from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Shorten your Links
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed text-gray-800 dark:text-gray-200">
          Clean and efficient link shortening tool. Just drop a long URL and get a sleek short one.
        </p>
        <div className="flex gap-4">
          <Button onClick={handleGetStarted} variant="primary">
            Get Started
          </Button>
          <Button
            onClick={() =>
              window.open("https://github.com/gvrciary/nex-url", "_blank")
            }
            variant="outline"
          >
            <Github className="h-4 w-4 mr-2" />
            View Repository
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{
            position: [0, 0, 30],
            fov: 75,
          }}
          style={{ background: "transparent" }}
        >
          <NightSky />
        </Canvas>
      </div>
    </motion.section>
  );
}
