import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ActivityIndicator, 
    StyleSheet, 
    SectionList, 
    TouchableOpacity, 
    Button 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FeatherIcon from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSingleDocument } from '../../../libs/aggregationQueries';

export default function FuneralDetails() {
    const { id } = useLocalSearchParams();
    const [funeral, setFuneral] = useState({});
    const [fields, setFields] = useState([]);
    const [deadMember, setDeadMember] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const funeralDetails = await getSingleDocument(id, 'funeral');
                setFuneral(funeralDetails);
                const deadMember = await getSingleDocument(funeralDetails.deadMember, 'familyMembers')
                setDeadMember(deadMember)
            } catch (error) {
                console.error('Error fetching funeral details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMemberDetails();
    }, [id]);

    useEffect(() => {
        try {
            setFields([
                { label: "Dead Member", value: funeral.deadMember ? `${deadMember.firstName} ${deadMember.lastName}`: 'Unknown'},
                { 
                    label: "Funeral Date", 
                    value: funeral.funeralDate
                        ? (funeral.funeralDate.toDate ? funeral.funeralDate.toDate().toDateString() : funeral.funeralDate.toDateString())
                        : "No Date Provided"
                },
                { label: "Funeral Type", value: funeral.funeralType },
                { label: "Is Active", value: funeral.isActive ? "✔️" : "❌"},
            ]);
        } catch (error) {
            console.error('Failed to set fields to value', error);
        }
    }, [funeral, deadMember]);

    if (loading) {
        return <ActivityIndicator size="large" style={{marginTop: 34}}/>;
    }

    if (!funeral) {
        return <Text style={{marginTop: 34}}>Member not found.</Text>;
    }

    return (
        <SafeAreaView style={{backgroundColor: '#F4FDFF'}}>
            
            <View style={{paddingHorizontal: 16}}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{deadMember ? deadMember.firstName+' '+deadMember.lastName : 'Unknown'}</Text>
                <Text style={{ marginTop: 8, color: '#64748b' }}>Manage individual funeral information here.</Text>
                <Text style={{ marginTop: 16, marginBottom: 10, color: '#64748b', fontWeight: 'bold'}}>Funeral Information</Text>
            </View>
            
            { fields.map((field, index) => (
                <View key={index} style={styles.cardWrapper}>
                    <View style={styles.card}>

                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{field.label}</Text>
                        </View>

                        <View style={styles.cardAction}>
                            <Text style={styles.cardInfo}>{field.value}</Text>
                            <FeatherIcon
                              color="#9ca3af"
                              name="chevron-right"
                              size={22} 
                            />
                        </View>
                    </View>
                </View>
            ))}
            <Text style={{ marginTop: 16, marginBottom: 10, marginLeft: 16, color: '#64748b', fontWeight: 'bold'}}>Payments</Text>
            <View style={styles.cardWrapper}>
                <TouchableOpacity onPress={() => 
                    router.push('../membersToMakePayment')
                }>
                    <View style={styles.card}>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Make Payments</Text>
                        </View>

                        <View style={styles.cardAction}>
                            <Text style={styles.cardInfo}>Click Here</Text>
                            <FeatherIcon
                              color="#9ca3af"
                              name="chevron-right"
                              size={22} 
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
 
    </SafeAreaView>
            
    );
}

const styles = StyleSheet.create({
   
    card: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    cardWrapper: {
        borderBottomWidth: 1,
        borderColor: '#d6d6d6',
        // borderTopWidth: 2,
        backgroundColor: '#F4FDFF'
    },
    cardBody: {
        marginRight: 'auto',
        marginLeft: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    cardSubFamily: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '500',
        color: '#616d79',
        marginTop: 3,
    },
    cardAction: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 16
    },
    cardInfo: {
        fontSize: 16,
        fontWeight: '700',
        color: "#9ca3af",
    },
})