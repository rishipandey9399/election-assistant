import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { db } from './firebase';

export type UserTimeline = {
  uid: string;
  trackedEvents: string[]; // IDs of events being tracked
  completedEvents: string[]; // IDs of completed events
  state: string; // User's voting state
};

/**
 * Initialize or update a user's timeline profile in Firestore.
 */
export async function syncUserProfile(uid: string, data: Partial<UserTimeline>) {
  const userRef = doc(db, 'users', uid);
  try {
    await setDoc(userRef, { uid, ...data }, { merge: true });
  } catch (error) {
    console.error('Error syncing user profile:', error);
    throw error;
  }
}

/**
 * Fetch a user's timeline profile.
 */
export async function getUserProfile(uid: string): Promise<UserTimeline | null> {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserTimeline;
  }
  return null;
}

/**
 * Track an election event.
 */
export async function trackEvent(uid: string, eventId: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    trackedEvents: arrayUnion(eventId),
  });
}

/**
 * Untrack an election event.
 */
export async function untrackEvent(uid: string, eventId: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    trackedEvents: arrayRemove(eventId),
  });
}

/**
 * Mark an event as completed.
 */
export async function completeEvent(uid: string, eventId: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    completedEvents: arrayUnion(eventId),
  });
}
