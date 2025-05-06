// services/firebaseRest.js
import { FIREBASE_API_KEY } from '@env';
console.log('🔥 ENV KEY:', FIREBASE_API_KEY);

const FIREBASE_AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';

export async function signInAnonymously() {
  const endpoint = `${FIREBASE_AUTH_BASE}/accounts:signUp?key=${FIREBASE_API_KEY}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Unknown error during anonymous sign-in');
    }

    return data; // includes idToken, refreshToken, localId (user ID)
  } catch (error) {
    console.error('❌ REST Auth failed:', error);
    throw error;
  }
}
