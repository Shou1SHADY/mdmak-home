/**
 * @fileOverview Auth Service - Handles extended profile management.
 */

import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const AuthService = {
  async completeOnboarding(
    db: Firestore,
    userId: string,
    email: string,
    displayName: string,
    role: 'customer' | 'supplier' | 'contractor'
  ) {
    const userRef = doc(db, 'users', userId);
    return setDoc(userRef, {
      uid: userId,
      email,
      displayName,
      role,
      onboarded: true,
      createdAt: serverTimestamp(),
    }, { merge: true });
  }
};
