import { createClient } from "@/lib/supabase/client"

export interface LeaderboardEntry {
  id: number
  handle: string
  score: number
  time_taken: number
  accuracy: number
  twitter_profile_image: string | null
  created_at?: string
  // Legacy fields for backward compatibility
  arrows?: number
  time?: number
}

/**
 * Determines if a new score is better than an existing score
 * Better means: higher score, or same score with lower time, or same score/time with higher accuracy
 */
function isNewScoreBetter(
  newScore: number,
  newTime: number,
  newAccuracy: number,
  existingScore: number,
  existingTime: number,
  existingAccuracy: number,
): boolean {
  // Higher score is always better
  if (newScore > existingScore) return true
  if (newScore < existingScore) return false

  // Same score: lower time is better
  if (newTime < existingTime) return true
  if (newTime > existingTime) return false

  // Same score and time: higher accuracy is better
  return newAccuracy > existingAccuracy
}

export async function submitScore(
  handle: string,
  score: number,
  timeTaken: number,
  correct: number,
  wrong: number,
): Promise<LeaderboardEntry | null> {
  const supabase = createClient()

  try {
    // Calculate accuracy
    const total = correct + wrong
    const accuracy = total > 0 ? Math.round((correct / total) * 10000) / 100 : 0 // Round to 2 decimal places

    // Clean handle (remove @ if present)
    const cleanHandle = handle.replace(/^@/, "").trim() || "Anonymous"

    // Fetch Twitter profile image using unavatar.io
    // unavatar.io provides a reliable way to get Twitter profile images
    // It handles redirects and invalid handles gracefully
    const profileImage = cleanHandle !== "Anonymous" 
      ? `https://unavatar.io/x/${encodeURIComponent(cleanHandle)}`
      : null

    // Check if entry already exists for this handle
    const { data: existingEntry, error: fetchError } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("handle", cleanHandle)
      .single()

    // If entry exists, check if new score is better
    if (existingEntry && !fetchError) {
      const shouldUpdate = isNewScoreBetter(
        score,
        timeTaken,
        accuracy,
        existingEntry.score,
        existingEntry.time_taken,
        existingEntry.accuracy,
      )

      if (shouldUpdate) {
        // Update existing entry with better score
        const { data, error } = await supabase
          .from("leaderboard")
          .update({
            score,
            time_taken: timeTaken,
            accuracy,
            twitter_profile_image: profileImage, // Update profile image in case it changed
          })
          .eq("handle", cleanHandle)
          .select()
          .single()

        if (error) {
          console.error("Error updating score:", error)
          throw error
        }

        return data
          ? {
              ...data,
              arrows: data.score, // Legacy compatibility
              time: data.time_taken, // Legacy compatibility
            }
          : null
      } else {
        // New score is not better, return existing entry
        return {
          ...existingEntry,
          arrows: existingEntry.score, // Legacy compatibility
          time: existingEntry.time_taken, // Legacy compatibility
        }
      }
    }

    // No existing entry, insert new one
    const { data, error } = await supabase
      .from("leaderboard")
      .insert([
        {
          handle: cleanHandle,
          score,
          time_taken: timeTaken,
          accuracy,
          twitter_profile_image: profileImage,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error submitting score:", error)
      throw error
    }

    // Transform to match LeaderboardEntry interface
    return data
      ? {
          ...data,
          arrows: data.score, // Legacy compatibility
          time: data.time_taken, // Legacy compatibility
        }
      : null
  } catch (error) {
    console.error("Error in submitScore:", error)
    throw error
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .order("time_taken", { ascending: true })
      .order("accuracy", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      throw error
    }

    // Transform to match LeaderboardEntry interface with legacy fields
    return (data || []).map((entry) => ({
      ...entry,
      arrows: entry.score, // Legacy compatibility
      time: entry.time_taken, // Legacy compatibility
    }))
  } catch (error) {
    console.error("Error in fetchLeaderboard:", error)
    throw error
  }
}
