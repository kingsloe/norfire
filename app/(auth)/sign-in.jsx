import { StyleSheet, Text, View, Image, ScrollView, Dimensions} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spinner from 'react-native-loading-spinner-overlay';
import { Link, Redirect, router } from 'expo-router';
import { images } from '../../constants';
import { CustomButton, FormField } from '../../components';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthProvider';

const { height } = Dimensions.get('window');
export default function SignIn () {
    const { user } = useAuth();
    const [ form, setForm ] = useState({
        email: '',
        password: ''
    });
    const auth = FIREBASE_AUTH;
    const [ loading, setLoading ] = useState(false);

    const validateFields = () => {
        if (form.email === '') {
            alert('Email Field required');
            return false;
        } else if (form.password.length === '') {
            alert('Password Field required');
            return false;
        }
        return true;
    }

    const submit = async () => {
        if (validateFields()){
            setLoading(true);
            try {
                const response = await signInWithEmailAndPassword(auth, form.email, form.password);
                router.replace('/dashboard');
            } catch (error) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        alert('The email address is not valid');
                        break;
                    case 'auth/invalid-credential':
                        alert('Email or password is incorrect. Please check and try again.');
                        break;
                    default:
                        alert('Unexpected error occured, check your internet connection and try again.');
                }
                
            } finally {
                setLoading(false);
            }
        }
    }

    if (user) return <Redirect href={'/dashboard'} />
    
    return (
        <SafeAreaView style={{height: '100%', backgroundColor: '#F4FDFF'}}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView keyboardDismissMode='on-drag'>
                <View style={styles.container}>
                    <View style={{alignItems: 'center'}}>
                        <Image 
                            source={images.logo}
                            style={styles.center_logo}
                            resizeMode='contain'
                        />
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>LOGIN</Text>
                    </View>
                    <FormField 
                        title='Email'
                        otherStyles={{marginTop: 20}}
                        value= {form.email}
                        placeholder='Enter email'
                        handleChangeText={(text) => setForm({ ...form, email: text})}
                        keyboardType = 'email-address'
                        autoCapitalize = 'none'
                    />
                    <FormField 
                        title='Password'
                        otherStyles={{marginTop: 20}}
                        value= {form.password}
                        placeholder='Enter Password'
                        handleChangeText={(text) => setForm({ ...form, password: text})}
                    />
                    
                    <View style={{
                        flex: 1/4, 
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 10
                        }}>
                        <Text><Link href={'/forgotPassword'} style={{fontSize: 20, fontWeight: 'bold'}}>Forgot Password?</Link></Text>
                    </View>
                    <CustomButton 
                        title='Login'
                        containerStyles={{width: '100%', marginTop: 28,}}
                        handlePress={submit}
                    />
                </View>
        </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FDFF',
        justifyContent: 'center',
        paddingHorizontal: 16,
        minHeight: height * 0.83
    },
    center_logo: {
        width: 160,
        height: 160
    }
})