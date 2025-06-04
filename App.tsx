import * as React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './app/screens/Onboarding';
import Profile from './app/screens/Profile';
import SplashScreen from './app/screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import Logo from './app/components/Logo';
import Home from './app/screens/Home';





const Stack = createNativeStackNavigator();

function App() {

  const [isLoading, setIsLoading] = React.useState(true)
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false)
  React.useEffect(() => {

    const getUserStatus = async () => {
      try {
        const userStatus = await AsyncStorage.getItem('user');
        console.log(userStatus)
        if (userStatus && userStatus.length > 0) {
          setIsOnboardingCompleted(true)
        }
      } catch (error) {
        console.log(error);

      }
      finally {
        setIsLoading(false)
      }



    }
    getUserStatus();



  }, [])
  if (isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>


      <Stack.Navigator initialRouteName='Home' screenOptions={{
        headerTitle: () => (
                  <View style={{
                    flex: 1,
                    alignItems: 'center'
                  }}>

                    <Logo />
                  </View>
                ),
                headerStyle: { backgroundColor: '#f0f0f0' },
                headerTitleStyle: { color: 'black' },
                headerLeft: () => (
                  <Pressable style={{
                    padding: 10,
                    backgroundColor: "#495E57",
                    borderRadius: 40
                  }}>
                    <Feather name={"arrow-left"} size={20} color="white" />
                  </Pressable>
                ),
      }}>
        {isOnboardingCompleted ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile}
              options={{
               
                
              }} />
          </>
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding}

          />
        )}

      </Stack.Navigator></NavigationContainer>
  );
}

export default App;