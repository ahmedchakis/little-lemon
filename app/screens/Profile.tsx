import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, TouchableOpacity, Switch, TextInput,StyleSheet, Alert } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile: React.FC = () => {
      // 1. Profile fields
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // 2. Notification toggles
  const [notifOrderStatuses, setNotifOrderStatuses] = useState<boolean>(true);
  const [notifPasswordChanges, setNotifPasswordChanges] = useState<boolean>(true);
  const [notifSpecialOffers, setNotifSpecialOffers] = useState<boolean>(true);
  const [notifNewsletter, setNotifNewsletter] = useState<boolean>(true);

    // 3. Avatar URI (local or remote)
  const [avatarUri, setAvatarUri] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de l’accès à la galerie pour que vous puissiez changer votre avatar.'
        );
      }
    })();
  }, []);

  // get first name and email from storage
  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user') ?? ''
      const userJson = JSON.parse(user);
      setEmail(userJson.email)
      setFirstName(userJson.firstName)
    })();
  }, []);


  // ─── Handlers ────────────────────────────────────────────────────────────

  // 1. Navigate Back
  const handleGoBack = () => {
    // Replace with your navigation logic if using React Navigation / Expo Router
    // e.g. navigation.goBack() or router.back()
    Alert.alert('Go Back', 'Placeholder: replace with your navigation logic.');
  };

  // 2. Pick a new avatar from the library
  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // Newer versions of expo-image-picker return { canceled: boolean, assets: [] }
      if (!result.canceled) {
        // @ts-ignore ‒ result.assets[0].uri exists
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d’image :', error);
    }
  };

  // 3. Remove avatar → reset to placeholder
  const handleRemoveAvatar = () => {
    setAvatarUri('');
  };

    // 4. Log out
  const handleLogout = () => {
    // Replace with real logout logic (e.g., clear tokens, navigate to login screen)
    //Alert.alert('Déconnexion', 'Vous êtes maintenant déconnecté (stub).');
  };

  // 5. Discard changes → reset all fields to initial “hard‐coded” values
  const handleDiscard = () => {
    setFirstName('Tilly');
    setLastName('Doe');
    setEmail('tillydoe@example.com');
    setPhone('(217) 555-0113');
    setNotifOrderStatuses(true);
    setNotifPasswordChanges(true);
    setNotifSpecialOffers(true);
    setNotifNewsletter(true);
    //handleRemoveAvatar();
  };

  // 6. Save changes → stub out an alert (hook up your API here)
  const handleSave = () => {
    // Gather all data
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      notifications: {
        orderStatuses: notifOrderStatuses,
        passwordChanges: notifPasswordChanges,
        specialOffers: notifSpecialOffers,
        newsletter: notifNewsletter,
      },
      //avatarUri,
    };
}
    const theme = useTheme()
    return (
        <ScrollView style={{
            backgroundColor: 'white',
            margin:10
        }}>
            <Text style={{
                color:'#495E57',
                fontSize:24,
                fontWeight:'bold'
            }}>
                Personal Information
            </Text>
            <View style={{


                flex: 1,
                justifyContent: 'flex-start',
                flexDirection: 'row'

            }}>
                <View>
                    <Text style={{
                        color: "#888"
                    }}>Avatar</Text>
                    {avatarUri ? <Image source={{uri:avatarUri}} style={{
                        margin:10,
                        height: 80,
                        width: 80,
                        borderRadius:50
                    }} resizeMode="contain" /> : 
                    
                    <View style={{
                        flex:1,
                        alignItems:'center',height:80,
                        width:80,
                        justifyContent:'center',
                        backgroundColor:'#495E57',
                        borderRadius:50
                    }}>
                        <Text style={{
                            color:'white',
                            fontSize:16
                        }}>

                        {firstName[0]+(lastName[0]??'')}
                        
                        </Text></View>}
                </View>
                <Pressable 
                
                onPress={handleChangeAvatar}
                style={{
                    marginStart: 20,
                    marginTop: 45,
                    backgroundColor: '#495E57',
                    height: 50,

                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100
                }}>
                    <Text style={{
                        color: 'white'
                    }}>
                        Change

                    </Text>
                </Pressable>
                <Pressable 
                onPress={handleRemoveAvatar}
                style={{
                    marginStart: 20,
                    marginTop: 45,
                    borderColor: '#495E57',
                    borderWidth: 2,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100
                }}>
                    <Text style={{
                        color: '#495E57'
                    }}>
                        Remove

                    </Text>
                </Pressable>


            </View>
            {/* ─── First & Last Name ───────────────────────────────────────────── */}
                    <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last name</Text>
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="#999"
          />
        </View>

        {/* ─── Email & Phone ──────────────────────────────────────────────── */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={[styles.inputGroup, { marginBottom: 24 }]}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* ─── Email Notifications ─────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
          Email notifications
        </Text>

        <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Order statuses</Text>
          <Switch
            value={notifOrderStatuses}
            onValueChange={setNotifOrderStatuses}
            trackColor={{ false: '#ccc', true: '#4f7b5c' }}
            thumbColor={notifOrderStatuses ? '#fff' : '#fff'}
          />
        </View>

        <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Password changes</Text>
          <Switch
            value={notifPasswordChanges}
            onValueChange={setNotifPasswordChanges}
            trackColor={{ false: '#ccc', true: '#4f7b5c' }}
            thumbColor={notifPasswordChanges ? '#fff' : '#fff'}
          />
        </View>

         <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Special offers</Text>
          <Switch
            value={notifSpecialOffers}
            onValueChange={setNotifSpecialOffers}
            trackColor={{ false: '#ccc', true: '#4f7b5c' }}
            thumbColor={notifSpecialOffers ? '#fff' : '#fff'}
          />
        </View>

        <View style={[styles.notificationRow, { marginBottom: 32 }]}>
          <Text style={styles.notificationLabel}>Newsletter</Text>
          <Switch
            value={notifNewsletter}
            onValueChange={setNotifNewsletter}
            trackColor={{ false: '#ccc', true: '#4f7b5c' }}
            thumbColor={notifNewsletter ? '#fff' : '#fff'}
          />
        </View>

         {/* ─── Log out Button (Yellow) ─────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.button, styles.logoutButton]}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        {/* ─── Bottom Action Buttons ───────────────────────────────────────── */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={handleDiscard}
            style={[styles.bottomButton, styles.discardButton]}
            activeOpacity={0.7}
          >
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.bottomButton, styles.saveButton]}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
                   
        </ScrollView>
    )

}

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    alignItems: 'stretch',
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  logo: {
    flex: 1,
    height: 32,
    resizeMode: 'contain',
  },
  headerAvatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },

  // ─── Sections & Titles ─────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  // ─── Avatar Section ───────────────────────────────────────────────────────
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarButtons: {
    marginLeft: 16,
    flex: 1,
  },
  avatarButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  changeButton: {
    backgroundColor: '#4F7B5C', // dark green
  },
  avatarButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#999',
  },
  removeButtonText: {
    color: '#333',
  },

  // ─── Text Inputs ─────────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },

  // ─── Notification Rows ───────────────────────────────────────────────────
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationLabel: {
    fontSize: 16,
    color: '#333',
  },

  // ─── Log out Button ───────────────────────────────────────────────────────
  button: {
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#FCCA41', // bright yellow
  },
  logoutButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },

  // ─── Bottom Action Buttons ────────────────────────────────────────────────
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  bottomButton: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  discardButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  discardButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4F7B5C', // dark green
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
});
