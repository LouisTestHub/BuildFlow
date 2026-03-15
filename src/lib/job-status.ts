import { JobStatus } from "@prisma/client"

export const STATUS_COLOURS: Record<JobStatus, { bg: string; text: string; label: string }> = {
  TENDER: { bg: "bg-blue-100", text: "text-blue-800", label: "Tender" },
  WON: { bg: "bg-purple-100", text: "text-purple-800", label: "Won" },
  LIVE: { bg: "bg-green-100", text: "text-green-800", label: "Live" },
  PRACTICAL_COMPLETION: { bg: "bg-orange-100", text: "text-orange-800", label: "Practical Completion" },
  FINAL_ACCOUNT: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Final Account" },
  CLOSED: { bg: "bg-gray-100", text: "text-gray-600", label: "Closed" },
  LOST: { bg: "bg-red-100", text: "text-red-800", label: "Lost" },
}

export const VALID_TRANSITIONS: Record<string, JobStatus[]> = {
  TENDER: ["WON", "LOST"],
  WON: ["LIVE"],
  LIVE: ["PRACTICAL_COMPLETION"],
  PRACTICAL_COMPLETION: ["FINAL_ACCOUNT"],
  FINAL_ACCOUNT: ["CLOSED"],
  CLOSED: [],
  LOST: [],
}

export const WEATHER_OPTIONS = [
  { value: "sunny", label: "☀️ Sunny" },
  { value: "cloudy", label: "⛅ Cloudy" },
  { value: "rain", label: "🌧️ Rain" },
  { value: "heavy_rain", label: "⛈️ Heavy Rain" },
  { value: "snow", label: "❄️ Snow" },
  { value: "wind", label: "💨 Wind" },
  { value: "frost", label: "🥶 Frost" },
]

export const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️",
  cloudy: "⛅",
  rain: "🌧️",
  heavy_rain: "⛈️",
  snow: "❄️",
  wind: "💨",
  frost: "🥶",
}

export const SECTORS = [
  "Residential",
  "Commercial",
  "Fit-Out",
  "M&E",
  "Civils",
  "Refurb",
  "Other",
]

export function formatCurrency(value: number | string | null | undefined): string {
  if (value == null) return "£0"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "£0"
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(num)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}
