import { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { FormField, CustomButton } from '../../../../components';
import { getSingleDocument, getFuneralFeesByGender } from '../../../../libs/aggregationQueries';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLocalSearchParams, router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../../../../services/firebaseConfig';

const { height } = Dimensions.get('window');


const MakePayment = () => {
    const { id } = useLocalSearchParams();
    const [userId, setUserId] = useState('');
    const [subFamilyId, setSubFamilyId] = useState('');
    const [amount, setAmount] = useState('');
    const [amountToPay, setAmountToPay] = useState('');
    const [balance, setBalance] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        userId : '',
        familyMemberId : '',
        subFamilyId : '',
        amount : '',
        balance : ''
    });

    useEffect(() => {
        const loggedInUser = getAuth().currentUser;
        if (loggedInUser) {
            setUserId(loggedInUser.uid);
        } else {
            console.log('No user is logged in.');
            return '';
        }
        const fetchSubFamily = async () => {
            try {
                const fetchedMemberDetails = await getSingleDocument(id, 'familyMembers');
                setSubFamilyId(fetchedMemberDetails.subFamily);
                setInitialBalance(fetchedMemberDetails.balance);
                if (fetchedMemberDetails.gender == 'male') {
                    const getAmoutToPay = await getFuneralFeesByGender('male');
                    setAmountToPay(getAmoutToPay[0].amount);
                } else if (fetchedMemberDetails.gender == 'female') {
                    const getAmoutToPay = await getFuneralFeesByGender('female');
                    setAmountToPay(getAmoutToPay[0].amount);
                }
            } catch (error) {
                console.error('Error fetching sub family:', error);
                return '';
            }
        }
        fetchSubFamily();
    }, []);

    useEffect(() => {
        try {
            if (parseInt(initialBalance) > 0) {
                const currentBalance = parseInt(amount) + parseInt(initialBalance);
                // const newBalance = currentAmount - parseInt(amountToPay) || 0;
                // const newBalance = currentBalance
                setBalance(currentBalance);
            } else if (parseInt(initialBalance) < 0) {
                const currentBalance = parseInt(amount) - parseInt(amountToPay);
                // const newBalance = currentBalance + parseInt(initialBalance) || 0;
                // const newBalance = currentBalance
                setBalance(currentBalance);
            }
        } catch (error) {
            console.error('Failed to update balance', error);
        }
    }, [amount, initialBalance, amountToPay]);

    const validateFields = () => {
        if (form.amount === ''){
            alert('Amount is required');
            return false;
        };
        return true;
    };

    const handleSubmit = async () => {
        const payload = {
            userId : userId,
            familyMemberId : id,
            subFamilyId : subFamilyId,
            amount : parseInt(form.amount),
            balance : parseInt(balance),
            createdAt : serverTimestamp(),
            updatedAt : serverTimestamp()
        }
        try {
            if (validateFields()) {
                setLoading(true);
                const response = await addDoc(collection(FIREBASE_FIRESTORE, 'fees'), payload);
                const targetDocument = doc(FIREBASE_FIRESTORE, 'familyMembers', id);
                await updateDoc(targetDocument, {
                    balance: balance
                })
                setForm({
                    userId : '',
                    familyMemberId : '',
                    subFamilyId : '',
                    amount : '',
                    balance : ''
                });
                setLoading(false);
                router.replace('/funeralDetails/membersToMakePayment')

            }
        } catch (error) {
            console.error('Failed to submit payload: ', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView>
                <View style={styles.container}>
                    <FormField 
                        title = 'Amount'
                        value = {form.amount}
                        placeholder = 'Enter Amount'
                        handleChangeText = {(e) => {
                            setForm({...form, amount: e})
                            setAmount(parseInt(e) || 0)
                        }}
                        keyboardType = 'numeric'
                    />
                    <CustomButton 
                        title = 'Submit'
                        containerStyles = {{ marginTop: 20 }}
                        handlePress = { handleSubmit }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default MakePayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FDFF',
        justifyContent: 'center',
        paddingHorizontal: 16,
        minHeight: height * 0.83,
        marginBottom: 10
    },
});
