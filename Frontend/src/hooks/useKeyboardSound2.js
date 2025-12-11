import { useEffect, useRef } from "react";

const soundFiles = [
  "/sounds/keystroke1.mp3",
  "/sounds/keystroke2.mp3",
  "/sounds/keystroke3.mp3",
  "/sounds/keystroke4.mp3",
];

const useKeyboardSound = () => {
  const audioContextRef = useRef(null);
  const buffersRef = useRef([]);

  // Initialize Web Audio + load sounds
  useEffect(() => {
    const initAudio = async () => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const loadedBuffers = await Promise.all(
        soundFiles.map(async (file) => {
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          return await audioCtx.decodeAudioData(arrayBuffer);
        })
      );

      buffersRef.current = loadedBuffers;
    };

    initAudio();
  }, []);

  const playRandomKeyStrokeSound = () => {
    const audioCtx = audioContextRef.current;
    const buffers = buffersRef.current;

    if (!audioCtx || buffers.length === 0) return;

    const randomBuffer =
      buffers[Math.floor(Math.random() * buffers.length)];

    const source = audioCtx.createBufferSource();
    source.buffer = randomBuffer;

    // Gain node = volume boost
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 3.0; // 🔊 200% louder — adjust as you like (1 = normal)

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start(0);
  };

  return { playRandomKeyStrokeSound };
};

export default useKeyboardSound;
