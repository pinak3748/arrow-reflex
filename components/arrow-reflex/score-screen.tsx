"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { GameStats } from "../arrow-reflex"

interface ScoreScreenProps {
  stats: GameStats
  onSubmitLeaderboard: (handle: string) => void | Promise<void>
  onPlayAgain: () => void
  onViewLeaderboard: () => void
  GAME_DURATION: number
  MAX_ARROWS: number
  isSubmitting?: boolean
  submitError?: string | null
}

export default function ScoreScreen({
  stats,
  onSubmitLeaderboard,
  onPlayAgain,
  onViewLeaderboard,
  GAME_DURATION,
  MAX_ARROWS,
  isSubmitting = false,
  submitError = null,
}: ScoreScreenProps) {
  const [handle, setHandle] = useState("")
  const total = stats.correct + stats.wrong
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0

  const handleSubmit = async () => {
    if (!handle.trim()) {
      await onSubmitLeaderboard("Anonymous")
    } else {
      await onSubmitLeaderboard(handle)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-white px-4"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <h2 className="text-5xl font-black">Game Over</h2>
          <p className="text-gray-600 font-light">You completed {stats.correct} arrows</p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Arrows Completed - Large */}
          <div className="bg-black text-white p-8 rounded-lg text-center space-y-2">
            <div className="text-sm font-bold uppercase tracking-widest text-gray-300">Arrows Completed</div>
            <div className="text-6xl font-black">{stats.correct}</div>
            <div className="text-sm text-gray-400">
              {stats.correct === MAX_ARROWS ? "Perfect! 🎉" : `of ${MAX_ARROWS}`}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-100 p-4 rounded-lg text-center space-y-1">
              <div className="text-2xl font-black text-green-600">{stats.correct}</div>
              <div className="text-xs text-gray-600 font-medium">Correct</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center space-y-1">
              <div className="text-2xl font-black text-red-600">{stats.wrong}</div>
              <div className="text-xs text-gray-600 font-medium">Wrong</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center space-y-1">
              <div className="text-2xl font-black">{accuracy}%</div>
              <div className="text-xs text-gray-600 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Time */}
          <div className="text-center text-gray-600 font-light">
            <span className="font-bold text-black">{stats.timeElapsed}s</span>
            {" / "}
            <span>{GAME_DURATION}s</span>
          </div>
        </motion.div>

        {/* Twitter Handle Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="text-sm font-bold uppercase tracking-widest text-gray-700">Twitter Handle</label>
          <input
            type="text"
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            disabled={isSubmitting}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSubmitting) {
                handleSubmit()
              }
            }}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all font-light disabled:opacity-50"
          />
          {submitError && (
            <p className="text-sm text-red-600 font-medium">{submitError}</p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white font-bold py-3 rounded-lg transition-all hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </motion.button>
          <motion.button
            onClick={onPlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black font-bold py-3 rounded-lg border-2 border-black transition-all hover:bg-gray-50"
          >
            Play Again
          </motion.button>
          <motion.button
            onClick={onViewLeaderboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-100 text-black font-bold py-3 rounded-lg transition-all hover:bg-gray-200"
          >
            View Leaderboard
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
