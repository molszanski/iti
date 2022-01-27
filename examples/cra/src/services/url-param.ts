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

export type AuthType = "unauthenticated" | "manager" | "admin"

export function getAuthType(): AuthType {
  const uri = new URL(window.location.href)

  if (uri.searchParams.has("authType")) {
    const mode = uri.searchParams.get("authType")

    if (mode === "manager") {
      return "manager"
    }

    if (mode === "admin") {
      return "admin"
    }
  }

  return "unauthenticated"
}
export function setAuthType(at: AuthType) {
  const url = new URL(window.location.href)
  url.searchParams.set("authType", at)
  console.log("changing user and url to", at)
  window.history.pushState({ authType: at }, at, url)
}
