import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Onboarding: React.FC = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // Disable Next button unless both fields are filled
  const isNextDisabled = !firstName || !email;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>LITTLE LEMON</Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Let us get to know you</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isNextDisabled && styles.buttonDisabled,
            ]}
            disabled={isNextDisabled}
            onPress={() => {
              const login = async () => {
                try {
                    await AsyncStorage.setItem("user",JSON.stringify({email,firstName}))
                    navigation.navigate("Profile")
                    
                } catch (error) {
                    console.log(error)
                    
                }
                
              }
              login()
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    paddingTop: 40,
    paddingBottom: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A4D39',
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    backgroundColor: '#CBD2D9',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#253540',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  formGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
    marginLeft: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F6F8FA',
    borderColor: '#506174',
    borderWidth: 2,
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#253540',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#F6F8FA',
    alignItems: 'center',
    paddingVertical: 22,
  },
  button: {
    backgroundColor: '#CBD2D9',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#253540',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Onboarding;
