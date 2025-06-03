import { View, Text,Image } from 'react-native';

function SplashScreen(){
  return(
    <View style={{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:'100%',
        width:'100%'
    }}>
      <Image source={require('../assets/images/Logo.png')} width={190} height={190}
      
      />
    </View>
  )
} 
export default SplashScreen;   