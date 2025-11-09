"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { GameStats } from "../arrow-reflex"

type Direction = "up" | "down" | "left" | "right"

interface GameScreenProps {
  onGameFinished: (stats: GameStats) => void
  GAME_DURATION: number
  MAX_ARROWS: number
}

interface CardState {
  id: number
  direction: Direction
}

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"]

const ARROW_MAP: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
}

export default function GameScreen({ onGameFinished, GAME_DURATION, MAX_ARROWS }: GameScreenProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [card, setCard] = useState<CardState>({
    id: 0,
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  })
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [pressedDirection, setPressedDirection] = useState<Direction | null>(null)
  const [gameActive, setGameActive] = useState(true)

  // Main game timer
  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  // End game when time is up
  useEffect(() => {
    if (timeLeft === 0) {
      setGameActive(false)
      onGameFinished({
        correct,
        wrong,
        timeElapsed: GAME_DURATION,
      })
    }
  }, [timeLeft, correct, wrong, GAME_DURATION, onGameFinished])

  // Handle keyboard input
  useEffect(() => {
    if (!gameActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedDir = KEY_MAP[e.key]
      if (!pressedDir) return

      e.preventDefault()

      // Trigger visual feedback
      setPressedDirection(pressedDir)

      // Check if correct
      const isCorrect = pressedDir === card.direction
      const newCorrect = correct + (isCorrect ? 1 : 0)
      const newWrong = wrong + (isCorrect ? 0 : 1)

      // Check if game should end
      if (newCorrect >= MAX_ARROWS) {
        setGameActive(false)
        onGameFinished({
          correct: newCorrect,
          wrong: newWrong,
          timeElapsed: GAME_DURATION - timeLeft,
        })
        return
      }

      // Update stats
      setCorrect(newCorrect)
      setWrong(newWrong)

      setTimeout(() => {
        const newDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
        setCard({
          id: card.id + 1,
          direction: newDirection,
        })
        setPressedDirection(null)
      }, 80)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [card, gameActive, correct, wrong, timeLeft, MAX_ARROWS, onGameFinished])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white px-4 gap-12"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-center space-y-2"
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600">Arrow Reflex</h2>
        <p className="text-gray-500 font-light">Match the arrow direction</p>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-7xl font-black tabular-nums"
      >
        {timeLeft.toString().padStart(2, "0")}
        <span className="text-3xl font-light text-gray-400">s</span>
      </motion.div>

      {/* Progress */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600 font-medium">{correct} / 50</div>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(correct / 50) * 100}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-black"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: -250 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 250 }}
          transition={{ duration: 0.08 }}
          className="relative"
        >
          <div className="flex items-center justify-center w-48 h-48 bg-black rounded-2xl shadow-lg border-4 border-black">
            <div className="text-9xl text-white select-none">{ARROW_MAP[card.direction]}</div>
          </div>

          {/* Feedback indicator */}
          {pressedDirection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={`absolute inset-0 rounded-2xl border-4 transition-colors ${
                pressedDirection === card.direction ? "border-green-500 bg-green-50/50" : "border-red-500 bg-red-50/50"
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex gap-8 text-center"
      >
        <div className="space-y-1">
          <div className="text-2xl font-black text-green-600">{correct}</div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Correct</div>
        </div>
        <div className="w-px bg-gray-300" />
        <div className="space-y-1">
          <div className="text-2xl font-black text-red-600">{wrong}</div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Wrong</div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-gray-500 text-center font-light"
      >
        <p>Press ↑ ↓ ← → or W A S D</p>
      </motion.div>
    </motion.div>
  )
}
