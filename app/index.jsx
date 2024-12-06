import { StatusBar } from 'expo-status-bar';
import { router, Redirect } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthProvider';

export default function App() {
    const { user } = useAuth();
    if ( user ) return <Redirect href="/dashboard" />;
    return (
        <SafeAreaView style={{height: '100%', backgroundColor: '#F4FDFF'}}>
            <View style={styles.container}>
                <Image 
                    source={images.logo}
                    style={styles.center_logo}
                    resizeMode='contain'
                />
                <Text style={styles.slogan}>
                    A Gentle Hand {'\n'}
                    In Difficult Times
                </Text>
                <Text style={styles.slogantwo}>
                    Your focus should be on healing. Norfakan will take care of the details.
                </Text>
                <CustomButton 
                    title='Click To Continue'
                    containerStyles={{width: '100%', marginTop: 28,}}
                    handlePress={() => router.push('/sign-in')}
                />
            <StatusBar style="auto" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FDFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    center_logo: {
        width: 300,
        height: 300
    },
    slogan: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        color: '#283033',
        margin: 10
    },
    slogantwo:{
        textAlign: 'center', 
        fontSize: 17, 
    },
});