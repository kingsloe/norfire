import { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../../services/firebaseConfig';
import { getAuth } from 'firebase/auth';

const { height } = Dimensions.get('window');


const AddSuperFamily = () => {
    const [creatorId, setCreatorId] = useState('');
    const [superFamilyName, setSuperFamilyName] = useState('');
    const [superFamilyHeadName, setSuperFamilyHeadName] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        creatorId: '',
        superFamilyName: '',
        superFamilyHeadName: ''
    });

    useEffect(() => {
        const loggedInUser = getAuth().currentUser;
        if (loggedInUser) {
            setCreatorId(loggedInUser.uid);
        } else{
            console.log('No user is logged in.');
            return '';
        }
    }, []);

    const validateFields = () => {
        if (form.superFamilyName.trim() === ''){
            alert('Family Name is required');
            return false;
        };
        if (form.superFamilyHeadName.trim() === ''){
            alert('Family Head name is required');
            return false;
        };
        return true;
    };

    const handleSubmit = async () => {
        const payload = {
            creatorId: creatorId,
            superFamilyName: form.superFamilyName,
            superFamilyHeadName: form.superFamilyHeadName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        try {
            if (validateFields()) {
                setLoading(true);
                const response = await addDoc(collection(FIREBASE_FIRESTORE, 'superFamily'), payload);
                setForm({
                    creatorId: '',
                    superFamilyName: '',
                    superFamilyHeadName: ''
                });  
                setLoading(false);
            }
        } catch (submitError) {
            if (submitError.response) {
                console.error('Failed to add Super Family', submitError.response.data);
            } else if (submitError.request) {
                console.error('No response from the server. Network issue or server is down.');
            } else {
                console.error('Error during request setup', submitError.message);
            }
        }
    };

    const handleSubmitAndExit = () => {
        if (validateFields()){
            handleSubmit();
            router.push('/dashboard');
        }
    }

    return (
        <SafeAreaView>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView keyboardDismissMode='on-drag'>
                <View style={styles.container}>
                    <FormField 
                        title='Family Name'
                        otherStyles={{ marginTop: 20 }}
                        value={form.superFamilyName}
                        placeholder='Enter First name'
                        handleChangeText={(e) => setForm({ ...form, superFamilyName: e })}
                    />
                    <FormField 
                        title='Super Family Head'
                        otherStyles={{ marginTop: 20 }}
                        value={form.superFamilyHeadName}
                        placeholder='Enter First name'
                        handleChangeText={(e) => setForm({ ...form, superFamilyHeadName: e })}
                    />
                    <View style={styles.submitButtonContainer}>
                        <CustomButton
                            title='Submit & Add More'
                            handlePress={handleSubmit}
                            containerStyles={{ marginTop: 20, paddingHorizontal: 10  }}
                        />
                        <CustomButton
                            title='Submit & Exit'
                            handlePress={handleSubmitAndExit}
                            containerStyles={{ marginTop: 20, paddingHorizontal: 10 }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddSuperFamily;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FDFF',
        justifyContent: 'center',
        paddingHorizontal: 16,
        minHeight: height * 0.83,
        marginBottom: 10
    },
    submitButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    }
});
