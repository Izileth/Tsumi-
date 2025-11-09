
import { Slot, useRouter, useSegments } from "expo-router";

import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./context/auth-context";

import LoadingScreen from "./_loading";

import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { View } from 'react-native';

import '@/global.css';


const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [isAppReady, setAppReady] = useState(false);

  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading || !isSplashAnimationFinished) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && !inAuthGroup) {
      router.replace('/(app)');
    } else if (!user && !inAuthGroup) {
      router.replace('/login');
    }
  }, [user, loading, isSplashAnimationFinished, segments, router]);

  useEffect(() => {
    if (isSplashAnimationFinished) {
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(setAppReady)(true);
        }
      });
    }
  }, [isSplashAnimationFinished, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (loading && !isSplashAnimationFinished) {
    return <LoadingScreen onAnimationEnd={() => setSplashAnimationFinished(true)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style="light" backgroundColor="#000000" translucent />

      {!isAppReady && (
        <Animated.View style={[{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }, animatedStyle]}>
          <LoadingScreen onAnimationEnd={() => setSplashAnimationFinished(true)} />
        </Animated.View>
      )}
    </View>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
