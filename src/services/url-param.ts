export type DayType = "normal" | "friday" | "weekend"

export function getDayType(): DayType {
  const uri = new URL(window.location.href)

  if (uri.searchParams.has("dayType")) {
    const mode = uri.searchParams.get("dayType")

    if (mode === "friday") {
      return "friday"
    }

    if (mode === "weekend") {
      return "weekend"
    }
  }

  return "normal"
}
