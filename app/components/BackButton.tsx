import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function BackButton(){
    const navigation = useNavigation()
    return (
        <Pressable 
    onPress={()=> navigation.goBack()}
    
    style={{
      padding: 10,
      backgroundColor: "#495E57",
      borderRadius: 40,
      
    }}>
      <Feather name={"arrow-left"} size={20} color="white" />
    </Pressable>
    )
}
export default BackButton;
