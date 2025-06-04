// App.tsx
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Onboarding from './app/screens/Onboarding';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import SplashScreen from './app/screens/SplashScreen';
import Logo from './app/components/Logo';
import ProfileImage from './app/components/ProfileImage';
import BackButton from './app/components/BackButton';
import { useFonts } from 'expo-font';

type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const status = await AsyncStorage.getItem('user');
        if (status && status.length > 0) {
          setIsOnboardingCompleted(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('./app/assets/fonts/Karla-Regular.ttf'),
    'MarkaziText-Regular': require('./app/assets/fonts/MarkaziText-Regular.ttf'),
  });

  // Show a splash screen until we’ve read AsyncStorage & fonts are loaded
  if (isLoading || !fontsLoaded) {
    return <SplashScreen />;
  }

  // Common header options factory
  const headerOptions = (goBack: boolean) => ({
    headerTitle: () => (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Logo />
      </View>
    ),
    headerStyle: { backgroundColor: '#f0f0f0' },
    headerTitleStyle: { color: 'black' },
    headerLeft: () => (goBack ? <BackButton /> : undefined),
    headerRight: () => <ProfileImage />,
  });

  return (
    <NavigationContainer>
      {/* 
        We register ALL screens, but choose the initial route
        based on isOnboardingCompleted.
      */}
      <Stack.Navigator
        initialRouteName={isOnboardingCompleted ? 'Home' : 'Onboarding'}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{
            headerStyle: { backgroundColor: '#f0f0f0' },
            headerTitleStyle: { color: 'black' },
            headerTitle: () => (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Logo />
              </View>
            )
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={headerOptions(false)}
        />
        <Stack.Screen
          name="Profile"
          children={() => (
            <Profile setOnboardingCompleted={setIsOnboardingCompleted} />
          )}
          options={headerOptions(true)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
