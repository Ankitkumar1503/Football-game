import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import touches from "../assets/touches.png";
import touches2 from "../assets/touches2.png";
import touchesLight from "../assets/touches-intro.png";

const bgColor = "#E8470A";

// const PulsingIcon = ({ src, alt, onClick, tapLabel }) => (
//   <div className="flex flex-col items-center gap-5">
//     <motion.button
//       onClick={onClick}
//       initial={{ scale: 0, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
//       whileTap={{ scale: 0.88 }}
//       whileHover={{ scale: 1.06 }}
//       className="focus:outline-none relative flex items-center justify-center"
//     >
//       <motion.div
//         className="absolute rounded-full"
//         style={{
//           width: 160,
//           height: 160,
//           backgroundColor: "rgba(255,255,255,0.12)",
//         }}
//         animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0, 0.5] }}
//         transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="absolute rounded-full"
//         style={{
//           width: 130,
//           height: 130,
//           backgroundColor: "rgba(255,255,255,0.1)",
//         }}
//         animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
//         transition={{
//           duration: 2.8,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 0.5,
//         }}
//       />
//       <img
//         src={src}
//         alt={alt}
//         className="w-52 h-52 object-contain relative z-10 brightness-0 invert"
//       />
//     </motion.button>

//     <motion.p
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 0.65, y: 0 }}
//       transition={{ delay: 1.0, duration: 0.6 }}
//       className="text-white text-[10px] tracking-[0.3em] uppercase"
//     >
//       {tapLabel}
//     </motion.p>
//   </div>
// );

const PulsingIcon = ({ src, alt, onClick, tapLabel }) => (
  <div className="flex flex-col items-center gap-5">
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      className="focus:outline-none relative flex items-center justify-center"
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 230,
          height: 230,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <img
        src={src}
        alt={alt}
        className="w-52 h-52 object-contain relative z-10 brightness-0 invert"
      />
    </motion.button>

    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 0.65, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="text-white text-[10px] tracking-[0.3em] uppercase"
    >
      {tapLabel}
    </motion.p>
  </div>
);
export function IntroSequence({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 0) setStep(1);
      else onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [step, onComplete]);

  const handleTap = () => {
    if (step === 0) setStep(1);
    else onComplete();
  };

  return (
    // Same fixed overlay as before, but now matches your app's max-w-md container
    <div
      className="fixed inset-0 z-[9999] flex justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      {/* Matches your app's max-w-md mobile container exactly */}
      <div
        className="relative w-full max-w-md overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Subtle top shine */}
        <div
          className="absolute top-0 left-0 right-0 h-40 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)",
          }}
        />

        <AnimatePresence mode="wait">
          {/* ── SCREEN 1: TOUCHES ── */}
          {step === 0 && (
            <motion.div
              key="screen-footballer"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-between px-8 py-20"
            >
              <div />

              {/*
                Replace touches2 with footballer icon when available:
                import footballerIcon from "../assets/footballer-icon.png"
                src={footballerIcon}
              */}
              <PulsingIcon
                src={touchesLight}
                alt="Footballer Athletics Icon"
                onClick={handleTap}
                tapLabel="tap to continue"
                className="w-48 h-48"
              />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.05em" }}
                  animate={{ opacity: 1, letterSpacing: "0.18em" }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-white text-lg uppercase"
                >
                  <span className="font-black">FOOTBALLER</span>{" "}
                  <span className="font-light">ATHLETICS</span>
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* ── SCREEN 2: FOOTBALLER ATHLETICS ── */}
          {step === 1 && (
            <motion.div
              key="screen-touches"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.18 }}
              transition={{ duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-between px-8 py-20"
            >
              <div />

              <PulsingIcon
                src={touches2}
                alt="Touches Icon"
                onClick={handleTap}
                tapLabel="tap to enter"
                className="w-48 h-48"
              />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={touches}
                  alt="TOUCHES"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.35em" }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-white font-black text-[11px] uppercase"
                >
                  FOR THE PLAYERS
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
