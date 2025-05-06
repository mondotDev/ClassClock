// hooks/useGoogleAuth.js
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { exchangeGoogleIdTokenForFirebase } from '../services/firebaseRest';
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_EXPO_CLIENT_ID,
} from '@env';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(onSuccess, onError) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: GOOGLE_EXPO_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === 'success') {
        const idToken = response.authentication?.idToken;
        try {
          const firebaseUser = await exchangeGoogleIdTokenForFirebase(idToken);
          onSuccess(firebaseUser);
        } catch (err) {
          console.error('🔥 Firebase token exchange failed:', err);
          onError?.(err);
        }
      }
    };

    handleAuth();
  }, [response]);

  return { request, promptAsync };
}
