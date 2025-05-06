// tests/FirebaseRestTest.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { signInAnonymously } from '../services/firebaseRest';

export default function FirebaseRestTest() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    signInAnonymously()
      .then((res) => {
        console.log('✅ Firebase REST Auth Success:', res.localId);
        setUserId(res.localId);
      })
      .catch((err) => {
        console.error('❌ Firebase REST Auth Error:', err.message);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {userId ? `Signed in anonymously: ${userId}` : 'Signing in anonymously...'}
      </Text>
    </View>
  );
}
