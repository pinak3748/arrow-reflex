"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LeaderboardScreen from "@/components/arrow-reflex/leaderboard-screen"
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard"

const ITEMS_PER_PAGE = 100

export default function LeaderboardPage() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadLeaderboard(true)
  }, [])

  const loadLeaderboard = async (initial = false) => {
    if (initial) {
      setIsLoading(true)
      setError(null)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const offset = initial ? 0 : leaderboard.length
      const data = await fetchLeaderboard(ITEMS_PER_PAGE, offset)
      
      if (initial) {
        setLeaderboard(data)
      } else {
        setLeaderboard((prev) => [...prev, ...data])
      }

      // Check if there are more items to load
      setHasMore(data.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error("Failed to load leaderboard:", error)
      setError("Failed to load leaderboard. Please try again.")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadLeaderboard(false)
    }
  }

  const handlePlayAgain = () => {
    router.push("/")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <LeaderboardScreen
      leaderboard={leaderboard}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      onPlayAgain={handlePlayAgain}
      onBackToHome={handleBackToHome}
    />
  )
}

