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
import { getSuperFamily } from '../../libs/aggregationQueries';

const { height } = Dimensions.get('window');

const GENDER = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const AddFuneralFee = () => {
    const [creatorId, setCreatorId] = useState('');
    const [amount, setAmount] = useState('');
    // const [gender, setGender] = useState('');
    const [genderList, setGenderList] = useState(GENDER);
    const [superFamilyList, setSuperFamilyList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      creatorId: '',
      amount: '',
      gender: '',
      superFamilyId: '',
    });

    useEffect(() => {
      const fetchSuperFamily = async () => {
        const superFamily = await getSuperFamily();
        setSuperFamilyList(superFamily);
      };
      fetchSuperFamily();
      const loggedInUser = getAuth().currentUser;
      if (loggedInUser) {
        setCreatorId(loggedInUser.uid);
      } else{
        console.log('No user is logged in.');
        return '';
      }
    }, []);

    const validateFields = () => {
      if (form.amount.trim() === ''){
        alert('Family Name is required');
        return false;
      };
      if (form.gender.trim() === ''){
        alert('Family Head name is required');
        return false;
      };
      return true;
    };

    const handleSubmit = async () => {
        const payload = {
            creatorId: creatorId,
            superFamily: form.superFamily,
            amount: parseInt(form.amount),
            gender: form.gender,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        try {
          if (validateFields()) {
            setLoading(true);
            const response = await addDoc(collection(FIREBASE_FIRESTORE, 'funeralFees'), payload);
            setForm({
              creatorId: '',
              superFamily: '',
              amount: '',
              gender: '',
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
        } finally {
          setLoading(false);
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
                        title='Amount'
                        otherStyles={{ marginTop: 20 }}
                        value={form.amount}
                        placeholder='Enter First name'
                        handleChangeText={(value) => setForm({ ...form, amount: value })}
                    />
                    <PickerField 
                        title="Gender"
                        value={form.gender || []}
                        items={genderList}
                        handleChangeText={(value) => setForm({ ...form, gender: value })}
                    />
                    <PickerField 
                        title="Super Family"
                        value={form.superFamily}
                        items={superFamilyList}
                        handleChangeText={(value) => setForm({ ...form, superFamily: value })}
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

export default AddFuneralFee;

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
