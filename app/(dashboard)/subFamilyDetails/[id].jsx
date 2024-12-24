import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SectionList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FeatherIcon from '@expo/vector-icons/Feather';
import { getSingleDocument } from '../../../libs/aggregationQueries';

export default function SubFamilyDetails() {
    const { id } = useLocalSearchParams();
    const [fields, setFields] = useState([])
    const [subFamily, setSubFamily] = useState('')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const subFamily = await getSingleDocument(id, 'subFamilies')
                setSubFamily(subFamily)
            } catch (error) {
                console.error('Error fetching subFamily details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMemberDetails();
    }, [id]);

    useEffect(() => {
        try {
            setFields([
                { label: "Family Name", value: `${subFamily.subFamilyName}` },
                { label: "Sub Family Head", value: subFamily.subFamilyHeadName },
            ]);
        } catch (error) {
            console.error('Failed to set fields to value', error);
        }
    }, [subFamily]);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (!subFamily) {
        return <Text>Sub Family not found.</Text>;
    }

    return (
        
        <View style={styles.container}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{subFamily.subFamilyName}</Text>
                <Text style={{ marginTop: 8, color: '#64748b' }}>Manage individual sub family's information here.</Text>
                <Text style={{ marginTop: 16, marginBottom: 10, color: '#64748b', fontWeight: 'bold'}}>Personal Information</Text>
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
        </View>  
            
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
    },
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