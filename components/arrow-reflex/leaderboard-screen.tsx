"use client"

import { motion } from "framer-motion"
import type { LeaderboardEntry } from "@/lib/leaderboard"

interface LeaderboardScreenProps {
  leaderboard: LeaderboardEntry[]
  isLoading?: boolean
  error?: string | null
  onPlayAgain: () => void
  onBackToHome: () => void
}

export default function LeaderboardScreen({
  leaderboard,
  isLoading = false,
  error = null,
  onPlayAgain,
  onBackToHome,
}: LeaderboardScreenProps) {
  const getMedalEmoji = (index: number) => {
    const medals = ["🥇", "🥈", "🥉"]
    return medals[index] || null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-screen bg-white px-4 py-8"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl font-black">Leaderboard</h1>
          <p className="text-gray-600 font-light">Top players by arrows completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-1 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 font-light">
              <p>Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600 font-medium">
              <p>{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-light">
              <p>No scores yet.</p>
              <p>Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-3 text-center">Arrows</div>
                <div className="col-span-3 text-right">Time</div>
              </div>

              {/* Data Rows */}
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors items-center"
                >
                  <div className="col-span-1 font-bold text-lg">{getMedalEmoji(index) || `${index + 1}`}</div>
                  <div className="col-span-5 flex items-center gap-3">
                    {entry.twitter_profile_image && (
                      <img
                        src={entry.twitter_profile_image || "/placeholder.svg"}
                        alt={entry.handle}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="font-medium text-black truncate">
                      {entry.handle.startsWith('@') ? entry.handle : `@${entry.handle}`}
                    </span>
                  </div>
                  <div className="col-span-3 text-center font-bold">{entry.score || entry.arrows}</div>
                  <div className="col-span-3 text-right font-medium text-gray-700">{entry.time_taken || entry.time}s</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            onClick={onPlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white font-bold py-4 rounded-lg transition-all hover:bg-gray-900"
          >
            Play Again
          </motion.button>
          <motion.button
            onClick={onBackToHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-black font-bold py-4 rounded-lg border-2 border-black transition-all hover:bg-gray-50"
          >
            Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
