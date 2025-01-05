import { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import MultiplePickerField from '../../components/MultiplePickerField';
import DatePickerComponent from '../../components/DatePicker';

import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';

import { router } from 'expo-router';

import { addDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../../services/firebaseConfig';
import { getAuth } from 'firebase/auth';

import { 
    getDeadMembers, 
    getCommitteeMembers, 
    getAliveMembers,
    getFuneralFees 
} from '../../libs/aggregationQueries';

const { height } = Dimensions.get('window');

const STATUS = [
    {value: true, label: 'Is Active'},
    {value: false, label: 'Completed'}
]

const FUNERALTYPE = [
    {value: 'one_week', label: 'One Week'},
    {value: 'final_funeral', label: 'Final Funeral'}
]

const AddFuneral = () => {
    const [creatorId, setCreatorId] = useState('');
    const [deadMembersList, setDeadMembersList] = useState([]);
    const [funeralTypeList, setFuneralTypeList] = useState(FUNERALTYPE);
    const [funeralDate, setFuneralDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [committeeMembersList, setCommitteeMembersList] = useState([]);
    const [statusList, setStatusList] = useState(STATUS);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [funeralFees, setFuneralFees] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        creatorId: '',
        deadMember: '',
        funeralType: '',
        funeralDate: '',
        committeeMembers: [],
        isActive: '',
    });

    useEffect(() => {
        const fetchMembers = async () => {
            const deadMembers = await getDeadMembers();
            setDeadMembersList(deadMembers);

            const receivedCommitteeMembersList = await getCommitteeMembers();
            setCommitteeMembersList(receivedCommitteeMembersList);

            const receivedAliveMembers = await getAliveMembers();
            setFamilyMembers(receivedAliveMembers);

            const receivedFuneralFees = await getFuneralFees()
            setFuneralFees(receivedFuneralFees);
        };
        fetchMembers();
        const loggedInUser = getAuth().currentUser;
        if (loggedInUser) {
            setCreatorId(loggedInUser.uid);
        } else{
            console.error('No user is logged in.');
            return '';
        }
    }, []);

    const handleChangeDate = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setFuneralDate(selectedDate);
            setForm({...form, funeralDate: selectedDate})
        }
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const validateFields = () => {
      if (form.committeeMembers === ''){
        alert('Family Head name is required');
        return false;
      };
      if (form.deadMember.trim() === ''){
          alert('Deceased should be selected.');
          return false;
      };
      if (form.funeralType.trim() === ''){
          alert('Type of funeral should be selected.');
          return false;
      };
      if (form.isActive === ''){
          alert('Is the funeral still ongoing or done.');
          return false;
      };
      return true;
    };

    const handleSubmit = async () => {
        const funeralFeesList = funeralFees.reduce((accumulator, currentValue) => {
            accumulator[currentValue.gender] = currentValue.amount;
            return accumulator
        }, {})
        console.log(funeralFeesList);
        const payload = {
            creatorId: creatorId,
            deadMember: form.deadMember,
            funeralType: form.funeralType,
            funeralDate: form.funeralDate,
            committeeMembers: form.committeeMembers,
            isActive: form.isActive,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        try {
            if (validateFields()) {
                setLoading(true);
                const response = await addDoc(collection(FIREBASE_FIRESTORE, 'funeral'), payload);

                const batch = writeBatch(FIREBASE_FIRESTORE);
                familyMembers.forEach((doc) => {
                    console.log('Balance: '+doc.balance);
                    if (doc.gender === 'male') {
                    batch.update(
                        doc.memberRef, 
                        {balance: isNaN(doc.balance) ? funeralFeesList.male : parseInt(doc.balance) - funeralFeesList.male}
                    )}else if (doc.gender === 'female') {
                        batch.update(
                            doc.memberRef,
                            {balance: isNaN(doc.balance) ? funeralFeesList.female : parseInt(doc.balance) - funeralFeesList.female}
                        )
                    }
                });
                await batch.commit();
                console.log('Successfully updated members')

                setForm({
                    creatorId: '',
                    deadMember: '',
                    funeralType: '',
                    funeralDate: '',
                    committeeMembers: '',
                    isActive: '',
                });  
                setLoading(false);
                router.push('/dashboard');
            }
        } catch (submitError) {
            if (submitError.response) {
                console.error('Failed to Create Funeral', submitError.response.data);
            } else if (submitError.request) {
                console.error('No response from the server. Network issue or server is down.');
            } else {
                console.error('Error during request setup', submitError.message);
            }
        } finally {
            setLoading(false);
            };
    };


    return (
        <SafeAreaView>
          <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView keyboardDismissMode='on-drag'>
                <View style={styles.container}>
                
                    <MultiplePickerField 
                        title = "Committee Members"
                        values = {form.committeeMembers}
                        items = {committeeMembersList}
                        setValues = {(value) => setForm({ ...form, committeeMembers: value })}
                    />
                    <PickerField 
                        title="Deceased"
                        value={form.deadMember}
                        items={deadMembersList}
                        handleChangeText={(value) => setForm({ ...form, deadMember: value })}
                    />
                    <PickerField 
                        title="Funeral Type"
                        value={form.funeralType}
                        items={funeralTypeList}
                        handleChangeText={(value) => setForm({ ...form, funeralType: value })}
                    />
                    <PickerField 
                        title="Status"
                        value={form.isActive}
                        items={statusList}
                        handleChangeText={(value) => setForm({ ...form, isActive: value })}
                    />
                    <DatePickerComponent
                        title='Select Date'
                        date={funeralDate}
                        setDate={setFuneralDate}
                        handleChangeDate={handleChangeDate}
                        showDatePicker={showDatePicker}
                        showPicker={showPicker}

                    />
                    {/*<View style={styles.submitButtonContainer}>*/}
                    {/*<CustomButton
                        title='Submit & Add More'
                        handlePress={handleSubmit}
                        containerStyles={{ marginTop: 20, paddingHorizontal: 10  }}
                    />*/}
                    <CustomButton
                        title='Submit & Exit'
                        handlePress={handleSubmit}
                        containerStyles={{ marginTop: 20, paddingHorizontal: 10 }}
                    />
                  {/*</View>*/}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddFuneral;

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