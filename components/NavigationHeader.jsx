import { router } from 'expo-router';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const NavigationHeader = ({title, otherStyles}) => {
    return (
        <View style={styles.headerContainer}>

            <TouchableOpacity
                onPress={() => router.back()}
            >
                <View style={{marginLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </View>
            </TouchableOpacity>

            <Text style={{fontSize: 20, fontWeight:'bold', color:"#000000"}}>{title}</Text>

            <TouchableOpacity onPress={() => router.push('../../(tabs)/dashboard')}>
                <View style={{marginRight: 20}}>
                    <MaterialIcons name="home" size={24} color="#000000" />
                </View>
            </TouchableOpacity>

        </View>
    )
}

export default NavigationHeader;

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 56,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,
        paddingVertical: 10,
    },
})