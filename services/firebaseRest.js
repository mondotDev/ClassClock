// services/firebaseRest.js
import { FIREBASE_API_KEY } from '@env';
console.log('🔥 ENV KEY:', FIREBASE_API_KEY);

const FIREBASE_AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';

/**
 * Sign in anonymously via Firebase REST API.
 * Returns user object with idToken, localId, etc.
 */
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

    return data; // includes idToken, refreshToken, localId
  } catch (error) {
    console.error('❌ REST Auth failed:', error);
    throw error;
  }
}

/**
 * Exchange a Google ID token for Firebase credentials via REST API.
 * Used after Google login through expo-auth-session.
 */
export async function exchangeGoogleIdTokenForFirebase(googleIdToken) {
  const endpoint = `${FIREBASE_AUTH_BASE}/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postBody: `id_token=${googleIdToken}&providerId=google.com`,
        requestUri: 'http://localhost', // doesn't need to match real URI
        returnIdpCredential: true,
        returnSecureToken: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Google login failed');
    }

    return data; // includes localId, idToken, displayName, email, etc.
  } catch (error) {
    console.error('❌ Firebase Google exchange failed:', error);
    throw error;
  }
}
