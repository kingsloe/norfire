import { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import { router } from 'expo-router';
import { getSubFamilies } from '../../libs/aggregationQueries';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../../services/firebaseConfig';
import { getAuth } from 'firebase/auth';

const { height } = Dimensions.get('window');

const STATUS = [
    { value: true, label: 'Alive' },
    { value: false, label: 'Dead' },
];

const GENDER = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const POSITION = [
    { value: 'head_of_super_family', label: 'Head of Super Family' },
    { value: 'head_of_sub_family', label: 'Head of Sub Family' },
    { value: 'head_of_committee', label: 'Head of Committee' },
    { value: 'member_of_committee', label: 'Member of Committee' },
    { value: 'member', label: 'Member' },
]

const AddFamilyMember = () => {
    const [subFamilyList, setSubFamilyList] = useState([]);
    const [positionList, setPositionList] = useState(POSITION);
    const [statusList, setStatusList] = useState(STATUS);
    const [genderList, setGenderList] = useState(GENDER);
    const [creatorId, setCreatorId] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      authId: '',
      creatorId: '',
      firstName: '',
      lastName: '',
      subFamily: '',
      position: '',
      isAlive: '',
      gender: '',
      contact: '',
    });

    useEffect(() => {
        const fetchSubFamilies = async () => {
            const subFamilies = await getSubFamilies();
            setSubFamilyList(subFamilies);
        }
        fetchSubFamilies();
        const loggedInUser = getAuth().currentUser;
        if (loggedInUser) {
          setCreatorId(loggedInUser.uid);
        } else {
          console.log('No user is logged in.');
          return '';
        }
    }, []);
    const validateFields = () => {
        if (form.firstName.trim() === '') {
            alert('First name is required');
            return false;
        }
        if (form.lastName.trim() === '') {
            alert('Last name is required');
            return false;
        }
        if (form.subFamily.trim() === '') {
            alert('Sub family is required');
            return false;
        }
        if (form.position.trim() === '') {
            alert('Position is required');
            return false;
        }
        if (form.isAlive === '') {
            alert('Status is required');
            return false;
        }
        if (form.gender.trim() === '') {
            alert('Gender is required');
            return false;
        }
        if (form.contact.trim() === '') {
            alert('Contact is required');
            return false;
        }
        if (form.contact.length !== 10){
          alert('Contact must be 10 digits');
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        const payload = {
            authId: form.authId,
            creatorId: creatorId,
            firstName: form.firstName,
            lastName: form.lastName,
            subFamily: form.subFamily,
            position: form.position,
            isAlive: form.isAlive,
            gender: form.gender,
            contact: form.contact,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        try {
          if (validateFields()) {
            setLoading(true);
            const response = await addDoc(collection(FIREBASE_FIRESTORE, 'familyMembers'), payload);
            setForm({
              authId: '',
              creatorId: '',
              firstName: '',
              lastName: '',
              subFamily: '',
              position: '',
              isAlive: '',
              gender: '',
              contact: '',
          });  
          setLoading(false);
          }
        } catch (submitError) {
            if (submitError.response) {
                console.error('Failed to add Family Member', submitError.response.data);
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
                        title='First Name'
                        otherStyles={{ marginTop: 20 }}
                        value={form.firstName}
                        placeholder='Enter First name'
                        handleChangeText={(e) => setForm({ ...form, firstName: e })}
                    />
                    <FormField 
                        title='Last name'
                        otherStyles={{ marginTop: 20 }}
                        value={form.lastName}
                        placeholder='Enter Last name'
                        handleChangeText={(e) => setForm({ ...form, lastName: e })}
                    />
                    <PickerField 
                        title="Sub Family"
                        value={form.subFamily}
                        items={subFamilyList || []}
                        handleChangeText={(value) => setForm({ ...form, subFamily: value })}
                    />
                    <PickerField 
                        title="Position"
                        value={form.position || []}
                        items={positionList}
                        handleChangeText={(value) => setForm({ ...form, position: value })}
                    />
                    <PickerField 
                        title="Status"
                        value={form.isAlive}
                        items={statusList}
                        handleChangeText={(value) => setForm({ ...form, isAlive: value })}
                    />
                    <PickerField 
                        title="Gender"
                        value={form.gender || []}
                        items={genderList}
                        handleChangeText={(value) => setForm({ ...form, gender: value })}
                    />
                    <FormField 
                        title='Contact'
                        otherStyles={{ marginTop: 20 }}
                        value={form.contact}
                        placeholder='Enter Contact'
                        handleChangeText={(e) => setForm({ ...form, contact: e })}
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

export default AddFamilyMember;

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
