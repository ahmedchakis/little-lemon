import { View, Text,Image, Pressable } from 'react-native';


function Logo(){
return (<Image
              source={require("../assets/images/Logo.png")}
              style={{ width: 150, height: 40, resizeMode: 'contain' }}
            />)

}
export default Logo;