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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Disable Next button unless both fields are filled
  const isNextDisabled = !name || name.split(' ').length<2 || !email;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >


        {/* Main Card */}
        <View style={styles.hero}>


              <Text style={styles.bannerTitle}>Little Lemon</Text>
              <Text style={styles.bannerLocation}>Chicago</Text>
          <View style={styles.banner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerDescription} numberOfLines={5}>
                We are a family owned 
                Mediterranean restaurant, 
                focused on traditional 
                recipes served with a modern twist.
              </Text>

            </View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
              }}
              style={styles.bannerImage}
            />

          </View>


        </View>
        <View style={styles.card}>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
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
                  await AsyncStorage.setItem("user", JSON.stringify({ email, firstName: name.split(' ')[0], lastName: name.split(' ')[1] }))
                  navigation.replace("Home")

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
  hero: {
    width: '100%',
    backgroundColor: '#415a55',
    paddingBottom: 10
  },
  banner: {
    backgroundColor: '#415a55',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
  },
 required:{
    color:'red'  
  },
  bannerTitle: {
    paddingLeft:16,
    paddingTop:16,
    color: '#f4c542',
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 46,
    fontFamily: "MarkaziText-Regular",
  },
  bannerLocation: {
    paddingLeft:16,
    color: '#d1d5db',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: "MarkaziText-Regular",

  },
  bannerDescription: {
    color: '#f3f4f6',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Karla-Regular",
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    paddingBottom:16
  },
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
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-Regular",
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
    backgroundColor: '#F4CE14',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor:'#CBD2D9'
  },
  buttonText: {
    color: '#253540',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: "Karla-Regular",
  },
});

export default Onboarding;
