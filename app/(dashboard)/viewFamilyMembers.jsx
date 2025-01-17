import React, { useState, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import { router } from 'expo-router'
import FeatherIcon from '@expo/vector-icons/Feather';
import { getAliveMembers, getSubFamilies } from '../../libs/aggregationQueries';


export default function ViewFamilyMember() {
    const [input, setInput] = useState('');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [subFamilyList, setSubFamilyList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAliveMembers = async () => {
            try {
                const aliveMembers = await getAliveMembers();
                setFamilyMembers(aliveMembers);

                const subFamilies = await getSubFamilies();
                setSubFamilyList(subFamilies);
            } catch (error) {
                console.error("Couln't fetch alive members", error);
            } finally {
                setLoading(false)
            }
        }
        fetchAliveMembers();
    }, []);

    useEffect(() => {
        try {
            if (subFamilyList.length && familyMembers.length) {
                const updatedFamilyMembers = familyMembers.map( 
                    familyMember => {
                        const matchedSubFamily = subFamilyList.find( subFamily => subFamily.value === familyMember.subFamilyId);
                        return {
                            ...familyMember,
                            subFamilyName: matchedSubFamily ? matchedSubFamily.label : 'Unkown'
                        }
                    }
                )
                setFamilyMembers(updatedFamilyMembers);
            }
        } catch (error) {
            console.error("Couln't update family members: ", error);
        }
    }, [subFamilyList]);

    const filteredRows = useMemo(() => {

        const rows = [];
        const query = input.toLowerCase();

        for (const item of familyMembers) {
            const nameIndex = item.label.toLowerCase().search(query);

            if (nameIndex !== -1) {
                rows.push({
                ...item,
                index: nameIndex,
                });
            }
        }

        return rows.sort((a, b) => a.index - b.index);
    }, [input, familyMembers]);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <View style={styles.searchWrapper}>
                    <View style={styles.search}>
                        <View style={styles.searchIcon}>
                            <FeatherIcon
                                color="#848484"
                                name="search"
                                size={17} 
                            />
                        </View>

                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={val => setInput(val)}
                            placeholder="Start typing.."
                            placeholderTextColor="#848484"
                            returnKeyType="done"
                            style={styles.searchControl}
                            value={input} 
                        />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.searchContent} keyboardDismissMode='on-drag'>
                    {filteredRows.length ? (
                        filteredRows.map(({ label, subFamilyName, value }, index) => {
                            return (
                                <View key={index} style={styles.cardWrapper}>
                                    <TouchableOpacity onPress={() =>
                                        router.push(`/membersDetails/${value}`)
                                    }> 
                                        <View style={styles.card}>
                                            <View style={[styles.cardImg, styles.cardAvatar]}>
                                                <Text style={styles.cardAvatarText}>{label[0]}</Text>
                                            </View>

                                            <View style={styles.cardBody}>
                                                <Text style={styles.cardTitle}>{label}</Text>

                                                <Text style={styles.cardSubFamily}>{subFamilyName}</Text>
                                            </View>

                                            <View style={styles.cardAction}>
                                                <FeatherIcon
                                                    color="#9ca3af"
                                                    name="chevron-right"
                                                    size={22} 
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                            })
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
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    /** Search */
    search: {
        position: 'relative',
        backgroundColor: '#efefef',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    searchWrapper: {
        paddingTop: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#efefef',
    },
    searchIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 34,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    searchControl: {
        paddingVertical: 10,
        paddingHorizontal: 14,
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
    /** Card */
    card: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        display: 'flex',
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
        paddingRight: 16,
    },
});