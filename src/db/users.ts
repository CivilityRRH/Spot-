import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, avatar?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || 'SpotQuest Scout',
        avatar,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(avatar ? { avatar } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database user upsert failed:', error);
    throw new Error('Failed to synchronize user record. Please try again later.', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error('Database query getUserByUid failed:', error);
    throw new Error('Failed to retrieve user profile.', { cause: error });
  }
}

export async function updateUserKarma(uid: string, addedKarma: number, addedWins: number = 0) {
  try {
    const existing = await getUserByUid(uid);
    if (!existing) return null;

    const newKarma = (existing.karmaPoints || 0) + addedKarma;
    const newWins = (existing.tournamentsWon || 0) + addedWins;
    const newLevel = Math.floor(newKarma / 150) + 1;

    const result = await db.update(users)
      .set({
        karmaPoints: newKarma,
        tournamentsWon: newWins,
        level: newLevel,
      })
      .where(eq(users.uid, uid))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query updateUserKarma failed:', error);
    throw new Error('Failed to update user karma score.', { cause: error });
  }
}

export async function addKarmaKoins(uid: string, amount: number) {
  try {
    const existing = await getUserByUid(uid);
    if (!existing) throw new Error('User not found');

    const result = await db.update(users)
      .set({ karmaKoins: (existing.karmaKoins || 0) + amount })
      .where(eq(users.uid, uid))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query addKarmaKoins failed:', error);
    throw new Error('Failed to add KarmaKoins.', { cause: error });
  }
}

export async function transferKarmaKoins(senderUid: string, receiverUid: string, amount: number) {
  return await db.transaction(async (tx) => {
    const sender = await tx.select().from(users).where(eq(users.uid, senderUid));
    if (!sender.length || (sender[0].karmaKoins || 0) < amount) throw new Error('Insufficient KarmaKoins');

    const receiver = await tx.select().from(users).where(eq(users.uid, receiverUid));
    if (!receiver.length) throw new Error('Receiver not found');

    await tx.update(users).set({ karmaKoins: (sender[0].karmaKoins || 0) - amount }).where(eq(users.uid, senderUid));
    await tx.update(users).set({ karmaKoins: (receiver[0].karmaKoins || 0) + amount }).where(eq(users.uid, receiverUid));
    return true;
  });
}
