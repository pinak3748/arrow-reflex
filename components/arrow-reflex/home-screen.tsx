"use client"

import { motion } from "framer-motion"

interface HomeScreenProps {
  onStartGame: () => void
  onViewLeaderboard: () => void
}

export default function HomeScreen({ onStartGame, onViewLeaderboard }: HomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-white px-4"
    >
      <div className="w-full max-w-md text-center space-y-12">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div
                className="absolute inset-0 bg-gradient-to-br from-black to-black rounded-3xl shadow-lg"
                style={{
                  boxShadow: "0 10px 30px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-center h-full text-white text-5xl">↑</div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight">Arrow Reflex</h1>
            <p className="text-base text-gray-600 font-light">Test your reflexes. Press the matching arrow.</p>
          </div>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 text-left bg-gray-50 p-8 rounded-xl border border-gray-200"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">How to Play</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="font-bold text-black min-w-fit">30s</span>
              <span>to complete as many arrows as possible</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-black min-w-fit">50 max</span>
              <span>finish all 50 arrows to complete the game</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-black min-w-fit">Match</span>
              <span>press arrow keys or WASD to match direction</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            onClick={onStartGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white font-bold py-4 rounded-lg text-base transition-all hover:bg-gray-900"
          >
            Start Game
          </motion.button>
          <motion.button
            onClick={onViewLeaderboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-black font-bold py-4 rounded-lg border-2 border-black transition-all hover:bg-gray-50"
          >
            Leaderboard
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
