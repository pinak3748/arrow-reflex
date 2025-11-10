"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import HomeScreen from "./arrow-reflex/home-screen"
import GameScreen from "./arrow-reflex/game-screen"
import ScoreScreen from "./arrow-reflex/score-screen"
import { submitScore } from "@/lib/leaderboard"

type Direction = "up" | "down" | "left" | "right"
type GameState = "home" | "countdown" | "playing" | "finished"

export interface GameStats {
  correct: number
  wrong: number
  timeElapsed: number
}

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"]
const GAME_DURATION = 30
const MAX_ARROWS = 50

export default function ArrowReflex() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>("home")
  const [countdownValue, setCountdownValue] = useState(3)
  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0, timeElapsed: 0 })
  const [isSubmittingScore, setIsSubmittingScore] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (gameState !== "countdown") return

    if (countdownValue > 0) {
      const timer = setTimeout(() => {
        setCountdownValue(countdownValue - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdownValue === 0) {
      const timer = setTimeout(() => {
        setGameState("playing")
        setCountdownValue(3)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [gameState, countdownValue])

  const handleStartGame = () => {
    setGameState("countdown")
    setCountdownValue(3)
    setStats({ correct: 0, wrong: 0, timeElapsed: 0 })
  }

  const handleGameFinished = (finalStats: GameStats) => {
    setStats(finalStats)
    setGameState("finished")
  }

  const handlePlayAgain = () => {
    handleStartGame()
  }

  const handleSubmitToLeaderboard = async (handle: string) => {
    setIsSubmittingScore(true)
    setSubmitError(null)
    try {
      const result = await submitScore(
        handle || "Anonymous",
        stats.correct, // score
        stats.timeElapsed, // timeTaken
        stats.correct, // correct
        stats.wrong, // wrong
      )
      if (result) {
        // Navigate to leaderboard page after successful submission
        router.push("/leaderboard")
      } else {
        setSubmitError("Failed to submit score. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting score:", error)
      setSubmitError("Failed to submit score. Please try again.")
    } finally {
      setIsSubmittingScore(false)
    }
  }

  const handleViewLeaderboard = () => {
    router.push("/leaderboard")
  }


  return (
    <div className="w-full min-h-screen bg-white text-black">
      <AnimatePresence mode="wait">
        {gameState === "home" && (
          <HomeScreen key="home" onStartGame={handleStartGame} onViewLeaderboard={handleViewLeaderboard} />
        )}
        {gameState === "countdown" && (
          <div key="countdown" className="flex items-center justify-center min-h-screen">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              {countdownValue > 0 ? (
                <motion.div
                  key={countdownValue}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-9xl font-black"
                >
                  {countdownValue}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-7xl font-black"
                >
                  Go!
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
        {gameState === "playing" && (
          <GameScreen
            key="game"
            onGameFinished={handleGameFinished}
            GAME_DURATION={GAME_DURATION}
            MAX_ARROWS={MAX_ARROWS}
          />
        )}
        {gameState === "finished" && (
          <ScoreScreen
            key="score"
            stats={stats}
            onSubmitLeaderboard={handleSubmitToLeaderboard}
            onPlayAgain={handlePlayAgain}
            onViewLeaderboard={handleViewLeaderboard}
            GAME_DURATION={GAME_DURATION}
            MAX_ARROWS={MAX_ARROWS}
            isSubmitting={isSubmittingScore}
            submitError={submitError}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
