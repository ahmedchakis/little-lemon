import { CommonActions, StackActions, useNavigation, useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, TouchableOpacity, Switch, TextInput, StyleSheet, Alert } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
type Props = {
  setOnboardingCompleted: (flag: boolean) => void;
};
function Profile({ setOnboardingCompleted }: Props) {
  const navigation = useNavigation()

  const [user, setUser] = useState<any>({});
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [notifOrderStatuses, setNotifOrderStatuses] = useState<boolean>(true);
  const [notifPasswordChanges, setNotifPasswordChanges] = useState<boolean>(true);
  const [notifSpecialOffers, setNotifSpecialOffers] = useState<boolean>(true);
  const [notifNewsletter, setNotifNewsletter] = useState<boolean>(true);

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

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user') ?? ''
      const userJson = JSON.parse(user);
      setUser(userJson)
      setEmail(userJson.email)
      setFirstName(userJson.firstName)
      setLastName(userJson.lastName ?? '')
      setPhone(userJson.phone ?? '');

      if (userJson.notifications) {

        setNotifOrderStatuses(userJson.notifications.orderStatuses);
        setNotifPasswordChanges(userJson.notifications.passwordChanges);
        setNotifSpecialOffers(userJson.notifications.specialOffers);
        setNotifNewsletter(userJson.notifications.newsletter);
      }
      const saved = await AsyncStorage.getItem('@avatarPath');
      if (saved) {
        setAvatarUri(saved);
      }
    })();
  }, []);





  // ─── Handlers ────────────────────────────────────────────────────────────



  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const pickedUri = result.assets[0].uri;

        const filename = pickedUri.split('/').pop()!;
        const destPath = FileSystem.documentDirectory + filename;

        await FileSystem.copyAsync({
          from: pickedUri,
          to: destPath,
        });

        await AsyncStorage.setItem('@avatarPath', destPath);

        setAvatarUri(destPath);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection/sauvegarde de l’image :', error);
    }
  };
  const handleRemoveAvatar = async () => {
    await AsyncStorage.removeItem('@avatarPath');

    if (avatarUri) {
      try {
        const info = await FileSystem.getInfoAsync(avatarUri);
        if (info.exists) {
          await FileSystem.deleteAsync(avatarUri, { idempotent: true });
        }
      } catch (e) {
        console.warn('Failed to delete file:', e);
      }
    }

    setAvatarUri('');
  };

  const handleLogout = async () => {
    console.log("log out clicked")
    handleRemoveAvatar()
    await AsyncStorage.clear()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Onboarding' },
        ],
      })
    );
  };

  const handleDiscard = async () => {
    setFirstName(user.firstName ?? '');
    setLastName(user.lastName ?? '');
    setEmail(user.email ?? '');
    setPhone(user.phone ?? '');
    setNotifOrderStatuses(user.notifications?.orderStatuses ?? true);
    setNotifPasswordChanges(user.notifications?.passwordChanges ?? true);
    setNotifSpecialOffers(user.notifications?.specialOffers ?? true);
    setNotifNewsletter(user.notifications?.newsletter ?? true);

    const saved = await AsyncStorage.getItem('@avatarPath');
    if (saved) {
      setAvatarUri(saved);
    }
  };

  const handleSave = async () => {
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
      avatarUri,
    }; 

    await AsyncStorage.setItem("user", JSON.stringify(payload))

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Home' },
        ],
      })
    );

  }
  const theme = useTheme()
  return (
    <ScrollView style={{
      backgroundColor: 'white',
      margin: 10
    }}>
      <Text style={{
        color: '#495E57',
        fontSize: 24,
        fontWeight: 'bold'
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
          {avatarUri ? <Image source={{ uri: avatarUri }} style={{
            margin: 10,
            height: 80,
            width: 80,
            borderRadius: 50
          }} resizeMode="contain" /> :

            <View style={{
              flex: 1,
              alignItems: 'center', height: 80,
              width: 80,
              justifyContent: 'center',
              backgroundColor: '#495E57',
              borderRadius: 50
            }}>
              <Text style={{
                color: 'white',
                fontSize: 16
              }}>

                {firstName[0] + (lastName[0] ?? '')}

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
          onPress={()=> setAvatarUri('')}
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
    fontFamily: "MarkaziText-Regular",
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
    fontFamily: "Karla-Regular",
  },
  removeButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#999',
  },
  removeButtonText: {
    color: '#333',
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-Regular",
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-Regular",
  },
  saveButton: {
    backgroundColor: '#4F7B5C', // dark green
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: "Karla-Regular",
  },
});
