import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, TouchableOpacity, Switch, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

// ... inside ProfileImage:

function ProfileImage() {

    const navigation = useNavigation();
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem('user') ?? ''
            const userJson = JSON.parse(user);
            setFirstName(userJson.firstName)
            setLastName(userJson.lastName)
        })();
    }, []);
    React.useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem('@avatarPath');
            if (saved) {
                setAvatarUri(saved);
            }
        })();
    }, []);

    return (
        <Pressable onPress={() => {
            navigation.navigate("Profile")

        }}>

            {avatarUri ? <Image source={{ uri: avatarUri }} style={{

                height: 40,
                width: 40,
                borderRadius: 50
            }} resizeMode="contain" /> :

                <View style={{
                    flex: 1,
                    alignItems: 'center', height: 40,
                    width: 40,
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
        </Pressable>
    );
}

export default ProfileImage;