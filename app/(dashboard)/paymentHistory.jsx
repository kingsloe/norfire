import React, { useState, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FeatherIcon from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getPaymentHistory, getAliveMembers, getSubFamilies } from '../../libs/aggregationQueries';

export default function PaymentHistory() {
    const [input, setInput] = useState('');
    const [paymentsHistory, setPaymentsHistory] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [subFamilies, setSubFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = useLocalSearchParams();

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            setLoading(true);
            try {
                const paymentsHistoryData = await getPaymentHistory(pathname.funeralId);
                const aliveMembers = await getAliveMembers();
                const subFamilies = await getSubFamilies();

                const updatedPaymentsHistory = paymentsHistoryData.map(paymentHistory => {
                    const matchedFamilyMember = aliveMembers.find(member => member.value === paymentHistory.familyMemberId);
                    const matchedSubFamily = subFamilies.find(subFamily => subFamily.value === paymentHistory.subFamilyId);
                    return {
                        ...paymentHistory,
                        familyMemberName: matchedFamilyMember?.label || 'Unknown',
                        subFamilyName: matchedSubFamily?.label || 'Unknown'
                    };
                });

                setPaymentsHistory(updatedPaymentsHistory);
                setFamilyMembers(aliveMembers);
                setSubFamilies(subFamilies);

            } catch (error) {
                console.error("Couldn't fetch data", error);
                alert("Error fetching data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, []);

    const filteredRows = useMemo(() => {
        const query = input.toLowerCase();
        return paymentsHistory.filter(item => {
            const familyNameMatch = item.familyMemberName?.toLowerCase().includes(query) || false;
            const subFamilyNameMatch = item.subFamilyName?.toLowerCase().includes(query) || false;

        return familyNameMatch || subFamilyNameMatch;
    });
    }, [input, paymentsHistory]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 34 }} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                {/* ... header ... */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="arrow-back" size={24} color="#000000" />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#000000" }}>Payment History</Text>
                    <TouchableOpacity onPress={() => router.push('../../(tabs)/dashboard')}>
                        <View style={{ marginRight: 20 }}>
                            <MaterialIcons name="home" size={24} color="#000000" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ... search bar ... */}
                <View style={styles.searchWrapper}>
                    <View style={styles.search}>
                        <View style={styles.searchIcon}>
                            <FeatherIcon color="#848484" name="search" size={17} />
                        </View>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={setInput}
                            placeholder="Start typing.."
                            placeholderTextColor="#848484"
                            returnKeyType="done"
                            style={styles.searchControl}
                            value={input}
                        />
                    </View>
                </View>

                {/* ... list of payments ... */}
                <ScrollView contentContainerStyle={styles.searchContent} keyboardDismissMode='on-drag'>
                    {filteredRows.length ? (
                        filteredRows.map(item => (
                            <View key={item.familyMemberId} style={styles.cardWrapper}>
                                <TouchableOpacity onPress={() => router.push(`./updatePayment/${item.id}`)}>
                                    <View style={styles.card}>
                                        <View style={[styles.cardImg, styles.cardAvatar]}>
                                            <Text style={styles.cardAvatarText}>
                                                {item.familyMemberName ? item.familyMemberName[0] : 'U'}
                                            </Text>
                                        </View>
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle}>{item.familyMemberName}</Text>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={styles.cardSubFamily}>{item.subFamilyName}</Text>
                                                <Text style={styles.cardSubFamily}>Amount: {item.amount}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardAction}>
                                            <FeatherIcon color="#9ca3af" name="chevron-right" size={22} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.searchEmpty}>No results</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,
        paddingVertical: 10,
    },
    search: {
        position: 'relative',
        backgroundColor: '#efefef',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchWrapper: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#efefef',
    },
    searchIcon: {
        position: 'absolute',
        left: 0,
        width: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchControl: {
        paddingVertical: 10,
        paddingLeft: 34,
        width: '100%',
        fontSize: 16,
        fontWeight: '500',
    },
    searchContent: {
        paddingLeft: 24,
    },
    searchEmpty: {
        textAlign: 'center',
        paddingTop: 16,
        fontWeight: '500',
        fontSize: 15,
        color: '#9ca1ac',
    },
    card: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardWrapper: {
        borderBottomWidth: 1,
        borderColor: '#d6d6d6',
    },
    cardImg: {
        width: 42,
        height: 42,
        borderRadius: 20,
    },
    cardAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9ca1ac',
    },
    cardAvatarText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardBody: {
        marginLeft: 12,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    cardAction: {
        paddingRight: 16,
    },
    cardSubFamily: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '500',
        color: '#616d79',
        marginTop: 3,
        paddingRight: 15
    },
});