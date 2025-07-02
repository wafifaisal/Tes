"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Sparkles, PartyPopper } from "lucide-react";
import * as THREE from "three";

const GirlfriendHappyApp = () => {
  const [noClickCount, setNoClickCount] = useState(0);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isHappyMode, setIsHappyMode] = useState(false);
  type FloatingHeartType = {
    id: string;
    left: number;
    animationDuration: number;
    emoji: string;
  };
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartType[]>([]);
  const [show3DAnimation, setShow3DAnimation] = useState(false);
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const photos = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/1.png",
  ];

  const messages = [
    "Aku cuma mau liat bebeb bahagia aja kok 🥺",
    "Please baby, bebebb tuh cantik banget waktu senyum 😍",
    "Ayolah bebeb, happiness looks good on you 💕",
    "Bebeb tau ga? Senyum bebeb tuh bikin hari aku cerah ☀️",
    "Last chance nih, please be happy for me? 🙏✨",
  ];

  const questions = [
    "Bebebb happy ga? 💕",
    "Bebebb mau senyum ga? 😊",
    "Bebebb mau jadi happy person ga? ✨",
    "Please bebebb, happy ya? 🥺",
    "Pokoknya bebeb harus happy! 💖",
  ];

  const getCurrentMessage = () => {
    if (noClickCount === 0) return messages[0];
    return messages[Math.min(noClickCount - 1, messages.length - 1)];
  };

  const getCurrentQuestion = () => {
    if (noClickCount === 0) return questions[0];
    return questions[Math.min(noClickCount - 1, questions.length - 1)];
  };

  const getCurrentPhoto = () => {
    return photos[Math.min(currentPhotoIndex, photos.length - 1)];
  };

  // Create 3D celebration scene
  const create3DCelebration = useCallback(() => {
    if (!threeContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create 3D hearts
    const heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(
      heartShape,
      extrudeSettings
    );
    const hearts: THREE.Mesh<
      THREE.ExtrudeGeometry,
      THREE.MeshStandardMaterial,
      THREE.Object3DEventMap
    >[] = [];

    // Create fireworks effect
    const createFireworks = () => {
      const fireworksContainer = document.createElement("div");
      fireworksContainer.className = "fixed inset-0 pointer-events-none z-40";
      document.body.appendChild(fireworksContainer);

      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const firework = document.createElement("div");
          firework.className = "fireworks";
          firework.style.left = Math.random() * 100 + "%";
          firework.style.top = Math.random() * 100 + "%";
          firework.style.backgroundColor = [
            "#ffd700",
            "#ff69b4",
            "#00ff7f",
            "#ff1493",
            "#4ecdc4",
          ][Math.floor(Math.random() * 5)];
          firework.style.animationDelay = Math.random() * 1 + "s";
          fireworksContainer.appendChild(firework);

          setTimeout(() => firework.remove(), 2000);
        }, i * 200);
      }

      setTimeout(() => fireworksContainer.remove(), 5000);
    };

    // Enhanced 3D hearts with premium materials
    const heartColors = [
      0xffd700, 0xff69b4, 0x00ff7f, 0xff1493, 0x4ecdc4, 0xffffff,
    ];

    for (let i = 0; i < 50; i++) {
      // Increased from 30 to 50
      const heartMaterial = new THREE.MeshStandardMaterial({
        color: heartColors[i % heartColors.length],
        metalness: 0.7,
        roughness: 0.2,
        emissive: new THREE.Color(
          heartColors[i % heartColors.length]
        ).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.95,
      });

      const heart = new THREE.Mesh(heartGeometry, heartMaterial);

      // Enhanced positioning
      heart.position.set(
        (Math.random() - 0.5) * 3000,
        (Math.random() - 0.5) * 3000,
        (Math.random() - 0.5) * 2000
      );

      // Enhanced rotation
      heart.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Enhanced scale variation
      const scale = Math.random() * 0.8 + 0.4;
      heart.scale.set(scale, scale, scale);

      heart.userData = {
        initialPosition: heart.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        ),
      };

      scene.add(heart);
      hearts.push(heart);
    }

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    // Multiple colored lights for premium effect
    const lights: { color: number; position: [number, number, number] }[] = [
      { color: 0xffd700, position: [100, 100, 100] },
      { color: 0xff69b4, position: [-100, 100, 100] },
      { color: 0x00ff7f, position: [100, -100, 100] },
      { color: 0x4ecdc4, position: [-100, -100, 100] },
    ];

    lights.forEach(({ color, position }) => {
      const light = new THREE.DirectionalLight(color, 1.2);
      light.position.set(...position);
      scene.add(light);
    });

    // Enhanced point lights
    const pointLights: THREE.PointLight[] = [];
    for (let i = 0; i < 3; i++) {
      const pointLight = new THREE.PointLight(
        [0xffd700, 0xff69b4, 0x00ff7f][i],
        2,
        2000
      );
      pointLight.position.set(
        Math.cos((i * Math.PI * 2) / 3) * 400,
        Math.sin((i * Math.PI * 2) / 3) * 400,
        200
      );
      scene.add(pointLight);
      pointLights.push(pointLight);
    }

    // Enhanced sparkles
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparklePositions = [];
    const sparkleColors = [];

    for (let i = 0; i < 500; i++) {
      // Increased particles
      sparklePositions.push(
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 3000
      );

      const color = new THREE.Color();
      color.setHSL(Math.random(), 1.0, 0.8);
      sparkleColors.push(color.r, color.g, color.b);
    }

    sparkleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sparklePositions, 3)
    );
    sparkleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(sparkleColors, 3)
    );

    const sparkleMaterial = new THREE.PointsMaterial({
      size: 20,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    camera.position.z = 800;

    // Start fireworks
    createFireworks();

    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Enhanced animations
      hearts.forEach((heart, index) => {
        // More dynamic floating motion
        heart.position.y += Math.sin(time * 2 + index) * 3;
        heart.position.x += Math.cos(time * 1.5 + index * 0.5) * 2;
        heart.position.z += Math.sin(time * 0.8 + index * 0.3) * 1.5;

        // Enhanced rotation
        heart.rotation.x += heart.userData.rotationSpeed.x;
        heart.rotation.y += heart.userData.rotationSpeed.y;
        heart.rotation.z += heart.userData.rotationSpeed.z;

        // Enhanced pulsing scale
        const pulseScale = 1.2 + Math.sin(time * 4 + index) * 0.4;
        heart.scale.setScalar(pulseScale * (Math.random() * 0.6 + 0.5));

        // Enhanced color animation
        const hue = (time * 0.5 + index * 0.1) % 1;
        heart.material.color.setHSL(hue, 1, 0.7);
        heart.material.emissive.setHSL(hue, 0.8, 0.3);
      });

      // Enhanced sparkles animation
      const positions = sparkles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 2 + i) * 3;
        positions[i] += Math.cos(time * 1.5 + i * 0.01) * 2;
        positions[i + 2] += Math.sin(time * 0.8 + i * 0.005) * 1.5;
      }
      sparkles.geometry.attributes.position.needsUpdate = true;

      // Enhanced camera movement
      camera.position.x = Math.cos(time * 0.3) * 400;
      camera.position.y = Math.sin(time * 0.2) * 200;
      camera.position.z = 800 + Math.sin(time * 0.1) * 200;
      camera.lookAt(0, 0, 0);

      // Enhanced lights animation
      pointLights.forEach((light, index) => {
        const angle = time + (index * Math.PI * 2) / 3;
        light.position.x = Math.cos(angle) * 500;
        light.position.y = Math.sin(angle) * 500;
        light.position.z = 200 + Math.sin(time * 2 + index) * 100;
        light.intensity = 2 + Math.sin(time * 3 + index) * 1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Auto cleanup after 10 seconds (extended for premium experience)
    setTimeout(() => {
      setShow3DAnimation(false);
    }, 10000);
  }, []);

  // Cleanup 3D scene
  const cleanup3DScene = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (rendererRef.current && threeContainerRef.current) {
      threeContainerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
    }
  }, []);

  // Handle window resize for 3D scene
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && sceneRef.current) {
        const camera = sceneRef.current.children.find(
          (child) => child instanceof THREE.PerspectiveCamera
        );
        if (camera) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      }
    };

    if (show3DAnimation) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [show3DAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup3DScene();
    };
  }, [cleanup3DScene]);
  useEffect(() => {
    const createHeart = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const newHeart = {
        id,
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 4,
        emoji: Math.random() > 0.5 ? "💖" : "💕",
      };

      setFloatingHearts((prev) => [...prev, newHeart]);

      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
      }, newHeart.animationDuration * 1000);
    };

    const interval = setInterval(createHeart, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNoClick = useCallback(() => {
    setNoClickCount((prev) => prev + 1);
    setYesButtonSize((prev) => prev + 0.4);
    setCurrentPhotoIndex((prev) => Math.min(prev + 1, photos.length - 1));

    // Photo change animation
    setIsPhotoChanged(true);
    setTimeout(() => setIsPhotoChanged(false), 500);
  }, [photos.length]);

  const handleYesClick = useCallback(() => {
    setIsHappyMode(true);
    setShowCelebration(true);
    setShow3DAnimation(true);

    // Start 3D celebration
    setTimeout(() => {
      create3DCelebration();
    }, 100);

    // Create multiple celebration bursts
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    // Cleanup 3D after animation
    setTimeout(() => {
      cleanup3DScene();
    }, 8500);
  }, [create3DCelebration, cleanup3DScene]);

  type ConfettiPieceProps = {
    delay: number;
    duration: number;
    color: string;
  };

  const ConfettiPiece = ({ delay, duration, color }: ConfettiPieceProps) => (
    <div
      className="absolute w-3 h-3 rounded-full opacity-90"
      style={{
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        animation: `confetti-fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

  const FloatingHeart = ({ heart }: { heart: FloatingHeartType }) => (
    <div
      key={heart.id}
      className="fixed text-2xl pointer-events-none z-10 animate-pulse"
      style={{
        left: `${heart.left}%`,
        animation: `float-up ${heart.animationDuration}s ease-out forwards`,
        bottom: "-50px",
      }}
    >
      {heart.emoji}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 3D Animation Container */}
      {show3DAnimation && (
        <div
          ref={threeContainerRef}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ background: "transparent" }}
        />
      )}
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .gradient-shift {
          background: linear-gradient(
            270deg,
            #8b5cf6,
            #3b82f6,
            #ec4899,
            #8b5cf6
          );
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .photo-glow {
          box-shadow: 0 0 40px rgba(236, 72, 153, 0.6);
        }

        .photo-glow.celebration {
          box-shadow: 0 0 60px rgba(236, 72, 153, 1),
            0 0 120px rgba(255, 215, 0, 0.8);
          animation: photo-celebration 2s ease-in-out infinite;
        }

        @keyframes photo-celebration {
          0%,
          100% {
            box-shadow: 0 0 60px rgba(236, 72, 153, 1),
              0 0 120px rgba(255, 215, 0, 0.8);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 80px rgba(236, 72, 153, 1),
              0 0 160px rgba(255, 215, 0, 1);
            transform: scale(1.05);
          }
        }

        .premium-text {
          background: linear-gradient(
            45deg,
            #ffd700,
            #ff69b4,
            #00ff7f,
            #ff1493,
            #ffd700
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-text 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          text-shadow: 0 0 40px rgba(255, 105, 180, 0.8);
        }

        @keyframes gradient-text {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .mega-celebration {
          animation: mega-bounce 1s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes mega-bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-20px) scale(1.1);
          }
          60% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        .premium-glow {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8),
            0 0 40px rgba(255, 105, 180, 0.6), 0 0 60px rgba(0, 255, 127, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .fireworks {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: firework 2s ease-out infinite;
        }

        @keyframes firework {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .premium-container {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(255, 215, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        @keyframes bounce-gentle {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* Floating Hearts */}
      {floatingHearts.map((heart) => (
        <FloatingHeart key={heart.id} heart={heart} />
      ))}

      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <ConfettiPiece
              key={i}
              delay={i * 0.1}
              duration={Math.random() * 2 + 2}
              color={
                [
                  "#FF69B4",
                  "#FFD700",
                  "#FF1493",
                  "#00FF7F",
                  "#FF6B6B",
                  "#4ECDC4",
                ][i % 6]
              }
            />
          ))}
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 gradient-shift"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="glass-morphism rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
          {/* Photo Section */}
          <div
            className={`mb-8 transition-all duration-500 ${
              isPhotoChanged ? "scale-105 rotate-2" : ""
            }`}
          >
            <div className="relative">
              <div
                className={`w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-pink-400 photo-glow ${
                  isHappyMode ? "celebration" : ""
                }`}
              >
                <img
                  src={getCurrentPhoto()}
                  alt="Cute couple"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isHappyMode ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Sparkles around photo */}
              <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-8 h-8 animate-pulse" />
              <Heart className="absolute -bottom-4 -left-4 text-pink-400 w-8 h-8 animate-bounce" />
            </div>
          </div>

          {/* Question */}
          <h1
            className={`text-4xl md:text-5xl font-bold text-white mb-6 ${
              isHappyMode ? "animate-bounce text-yellow-300" : "bounce-gentle"
            }`}
          >
            {getCurrentQuestion()}
          </h1>

          {/* Message */}
          <p
            className={`text-white/90 mb-8 text-lg md:text-xl font-medium leading-relaxed ${
              isHappyMode ? "animate-pulse text-pink-300" : ""
            }`}
          >
            {isHappyMode ? (
              <>
                <PartyPopper className="inline-block w-6 h-6 mr-2 animate-spin" />
                Yay! Bebebb happy! Aku sayang banget sama bebebb!
                <Heart className="inline-block w-6 h-6 mx-2 text-pink-400 animate-bounce" />
                Makasih udah mau bahagia! 🎉✨
              </>
            ) : (
              getCurrentMessage()
            )}
          </p>

          {/* Buttons */}
          {!isHappyMode && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
              <button
                onClick={handleYesClick}
                className="relative group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105"
                style={{
                  transform: `scale(${yesButtonSize})`,
                  fontSize: `${Math.min(
                    1.2 + (yesButtonSize - 1) * 0.3,
                    2
                  )}rem`,
                  minWidth: "140px",
                }}
              >
                <span className="relative z-10">YES! 💖</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={handleNoClick}
                className="bg-gray-600/80 hover:bg-gray-700/80 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-500/50"
              >
                {noClickCount >= 5 ? "Udah ah! 😤" : "No 😢"}
              </button>
            </div>
          )}

          {/* Counter/Status */}
          <div className="text-white/70 text-sm space-y-2">
            {isHappyMode ? (
              <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl p-6 border-2 border-pink-300/50 backdrop-blur-sm animate-pulse">
                <p className="text-white font-bold text-xl mb-3 animate-bounce">
                  🎉 CELEBRATION MODE ACTIVATED! 🎉
                </p>
                <p className="text-pink-200 font-semibold text-lg mb-2">
                  Sekarang bebeb udah happy kan? 😊
                </p>
                <p className="text-white/90">
                  Jangan lupa senyum terus ya! Love you 💖
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="animate-bounce">🎊</span>
                  <span className="animate-bounce delay-100">💖</span>
                  <span className="animate-bounce delay-200">🌟</span>
                  <span className="animate-bounce delay-300">🎉</span>
                  <span className="animate-bounce delay-400">💕</span>
                </div>
              </div>
            ) : (
              <>
                {noClickCount === 0 ? (
                  <p>Klik No berapa kali pun, jawabannya tetap sama kok 😉</p>
                ) : (
                  <p>Udah {noClickCount} kali bilang No nih 😏</p>
                )}

                {noClickCount > 0 && (
                  <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-300/30">
                    <p className="text-blue-200 text-xs">
                      💡 Psst... tombol YES nya makin gede loh!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/50 text-sm">
          Made with 💖 using Next.js 14 & Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default GirlfriendHappyApp;
