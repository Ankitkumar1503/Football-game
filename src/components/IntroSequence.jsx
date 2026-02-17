import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import touches from "../assets/touches.png";
import touches2 from "../assets/touches2.png";
import footballImg from "../assets/football-3.png"; // Assuming standard football image is available

export function IntroSequence({ onComplete }) {
  const [step, setStep] = useState(0); // 0: Animation, 1: Welcome Screen

  useEffect(() => {
    // Sequence Timeline
    // 0s-2s: Ball rolls in
    // 2s-4s: Stay & Pulse
    // 4s: Transition to Step 1 (Welcome)
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 4000);

    // 7s: End Intro
    const timer2 = setTimeout(() => {
      onComplete();
    }, 7500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md h-full relative shadow-2xl overflow-hidden bg-[#0A0A0A]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="screen-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full relative bg-[#00B4FF] flex flex-col items-center justify-center"
            >
              {/* Pitch Layout */}
              <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 w-full h-[30%] bg-[#39B54A]" />
                <div className="absolute bottom-[30%] w-full h-2 bg-white" />
                <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[60%] h-32 border-x-4 border-t-4 border-white" />
              </div>

              {/* Rolling Football Animation */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Ball Container - Positioned to roll on the 'grass' line */}
                  <motion.div
                    className="absolute bottom-[20%] left-1/2 w-48 h-48 -ml-24 -mb-1" // Centered horizontally, sitting on line
                    initial={{ x: "-100vw", y: -500, rotate: -720 }}
                    animate={{
                      x: 0,
                      y: [-400, 0, -200, 0, -80, 0, -20, 0], // Bounce keyframes
                      rotate: 0,
                    }}
                    transition={{
                      x: { duration: 3, ease: "circOut" },
                      y: {
                        duration: 3,
                        times: [0, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 1],
                        ease: "linear",
                      },
                      rotate: { duration: 3, ease: "circOut" },
                    }}
                  >
                    <img
                      src={footballImg}
                      alt="Football"
                      className="w-[50%] h-[50%] object-contain drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Text appearing after ball arrives */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="absolute top-[20%] w-full text-center"
                  >
                    <img
                      src={touches}
                      alt="TOUCHES"
                      className="h-16 mx-auto brightness-0 invert"
                    />
                    <p className="text-white font-black tracking-widest mt-2 text-xl drop-shadow-md">
                      FOOTBALLER ATHLETICS
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full relative bg-[#00B4FF] flex flex-col items-center justify-center p-8"
            >
              {/* Background elements simpler for screen 2 or same? Keeping consistent */}
              <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 w-full h-[30%] bg-[#39B54A]" />
                <div className="absolute bottom-[30%] w-full h-2 bg-white" />
              </div>

              <div className="z-10 text-center space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-white text-3xl font-light">Welcome to</h2>
                  <h1 className="text-white text-5xl font-black uppercase mt-2 drop-shadow-lg">
                    Footballer Athletics
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <img
                    src={touches2}
                    alt="Logo"
                    className="w-32 h-32 mx-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-12 left-0 right-0 text-center"
                >
                  <h3 className="text-white text-2xl italic font-serif">
                    "For the players"
                  </h3>
                  <p className="text-white/80 text-xs mt-4">
                    © 2026 Clem Murdock
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
