import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FormField, CustomButton } from '../../../components';
import { getSingleDocument } from '../../../libs/aggregationQueries';
import Spinner from 'react-native-loading-spinner-overlay';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../../../services/firebaseConfig';

const { height } = Dimensions.get('window');

export default function UpdatePayment() {
    const { id } = useLocalSearchParams();
    const [amount, setAmount] = useState('');
    const [newBalance, setNewBalance] = useState('');
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const paymentHistory = await getSingleDocument(id, 'fees');
                if (paymentHistory?.amount) {
                    setAmount(paymentHistory.amount.toString());
                }
                if (paymentHistory?.balance) {
                    setNewBalance(parseInt(paymentHistory.balance)-paymentHistory.amount);
                }
                setMemberId(paymentHistory.familyMemberId)
            } catch (error) {
                console.error("Error fetching payment history:", error);
            }
        };
        fetchPaymentHistory();

    }, [id]);


    const handleSubmit = async () => {
        try {
            setLoading(true);
            const targetDocument = await doc(FIREBASE_FIRESTORE, 'fees', id);
            const sending = await updateDoc(targetDocument, {
                amount: parseInt(amount),
                balance: parseInt(amount) + parseInt(newBalance)
            })
            const targetDocument2 = await doc(FIREBASE_FIRESTORE, 'familyMembers', memberId);
            const sending2 = await updateDoc(targetDocument2, {
                balance: parseInt(amount) + parseInt(newBalance)
            })
            setLoading(false);
            router.back();
        } catch (error) {
            console.error('Error submitting payment update: ', error);
        } finally {
            setLoading(false)
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
                        value={amount}
                        placeholder='Enter Amount'
                        handleChangeText={(e) => setAmount(e)}
                        keyboardType='numeric'
                    />
                    <CustomButton 
                        title='Submit'
                        containerStyles={{ marginTop: 20 }}
                        handlePress={handleSubmit}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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