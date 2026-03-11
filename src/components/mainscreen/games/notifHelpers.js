import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase'

// Write a single notification document
function writeNotif(userId, type, gameFields) {
  return addDoc(collection(db, 'notifications'), {
    userId,
    type,
    ...gameFields,
    read:      false,
    createdAt: Timestamp.now(),
  })
}

// Shared game fields included in every notification
function gameFields(game) {
  return {
    gameId:    game.id,
    gameDate:  game.date,
    gameTime:  game.time,
    gamePitch: game.pitch,
  }
}

// Notify all users in the system (new game created)
export async function notifyAllUsers(game) {
  const snap = await getDocs(collection(db, 'users'))
  await Promise.all(snap.docs.map(d => writeNotif(d.id, 'new_game', gameFields(game))))
}

// Notify all players currently reserved in a game, excluding specified uid
export async function notifyReservedPlayers(game, excludeUid, type) {
  const snap      = await getDocs(collection(db, 'reservations'))
  const playerIds = snap.docs
    .filter(d => d.data().gameId === game.id && d.data().userId !== excludeUid)
    .map(d => d.data().userId)
  await Promise.all(playerIds.map(userId => writeNotif(userId, type, gameFields(game))))
}

// Notify all reserved players + creator, excluding specified uid (game full)
export async function notifyGameFull(game, excludeUid) {
  const snap      = await getDocs(collection(db, 'reservations'))
  const playerIds = snap.docs
    .filter(d => d.data().gameId === game.id && d.data().userId !== excludeUid)
    .map(d => d.data().userId)

  // Include creator if not already in the list and not the one reserving
  const recipients = [...new Set([...playerIds, game.createdBy].filter(id => id !== excludeUid))]
  await Promise.all(recipients.map(userId => writeNotif(userId, 'game_full', gameFields(game))))
}
