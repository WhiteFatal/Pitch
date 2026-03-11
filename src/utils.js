// Shared utility functions

export function displayName(firstName, nickname, lastName) {
  if (nickname.trim()) return `${firstName} "${nickname}" ${lastName}`
  return `${firstName} ${lastName}`
}

// Format a Firestore timestamp to a relative time string
export function formatTime(ts) {
  if (!ts) return ''
  const date  = ts.toDate()
  const now   = new Date()
  const diffM = Math.floor((now - date) / 60000)
  if (diffM < 1)   return 'Just now'
  if (diffM < 60)  return `${diffM} minute${diffM > 1 ? 's' : ''} ago`
  const diffH = Math.floor(diffM / 60)
  if (diffH < 24)  return `${diffH} hour${diffH > 1 ? 's' : ''} ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  return `${diffD} days ago`
}
