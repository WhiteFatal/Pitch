// Shared utility functions
// TODO: add more helpers here as the app grows (date formatting, etc.)

export function displayName(firstName, nickname, lastName) {
  if (nickname.trim()) return `${firstName} "${nickname}" ${lastName}`
  return `${firstName} ${lastName}`
}
