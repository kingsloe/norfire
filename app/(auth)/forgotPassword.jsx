import { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import { FormField, CustomButton } from '../../components';
import { useAuth } from '../../context/AuthProvider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../services/firebaseConfig';

const { height } = Dimensions.get('window');
const ForgotPassword = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const validateFields = () => {
        if (email === ''){
            alert('Email Field is required');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if (validateFields()){
            setLoading(true);
            try {
                await sendPasswordResetEmail(FIREBASE_AUTH, email);
                console.log('Request sent successfully');
                alert('Email sent successfully');
            } catch (error){
                switch (error.code){
                    case 'auth/invalid-email':
                        alert('The email address is not valid.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    }

    if (user) return <Redirect href={'/dashboard'} />

    return (
        <SafeAreaView style={styles.safeArea}>
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
                    </View>
                    <FormField
                        title = 'Email'
                        placeholder = 'Enter your email.'
                        handleChangeText = {(text) => {setEmail(text)}}
                        keyboardType = 'email-address'
                        autoCapitalize = 'none'
                    />
                    <CustomButton 
                        title = 'Submit'
                        containerStyles = {{width: '100%', marginTop: 28}}
                        handlePress = {handleSubmit}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4FDFF'
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        minHeight: height * 0.83
    },
    center_logo: {
        width: 160,
        height: 160
    }
})