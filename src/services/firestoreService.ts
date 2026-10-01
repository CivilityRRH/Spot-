import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';
import {
  UserProfile,
  Tournament,
  SocialPost,
  PhotoChallenge,
  CustomItemRequest,
  ScavengerItem,
  Squad,
} from '../types';

/**
 * Recursively strips any keys with `undefined` values from an object or array,
 * preventing Firestore "Unsupported field value: undefined" errors.
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/* =========================================================================
   USER PROFILES (/users/{userId})
   ========================================================================= */

export async function getUserProfileDoc(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfileDoc(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const cleanData = cleanFirestoreData(profile);
    await setDoc(doc(db, 'users', profile.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserKarmaKoins(userId: string, newBalance: number): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), { karmaKoins: newBalance });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/* =========================================================================
   TOURNAMENTS (/tournaments/{tournamentId})
   ========================================================================= */

export function subscribeToTournaments(
  onData: (tournaments: Tournament[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'tournaments';
  try {
    const q = query(collection(db, 'tournaments'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Tournament[] = [];
        snapshot.forEach((d) => items.push(d.data() as Tournament));
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveTournamentDoc(tourney: Tournament): Promise<void> {
  const path = `tournaments/${tourney.id}`;
  try {
    const cleanData = cleanFirestoreData(tourney);
    await setDoc(doc(db, 'tournaments', tourney.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/* =========================================================================
   SOCIAL POSTS (/posts/{postId})
   ========================================================================= */

export function subscribeToPosts(
  onData: (posts: SocialPost[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'posts';
  try {
    const q = query(collection(db, 'posts'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: SocialPost[] = [];
        snapshot.forEach((d) => items.push(d.data() as SocialPost));
        // Sort by createdAt descending
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function savePostDoc(post: SocialPost): Promise<void> {
  const path = `posts/${post.id}`;
  try {
    const cleanData = cleanFirestoreData(post);
    await setDoc(doc(db, 'posts', post.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/* =========================================================================
   PHOTO CHALLENGES (/photoChallenges/{challengeId})
   ========================================================================= */

export function subscribeToPhotoChallenges(
  onData: (challenges: PhotoChallenge[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'photoChallenges';
  try {
    const q = query(collection(db, 'photoChallenges'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: PhotoChallenge[] = [];
        snapshot.forEach((d) => items.push(d.data() as PhotoChallenge));
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function savePhotoChallengeDoc(challenge: PhotoChallenge): Promise<void> {
  const path = `photoChallenges/${challenge.id}`;
  try {
    const cleanData = cleanFirestoreData(challenge);
    await setDoc(doc(db, 'photoChallenges', challenge.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/* =========================================================================
   CUSTOM ITEM REQUESTS (/customRequests/{requestId})
   ========================================================================= */

export function subscribeToCustomRequests(
  onData: (requests: CustomItemRequest[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'customRequests';
  try {
    const q = query(collection(db, 'customRequests'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: CustomItemRequest[] = [];
        snapshot.forEach((d) => items.push(d.data() as CustomItemRequest));
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveCustomRequestDoc(req: CustomItemRequest): Promise<void> {
  const path = `customRequests/${req.id}`;
  try {
    const cleanData = cleanFirestoreData(req);
    await setDoc(doc(db, 'customRequests', req.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/* =========================================================================
   SCAVENGER ITEMS (/items/{itemId})
   ========================================================================= */

export function subscribeToItems(
  onData: (items: ScavengerItem[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'items';
  try {
    const q = query(collection(db, 'items'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: ScavengerItem[] = [];
        snapshot.forEach((d) => items.push(d.data() as ScavengerItem));
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveItemDoc(item: ScavengerItem): Promise<void> {
  const path = `items/${item.id}`;
  try {
    const cleanData = cleanFirestoreData(item);
    await setDoc(doc(db, 'items', item.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/* =========================================================================
   SQUADS (/squads/{squadId})
   ========================================================================= */

export function subscribeToSquads(
  onData: (squads: Squad[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'squads';
  try {
    const q = query(collection(db, 'squads'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Squad[] = [];
        snapshot.forEach((d) => items.push(d.data() as Squad));
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveSquadDoc(squad: Squad): Promise<void> {
  const path = `squads/${squad.id}`;
  try {
    const cleanData = cleanFirestoreData(squad);
    await setDoc(doc(db, 'squads', squad.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
