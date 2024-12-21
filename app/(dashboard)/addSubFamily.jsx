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


const AddSubFamily = () => {
    const [creatorId, setCreatorId] = useState('');
    const [subFamilyName, setSubFamilyName] = useState('');
    const [subFamilyHeadName, setSubFamilyHeadName] = useState('');
    const [superFamilyList, setSuperFamilyList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      creatorId: '',
      subFamilyName: '',
      subFamilyHeadName: '',
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
      if (form.subFamilyName.trim() === ''){
        alert('Family Name is required');
        return false;
      };
      if (form.subFamilyHeadName.trim() === ''){
        alert('Family Head name is required');
        return false;
      };
      return true;
    };

    const handleSubmit = async () => {
        const payload = {
            creatorId: creatorId,
            superFamily: form.superFamily,
            subFamilyName: form.subFamilyName,
            subFamilyHeadName: form.subFamilyHeadName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        try {
          if (validateFields()) {
            setLoading(true);
            const response = await addDoc(collection(FIREBASE_FIRESTORE, 'subFamilies'), payload);
            setForm({
              creatorId: '',
              superFamily: '',
              subFamilyName: '',
              subFamilyHeadName: '',
          });  
          setLoading(false);
          }
        } catch (error) {
            console.error("Couln't submit data: ", error)
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
                        title='Family Name'
                        otherStyles={{ marginTop: 20 }}
                        value={form.subFamilyName}
                        placeholder='Enter Family name'
                        handleChangeText={(e) => setForm({ ...form, subFamilyName: e })}
                    />
                    <FormField 
                        title='Sub Family Head'
                        otherStyles={{ marginTop: 20 }}
                        value={form.subFamilyHeadName}
                        placeholder='Enter Family Head'
                        handleChangeText={(e) => setForm({ ...form, subFamilyHeadName: e })}
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

export default AddSubFamily;

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
